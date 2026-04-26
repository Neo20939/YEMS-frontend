/**
 * Exam API Client
 * 
 * Handles all exam-related API calls for objective and theory examinations.
 */

import { axios } from '@/lib/axios-shim'
import { getAuthToken, AUTH_CONFIG } from './auth-config'
import type { ExamCard } from '@/components/exam'


const apiClient = axios.create({
  baseURL: '/api',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

apiClient.interceptors.request.use((config: any) => {
  const token = getAuthToken()
  if (token) {
    config.headers['x-session-token'] = token
  }
  return config
})

// Handle response errors
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
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

export interface SubmissionAnswer {
  id: string
  submissionId: string
  questionId: string
  answerText?: string // For theory questions
  selectedOptionIds?: string[] // For objective questions
  isDraft: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ExamSubmission {
  id: string
  examId: string
  studentId: string
  status: 'not-started' | 'in-progress' | 'completed' | 'submitted'
  answers: SubmissionAnswer[]
  startTime?: string
  submittedAt?: string
  createdAt?: string
  updatedAt?: string
}

export interface SavedAnswer {
  questionId: string
  answerText?: string
  selectedOptionIds?: string[]
  isDraft: boolean
  isFlagged?: boolean
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
    // Backend handles role-based access via session cookie
    const url = type ? `exams?type=${type}` : 'exams/'

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

    const { data } = await apiClient.post<Exam>('exams', examData)
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
    const { data } = await apiClient.get<Exam[]>('student/exams')
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
    const { data } = await apiClient.get<Exam[]>('teacher/exams')
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
    // Backend handles role-based access via session cookie
    const url = `exams/${examId}`
    const { data } = await apiClient.get<Exam>(url)
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
      `exams/${examId}/questions/${questionId}`
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
    // Backend uses session to get studentId from cookie - no need to pass it
    const { data } = await apiClient.post<StartExamResponse>('exams/submissions', {
      examId,
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
export async function saveSubmissionAnswers(
  submissionId: string,
  answers: Record<string, string | null>
): Promise<ExamSubmission> {
  try {
    const { data } = await apiClient.patch<ExamSubmission>(
      `exams/submissions/${submissionId}`,
      { answers }
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || "Failed to save answers",
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
    const { data } = await apiClient.post<SavedAnswer>(
      `exams/submissions/${examId}`,
      {
        answers: { [answerData.questionId]: answerData.answerText || '' },
      }
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to save answer',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Submit completed exam
 */
export async function submitExam(
  submissionId: string
): Promise<SubmitExamResponse> {
  try {
    const { data } = await apiClient.post<SubmitExamResponse>(
      `exams/submissions/${submissionId}/submit`
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || "Failed to submit exam",
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
  examId: string
): Promise<ExamProgress | null> {
  try {
    const { data } = await apiClient.get<ExamProgress>(
      `exams/${examId}/progress`
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
export function convertExamToCard(exam: Exam): ExamCard {
  const statusMap: Record<string, ExamCard['status']> = {
    'not-started': 'not-started',
    'in-progress': 'new',
    'completed': 'locked',
    'upcoming': 'upcoming',
  }
  return {
    id: exam.id,
    title: exam.title,
    description: exam.description,
    duration: exam.duration,
    questions: exam.totalQuestions,
    questionType: exam.type === 'objective' ? 'MCQs' : 'Theory',
    status: statusMap[exam.status] || 'upcoming',
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
      `exams/${examId}/questions`,
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
      `exams/${examId}/questions/${questionId}`,
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
    await apiClient.delete(`exams/${examId}/questions/${questionId}`)
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
