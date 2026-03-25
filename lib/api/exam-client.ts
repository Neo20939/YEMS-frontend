/**
 * Exam API Client
 * 
 * Handles all exam-related API calls for objective and theory examinations.
 */

import axios from 'axios'
import { getAuthToken } from './auth-config'
import { useUser } from '@/contexts/UserContext'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

/**
 * Create axios instance with auth interceptors
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60 second timeout for exam operations
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Types
export interface Exam {
  id: string
  title: string
  description: string
  type: 'objective' | 'theory' | 'mixed'
  duration: number // in minutes
  totalQuestions: number
  totalMarks: number
  status: 'not-started' | 'upcoming' | 'in-progress' | 'completed' | 'locked'
  subject?: string
  iconType?: 'math' | 'science' | 'english' | 'philosophy' | 'history' | 'computer'
  instructions?: string
  passingScore?: number
  createdAt?: string
  updatedAt?: string
}

export interface QuestionOption {
  id: string
  text: string
  isCorrect?: boolean
}

export interface ExamQuestion {
  id: string
  examId: string
  questionNumber: number
  questionText: string
  questionType: 'multiple-choice' | 'theory' | 'essay'
  marks: number
  options?: QuestionOption[]
  correctAnswer?: string
  explanation?: string
}

export interface SavedAnswer {
  id?: string
  questionId: string
  examId: string
  studentId: string
  answerText?: string // For theory questions
  selectedOptionIds?: string[] // For objective questions
  isFlagged?: boolean
  isDraft: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ExamProgress {
  examId: string
  studentId: string
  totalQuestions: number
  answeredQuestions: number
  flaggedQuestions: number
  unvisitedQuestions: number
  percentageComplete: number
  status: 'not-started' | 'in-progress' | 'completed'
  startTime?: string
  submittedAt?: string
  answers?: SavedAnswer[]
}

export interface StartExamResponse {
  examId: string
  studentId: string
  sessionId: string
  startTime: string
  endTime: string
  status: 'in-progress'
}

export interface SubmitExamResponse {
  examId: string
  studentId: string
  submittedAt: string
  status: 'submitted'
  message: string
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

/**
 * Get all exams (optionally filtered by type)
 */
export async function getExams(type?: 'objective' | 'theory'): Promise<Exam[]> {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    let url: string
    if (type) {
      url = `/exams/type/${type}`
    } else {
      url = '/exams/'
    }

    const { data } = await apiClient.get<Exam[]>(url)
    return data
  } catch (error) {
    console.error('Failed to fetch exams:', error)
    return []
  }
}

/**
 * Create a new exam
 */
