/**
 * Question Management API Client
 *
 * Handles bulk question operations and theory marking queue.
 */

import { axios } from '@/lib/axios-shim'
import {
  ApiResponse,
  BulkQuestionUpload,
  BulkUploadResponse,
  TheoryMarkingItem,
  MarkingQueueFilters,
  MarkingQueueResponse,
  SubmitMarkRequest,
  SubmitMarkResponse,
  GetAllQuestionsResponse,
  ExamQuestion,
} from './types'

/**
 * Configuration for the Question Management API
 */
const QUESTION_API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev',
  timeout: 120000, // 2 minutes for bulk uploads
  endpoints: {
    questions: (examId: string) => `exams/${examId}/questions`,
    question: (examId: string, questionId: string) => `exams/${examId}/questions/${questionId}`,
    bulkObjective: (examId: string) => `exams/${examId}/questions/objective/bulk`,
    bulkTheory: (examId: string) => `exams/${examId}/questions/theory/upload`,
    markingQueue: (examId: string) => `exams/${examId}/questions/theory/marking-queue`,
    submitMark: (examId: string, markingId: string) => `exams/${examId}/questions/theory/marking-queue/${markingId}`,
  },
}

/**
 * Get authentication token from storage
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  const authData = localStorage.getItem('auth_data')
  if (authData) {
    try {
      const parsed = JSON.parse(authData)
      return parsed.accessToken || null
    } catch {
      return null
    }
  }
  return null
}

/**
 * Create axios instance for question management API
 */
const questionClient = axios.create({
  baseURL: QUESTION_API_CONFIG.baseUrl,
  timeout: QUESTION_API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Add auth token to requests
 */
questionClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Get all questions for an exam (new endpoint)
 */
export async function getAllQuestions(examId: string): Promise<ApiResponse<GetAllQuestionsResponse>> {
  try {
    const { data } = await questionClient.get<GetAllQuestionsResponse>(
      QUESTION_API_CONFIG.endpoints.questions(examId)
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'QUESTIONS_FETCH_FAILED',
          message: error.response?.data?.message || 'Failed to fetch questions',
          details: error.response?.data?.details,
        },
        timestamp: new Date().toISOString(),
      }
    }
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Bulk upload objective questions
 */
export async function bulkUploadObjectiveQuestions(
  examId: string,
  payload: BulkQuestionUpload
): Promise<ApiResponse<BulkUploadResponse>> {
  try {
    const { data } = await questionClient.post<BulkUploadResponse>(
      QUESTION_API_CONFIG.endpoints.bulkObjective(examId),
      payload
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'BULK_UPLOAD_FAILED',
          message: error.response?.data?.message || 'Failed to upload questions',
          details: error.response?.data?.details,
        },
        timestamp: new Date().toISOString(),
      }
    }
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Bulk upload theory questions
 */
export async function bulkUploadTheoryQuestions(
  examId: string,
  payload: BulkQuestionUpload
): Promise<ApiResponse<BulkUploadResponse>> {
  try {
    const { data } = await questionClient.post<BulkUploadResponse>(
      QUESTION_API_CONFIG.endpoints.bulkTheory(examId),
      payload
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'BULK_UPLOAD_FAILED',
          message: error.response?.data?.message || 'Failed to upload theory questions',
          details: error.response?.data?.details,
        },
        timestamp: new Date().toISOString(),
      }
    }
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Get theory marking queue
 */
export async function getTheoryMarkingQueue(
  examId?: string,
  filters?: MarkingQueueFilters
): Promise<ApiResponse<MarkingQueueResponse>> {
  try {
    const params = new URLSearchParams()

    if (examId) params.append('examId', examId)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.sortBy) params.append('sortBy', filters.sortBy)
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.offset) params.append('offset', filters.offset.toString())

    const { data } = await questionClient.get<MarkingQueueResponse>(
      `${QUESTION_API_CONFIG.endpoints.markingQueue(examId || 'all')}${params.toString() ? `?${params.toString()}` : ''}`
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'MARKING_QUEUE_FETCH_FAILED',
          message: error.response?.data?.message || 'Failed to fetch marking queue',
          details: error.response?.data?.details,
        },
        timestamp: new Date().toISOString(),
      }
    }
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Submit mark for a theory question
 */
export async function submitTheoryMark(
  examId: string,
  markingId: string,
  payload: SubmitMarkRequest
): Promise<ApiResponse<SubmitMarkResponse>> {
  try {
    const { data } = await questionClient.post<SubmitMarkResponse>(
      QUESTION_API_CONFIG.endpoints.submitMark(examId, markingId),
      payload
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'MARK_SUBMIT_FAILED',
          message: error.response?.data?.message || 'Failed to submit mark',
          details: error.response?.data?.details,
        },
        timestamp: new Date().toISOString(),
      }
    }
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unexpected error occurred',
      },
      timestamp: new Date().toISOString(),
    }
  }
}

/**
 * Parse CSV/Excel file for bulk upload
 */
export function parseQuestionFile(file: File): Promise<BulkQuestionUpload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const questions = JSON.parse(content)
        resolve({ questions })
      } catch (error) {
        reject(new Error('Failed to parse file. Ensure it\'s valid JSON format.'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// Export for direct use
export const questionManagementApi = {
  getAllQuestions,
  bulkUploadObjectiveQuestions,
  bulkUploadTheoryQuestions,
  getTheoryMarkingQueue,
  submitTheoryMark,
  parseQuestionFile,
}

export default questionManagementApi
