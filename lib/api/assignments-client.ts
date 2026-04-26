/**
 * Assignments API Client
 *
 * Handles all assignment management API calls including CRUD, submit, grade operations.
 */

import { axios } from '@/lib/axios-shim'
import { getAuthToken } from './auth-config'

// ============================================================================
// Types
// ============================================================================

export interface Assignment {
  id: string
  title: string
  description: string
  subjectId: string
  subjectName?: string
  classId: string
  className?: string
  teacherId: string
  teacherName?: string
  dueDate: string
  totalPoints: number
  status: 'draft' | 'published' | 'closed'
  allowLateSubmission: boolean
  attachments?: string[]
  createdAt: string
  updatedAt: string
}

export interface CreateAssignmentRequest {
  title: string
  description: string
  subjectId: string
  classId: string
  dueDate: string
  totalPoints: number
  allowLateSubmission?: boolean
}

export interface UpdateAssignmentRequest {
  title?: string
  description?: string
  subjectId?: string
  classId?: string
  dueDate?: string
  totalPoints?: number
  allowLateSubmission?: boolean
  status?: 'draft' | 'published' | 'closed'
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  studentId: string
  studentName?: string
  content: string
  attachments?: string[]
  submittedAt: string
  gradedAt?: string
  grade?: number
  feedback?: string
  status: 'submitted' | 'graded' | 'late'
}

export interface CreateSubmissionRequest {
  content: string
  attachments?: string[]
}

export interface GradeSubmissionRequest {
  grade: number
  feedback?: string
}

// ============================================================================
// API Base
// ============================================================================

const API_BASE_URL = '/api'

function getAxiosConfig() {
  const token = getAuthToken()
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    withCredentials: true,
  }
}

// ============================================================================
// Assignment CRUD
// ============================================================================

/**
 * Get all assignments (filtered by role)
 */
export async function getAssignments(filters?: {
  subjectId?: string
  classId?: string
  status?: string
  page?: number
  limit?: number
}): Promise<{ data: Assignment[]; pagination?: any }> {
  try {
    const params = new URLSearchParams()
    if (filters?.subjectId) params.append('subjectId', filters.subjectId)
    if (filters?.classId) params.append('classId', filters.classId)
    if (filters?.status) params.append('status', filters.status)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const response = await axios.get<{ data: Assignment[]; pagination?: any }>(
      `${API_BASE_URL}/assignments`,
      { ...getAxiosConfig(), params }
    )
    return response.data
  } catch (error: any) {
    console.error('[assignments-client] getAssignments error:', error)
    throw error
  }
}

/**
 * Get single assignment by ID
 */
export async function getAssignmentById(id: string): Promise<Assignment> {
  try {
    const response = await axios.get<{ data: Assignment }>(`${API_BASE_URL}/assignments/${id}`, getAxiosConfig())
    return response.data.data
  } catch (error: any) {
    console.error('[assignments-client] getAssignmentById error:', error)
    throw error
  }
}

export async function createAssignment(
  data: CreateAssignmentRequest
): Promise<Assignment> {
  try {
    const response = await axios.post<{ data: Assignment }>(`${API_BASE_URL}/assignments`, data, getAxiosConfig())
    return response.data.data
  } catch (error: any) {
    console.error('[assignments-client] createAssignment error:', error)
    throw error
  }
}

export async function updateAssignment(
  id: string,
  data: UpdateAssignmentRequest
): Promise<Assignment> {
  try {
    const response = await axios.patch<{ data: Assignment }>(
      `${API_BASE_URL}/assignments/${id}`,
      data,
      getAxiosConfig()
    )
    return response.data.data
  } catch (error: any) {
    console.error('[assignments-client] updateAssignment error:', error)
    throw error
  }
}

export async function deleteAssignment(id: string): Promise<void> {
  try {
    await axios.delete(`${API_BASE_URL}/assignments/${id}`, getAxiosConfig())
  } catch (error: any) {
    console.error('[assignments-client] deleteAssignment error:', error)
    throw error
  }
}

/**
 * Publish assignment
 */
export async function publishAssignment(id: string): Promise<Assignment> {
  try {
    const response = await axios.patch<{ data: Assignment }>(
      `${API_BASE_URL}/assignments/${id}`,
      { status: 'published' },
      getAxiosConfig()
    )
    return response.data.data
  } catch (error: any) {
    console.error('[assignments-client] publishAssignment error:', error)
    throw error
  }
}

export async function unpublishAssignment(id: string): Promise<Assignment> {
  try {
    const response = await axios.patch<{ data: Assignment }>(
      `${API_BASE_URL}/assignments/${id}`,
      { status: 'draft' },
      getAxiosConfig()
    )
    return response.data.data
  } catch (error: any) {
    console.error('[assignments-client] unpublishAssignment error:', error)
    throw error
  }
}

export async function submitAssignment(
  assignmentId: string,
  data: CreateSubmissionRequest
): Promise<AssignmentSubmission> {
  try {
    const response = await axios.post<{ data: AssignmentSubmission }>(
      `${API_BASE_URL}/assignments/${assignmentId}/submit`,
      data,
      getAxiosConfig()
    )
    return response.data.data
  } catch (error: any) {
    console.error('[assignments-client] submitAssignment error:', error)
    throw error
  }
}

export async function getAssignmentSubmissions(
  assignmentId: string
): Promise<{ data: AssignmentSubmission[]; pagination?: any }> {
  try {
    const response = await axios.get<{ data: AssignmentSubmission[]; pagination?: any }>(
      `${API_BASE_URL}/assignments/${assignmentId}/submissions`,
      getAxiosConfig()
    )
    return response.data
  } catch (error: any) {
    console.error('[assignments-client] getAssignmentSubmissions error:', error)
    throw error
  }
}

export async function getMySubmissions(): Promise<{ data: AssignmentSubmission[] }> {
  try {
    const response = await axios.get<{ data: AssignmentSubmission[] }>(
      `${API_BASE_URL}/assignments/my-submissions`,
      getAxiosConfig()
    )
    return response.data
  } catch (error: any) {
    console.error('[assignments-client] getMySubmissions error:', error)
    throw error
  }
}

export async function gradeSubmission(
  submissionId: string,
  data: GradeSubmissionRequest
): Promise<AssignmentSubmission> {
  try {
    const response = await axios.patch<{ data: AssignmentSubmission }>(
      `${API_BASE_URL}/assignments/submissions/${submissionId}/grade`,
      data,
      getAxiosConfig()
    )
    return response.data.data
  } catch (error: any) {
    console.error('[assignments-client] gradeSubmission error:', error)
    throw error
  }
}