export async function createExam(examData: {
  title: string
  description: string
  type: 'objective' | 'theory' | 'mixed'
  duration: number
  totalMarks: number
  subject?: string
  iconType?: 'math' | 'science' | 'english' | 'philosophy' | 'history' | 'computer'
  instructions?: string
  passingScore?: number
}): Promise<Exam> {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const { data } = await apiClient.post<Exam>('/exams', examData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to create exam',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Get student-specific exams
 */
export async function getStudentExams(): Promise<Exam[]> {
  try {
    const { data } = await apiClient.get<Exam[]>('/student/exams')
    return data
  } catch (error) {
    console.error('Failed to fetch student exams:', error)
    return []
  }
}

/**
 * Get teacher-specific exams
 */
export async function getTeacherExams(): Promise<Exam[]> {
  try {
    const { data } = await apiClient.get<Exam[]>('/teacher/exams')
    return data
  } catch (error) {
    console.error('Failed to fetch teacher exams:', error)
    return []
  }
}

/**
 * Get specific exam details
 */
export async function getExamById(examId: string): Promise<Exam | null> {
  try {
    const { data } = await apiClient.get<Exam>(`/exams/${examId}`)
    return data
  } catch (error) {
    console.error(`Failed to fetch exam ${examId}:`, error)
    return null
  }
}

/**
 * Get all questions for an exam
 */
export async function getExamQuestions(examId: string): Promise<ExamQuestion[]> {
  try {
    // First get the exam to know total questions
    const exam = await getExamById(examId)
    if (!exam) {
      throw new Error('Exam not found')
    }

    // The API doesn't have a direct "get all questions" endpoint
    // We'll need to fetch questions individually or use the exam details
    // For now, return empty array - questions will be loaded as needed
    return []
  } catch (error) {
    console.error(`Failed to fetch questions for exam ${examId}:`, error)
    return []
  }
}

/**
 * Get specific question from an exam
 */
export async function getQuestionById(
  examId: string,
  questionId: string
): Promise<ExamQuestion | null> {
  try {
    const { data } = await apiClient.get<ExamQuestion>(
      `/exams/${examId}/questions/${questionId}`
    )
    return data
  } catch (error) {
    console.error(`Failed to fetch question ${questionId}:`, error)
    return null
  }
}

/**
 * Start an exam session
 */
export async function startExam(
  examId: string,
  studentId: string
): Promise<StartExamResponse> {
  try {
    const { data } = await apiClient.post<StartExamResponse>('/exams/start', {
      examId,
      studentId,
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to start exam',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Save an answer (supports draft mode)
 */
export async function saveAnswer(
  examId: string,
  answerData: {
    questionId: string
    answerText?: string
    selectedOptionIds?: string[]
    isDraft?: boolean
  }
): Promise<SavedAnswer> {
  try {
    const token = getAuthToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    // Get student ID from stored user data
    const userStr = localStorage.getItem('auth_user')
    const user = userStr ? JSON.parse(userStr) : null
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { data } = await apiClient.post<SavedAnswer>(
      `/exams/${examId}/answers`,
      {
        questionId: answerData.questionId,
        answerText: answerData.answerText,
        selectedOptionIds: answerData.selectedOptionIds,
        isDraft: answerData.isDraft ?? true,
      }
    )
    return data
  } catch (error) {
    console.error('Failed to save answer:', error)
    throw error
  }
}

/**
 * Submit completed exam
 */
export async function submitExam(
  examId: string,
  studentId: string,
  answers: SavedAnswer[]
): Promise<SubmitExamResponse> {
  try {
    const { data } = await apiClient.post<SubmitExamResponse>('/exams/submit', {
      examId,
      studentId,
      answers,
    })
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to submit exam',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Get exam progress for a specific student
 */
export async function getExamProgress(
  examId: string,
  studentId: string
): Promise<ExamProgress | null> {
  try {
    const { data } = await apiClient.get<ExamProgress>(
      `/exams/${examId}/progress/${studentId}`
    )
    return data
  } catch (error) {
    console.error(`Failed to fetch exam progress:`, error)
    return null
  }
}

/**
 * Helper: Convert API Exam to UI ExamCard format
 */
export function convertExamToCard(exam: Exam) {
  return {
    id: exam.id,
    title: exam.title,
    description: exam.description,
    duration: exam.duration,
    questions: exam.totalQuestions,
    questionType: exam.type === 'objective' ? 'MCQs' : 'Theory',
    status: exam.status === 'not-started' ? 'not-started' :
            exam.status === 'in-progress' ? 'new' :
            exam.status === 'completed' ? 'locked' : 'upcoming',
    iconType: exam.iconType || 'science',
    route: exam.type === 'objective' ? `/objective-exam?id=${exam.id}` : `/theory-exam?id=${exam.id}`,
  }
}

/**
 * Create a new question for an exam
 */
export async function createQuestion(
  examId: string,
  questionData: {
    sectionId: string
    type: 'multiple-choice' | 'single-choice' | 'essay' | 'short-answer'
    text: string
    order: number
    marks: number
    options?: { id: string; label: string; text: string }[]
    metadata?: {
      difficulty?: 'easy' | 'medium' | 'hard'
      topic?: string
      tags?: string[]
    }
  }
): Promise<ExamQuestion> {
  try {
    const { data } = await apiClient.post<ExamQuestion>(
      `/exams/${examId}/questions`,
      questionData
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to create question',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Update an existing question
 */
export async function updateQuestion(
  examId: string,
  questionId: string,
  questionData: {
    type?: 'multiple-choice' | 'single-choice' | 'essay' | 'short-answer'
    text?: string
    order?: number
    marks?: number
    options?: { id: string; label: string; text: string }[]
    metadata?: {
      difficulty?: 'easy' | 'medium' | 'hard'
      topic?: string
      tags?: string[]
    }
  }
): Promise<ExamQuestion> {
  try {
    const { data } = await apiClient.put<ExamQuestion>(
      `/exams/${examId}/questions/${questionId}`,
      questionData
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to update question',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Delete a question
 */
export async function deleteQuestion(
  examId: string,
  questionId: string
): Promise<void> {
  try {
    await apiClient.delete(`/exams/${examId}/questions/${questionId}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to delete question',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}
