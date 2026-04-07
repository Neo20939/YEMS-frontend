/**
 * Notes API Client
 *
 * Handles all note management API calls including upload, download, and CRUD operations.
 */

import { axios } from '@/lib/axios-shim'
import {
  ApiResponse,
  Note,
  CreateNoteRequest,
  CreateNoteResponse,
  UpdateNoteRequest,
  UpdateNoteResponse,
  GetNotesFilters,
  GetNotesResponse,
  DownloadNoteResponse,
  DeleteNoteResponse,
  PaginationParams,
} from './types'

/**
 * Configuration for the Notes API
 */
const NOTES_API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  timeout: 60000, // 60 seconds for file uploads
  endpoints: {
    notes: 'api/notes',
    upload: 'api/notes/upload',
    download: (noteId: string) => `api/notes/${noteId}/download`,
    note: (noteId: string) => `api/notes/${noteId}`,
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
 * Get current user from storage
 */
function getCurrentUser(): { id: string; role: string } | null {
  if (typeof window === 'undefined') return null
  const authData = localStorage.getItem('auth_data')
  if (authData) {
    try {
      const parsed = JSON.parse(authData)
      return parsed.user || null
    } catch {
      return null
    }
  }
  return null
}

/**
 * Get teacher's assigned subjects from localStorage
 * This is set by admin when assigning subjects to teacher
 */
export function getTeacherAssignedSubjects(): string[] {
  if (typeof window === 'undefined') return []
  const user = getCurrentUser()
  if (!user) return []
  
  const assignedSubjects = localStorage.getItem(`teacher_${user.id}_subjects`)
  if (assignedSubjects) {
    try {
      return JSON.parse(assignedSubjects)
    } catch {
      return []
    }
  }
  return []
}

/**
 * Check if teacher can manage a specific subject
 */
export function canTeacherManageSubject(subjectId: string): boolean {
  const user = getCurrentUser()
  if (!user || user.role !== 'teacher') return false
  
  const assignedSubjects = getTeacherAssignedSubjects()
  return assignedSubjects.includes(subjectId)
}

/**
 * Create axios instance for notes API
 */
const notesApiClient = axios.create({
  baseURL: NOTES_API_CONFIG.baseUrl,
  timeout: NOTES_API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Add auth token to requests
 */
notesApiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

/**
 * Upload a new note
 * Uses FormData for multipart file upload
 */
export async function uploadNote(
  payload: CreateNoteRequest,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<CreateNoteResponse>> {
  try {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('title', payload.title)
    if (payload.description) formData.append('description', payload.description)
    formData.append('subject', payload.subject)
    formData.append('classGrade', payload.classGrade)
    formData.append('term', payload.term)
    if (payload.week) formData.append('week', payload.week)
    if (payload.topic) formData.append('topic', payload.topic)
    if (payload.tags && payload.tags.length > 0) {
      formData.append('tags', JSON.stringify(payload.tags))
    }

    const { data } = await notesApiClient.post<CreateNoteResponse>(
      NOTES_API_CONFIG.endpoints.upload,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: any) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      }
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'UPLOAD_FAILED',
          message: error.response?.data?.message || 'Failed to upload note',
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
 * Get list of notes with optional filters
 */
export async function getNotes(
  filters?: GetNotesFilters,
  pagination?: PaginationParams
): Promise<ApiResponse<GetNotesResponse>> {
  try {
    const params = new URLSearchParams()

    // Add filters
    if (filters?.subject) params.append('subject', filters.subject)
    if (filters?.classGrade) params.append('classGrade', filters.classGrade)
    if (filters?.term) params.append('term', filters.term)
    if (filters?.week) params.append('week', filters.week)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.uploadedBy) params.append('uploadedBy', filters.uploadedBy)

    // Add pagination
    if (pagination?.page) params.append('page', pagination.page.toString())
    if (pagination?.limit) params.append('limit', pagination.limit.toString())
    if (pagination?.sortBy) params.append('sortBy', pagination.sortBy)
    if (pagination?.sortOrder) params.append('sortOrder', pagination.sortOrder)

    const { data } = await notesApiClient.get<GetNotesResponse>(
      `${NOTES_API_CONFIG.endpoints.notes}${params.toString() ? `?${params.toString()}` : ''}`
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'FETCH_FAILED',
          message: error.response?.data?.message || 'Failed to fetch notes',
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
 * Get download URL for a note
 */
export async function downloadNote(noteId: string): Promise<ApiResponse<DownloadNoteResponse>> {
  try {
    const { data } = await notesApiClient.get<DownloadNoteResponse>(
      NOTES_API_CONFIG.endpoints.download(noteId)
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'DOWNLOAD_FAILED',
          message: error.response?.data?.message || 'Failed to get download URL',
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
 * Trigger file download in browser
 */
export async function triggerFileDownload(
  noteId: string,
  fileName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const token = getAuthToken()
    
    // Create download URL with auth token
    const downloadUrl = `${NOTES_API_CONFIG.baseUrl}${NOTES_API_CONFIG.endpoints.download(noteId)}`
    
    // Create temporary link and trigger download
    const link = document.createElement('a')
    link.href = downloadUrl
    link.setAttribute('download', fileName)
    link.setAttribute('target', '_blank')
    
    // Add auth header via a fetch and blob approach for better control
    const response = await fetch(downloadUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    
    if (!response.ok) {
      throw new Error('Download failed')
    }
    
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    link.href = blobUrl
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
    
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Download failed',
    }
  }
}

/**
 * Update note metadata
 */
export async function updateNote(
  noteId: string,
  payload: UpdateNoteRequest
): Promise<ApiResponse<UpdateNoteResponse>> {
  try {
    const { data } = await notesApiClient.put<UpdateNoteResponse>(
      NOTES_API_CONFIG.endpoints.note(noteId),
      payload
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'UPDATE_FAILED',
          message: error.response?.data?.message || 'Failed to update note',
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
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<ApiResponse<DeleteNoteResponse>> {
  try {
    const { data } = await notesApiClient.delete<DeleteNoteResponse>(
      NOTES_API_CONFIG.endpoints.note(noteId)
    )

    return { success: true, data, timestamp: new Date().toISOString() }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: {
          code: error.response?.data?.code || 'DELETE_FAILED',
          message: error.response?.data?.message || 'Failed to delete note',
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
 * Get available subjects from API
 * For teachers, returns only their assigned subjects
 */
export async function getAvailableSubjects(): Promise<ApiResponse<string[]>> {
  try {
    // Check if current user is a teacher with assigned subjects
    const assignedSubjects = getTeacherAssignedSubjects()
    const user = getCurrentUser()
    
    // If teacher has assigned subjects, return only those
    if (user?.role === 'teacher' && assignedSubjects.length > 0) {
      return { success: true, data: assignedSubjects, timestamp: new Date().toISOString() }
    }
    
    // Otherwise, try to get all subjects from API
    const { data } = await notesApiClient.get<{ subjects: string[] }>(
      `${NOTES_API_CONFIG.endpoints.notes}/subjects`
    )

    return { success: true, data: data.subjects, timestamp: new Date().toISOString() }
  } catch (error) {
    // Check if teacher has assigned subjects in localStorage
    const assignedSubjects = getTeacherAssignedSubjects()
    if (assignedSubjects.length > 0) {
      return { success: true, data: assignedSubjects, timestamp: new Date().toISOString() }
    }
    
    // Return default subjects if API fails and no assigned subjects
    const defaultSubjects = [
      'mathematics',
      'english',
      'science',
      'history',
      'computer-studies',
      'physics',
      'chemistry',
      'biology',
      'literature',
      'geography',
      'economics',
    ]
    return { success: true, data: defaultSubjects, timestamp: new Date().toISOString() }
  }
}

/**
 * Get available class grades from API
 */
export async function getAvailableClassGrades(): Promise<ApiResponse<string[]>> {
  try {
    const { data } = await notesApiClient.get<{ classGrades: string[] }>(
      `${NOTES_API_CONFIG.endpoints.notes}/class-grades`
    )

    return { success: true, data: data.classGrades, timestamp: new Date().toISOString() }
  } catch (error) {
    // Return default class grades if API fails
    const defaultGrades = [
      'jss1',
      'jss2',
      'jss3',
      'ss1',
      'ss2',
      'ss3',
      'grade-9',
      'grade-10',
      'grade-11',
      'grade-12',
    ]
    return { success: true, data: defaultGrades, timestamp: new Date().toISOString() }
  }
}

// Export for direct use
export const notesApi = {
  uploadNote,
  getNotes,
  downloadNote,
  triggerFileDownload,
  updateNote,
  deleteNote,
  getAvailableSubjects,
  getAvailableClassGrades,
}

export default notesApi
