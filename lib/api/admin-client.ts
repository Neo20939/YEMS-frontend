/**
 * Admin API Client
 *
 * Handles user management, subjects, roles, and dashboard API calls for admin operations.
 */

import { axios } from '@/lib/axios-shim'
import { getAuthToken } from './auth-config'

// ============================================================================
// Types
// ============================================================================

export interface User {
  id: string
  name: string
  email: string
  role: string
  status?: 'active' | 'inactive' | 'pending'
  assignedSubjects?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password: string
  role: string
}

export interface UpdateUserRequest {
  name?: string
  email?: string
  role?: string
  status?: 'active' | 'inactive' | 'pending'
}

export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

export interface CreateSubjectRequest {
  name: string
  code: string
  description?: string
}

export interface UpdateSubjectRequest {
  name?: string
  code?: string
  description?: string
  status?: 'active' | 'inactive'
}

export interface Role {
  id: string
  name: string
  description: string
  icon?: string
  iconColor?: string
  users: number
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalTeachers: number
  totalStudents: number
  totalSubjects: number
  totalRoles: number
}

export interface ApiError {
  code?: string
  message: string
  status?: number
  details?: Record<string, string[]>
}

// ============================================================================
// API Client Setup
// ============================================================================

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config: any) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: any) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    console.log('=== ADMIN API ERROR ===')
    console.log('URL:', error.config?.url)
    console.log('Status:', error.response?.status)
    console.log('Data:', error.response?.data)
    return Promise.reject(error)
  }
)

// ============================================================================
// User Management Functions
// ============================================================================

/**
 * Get all users
 */
export async function getUsers(): Promise<User[]> {
  try {
    const response = await apiClient.get<any>('admin/users')
    // Handle different response formats: { success: true, data: [...] } or just [...]
    const responseData = response.data
    let users: User[] = []
    if (Array.isArray(responseData)) {
      users = responseData
    } else if (responseData.data && Array.isArray(responseData.data)) {
      users = responseData.data
    } else if (responseData.results && Array.isArray(responseData.results)) {
      users = responseData.results
    }
    return users
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch users:', error.response?.data)
      throw {
        message: error.response?.data?.message || 'Failed to fetch users',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Create a new user
 */
export async function createUser(userData: CreateUserRequest, endpoint: string = 'admin/users'): Promise<User> {
  try {
    const response = await apiClient.post<any>(endpoint, userData)
    // Handle different response formats
    const responseData = response.data
    if (responseData.data) {
      return responseData.data
    }
    return responseData
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let errorMessage = 'Failed to create user'
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data provided'
      } else if (error.response?.status === 409) {
        errorMessage = 'User with this email already exists'
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized. Please log in again'
      }
      throw {
        message: errorMessage,
        status: error.response?.status,
        code: error.response?.data?.code,
      } as ApiError
    }
    throw error
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: string): Promise<User> {
  try {
    const response = await apiClient.patch<{ success: boolean; data: User }>(
      `admin/users/${userId}/role`,
      { role }
    )
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to update user role',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Update user
 */
export async function updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
  try {
    const response = await apiClient.put<{ success: boolean; data: User }>(
      `admin/users/${userId}`,
      userData
    )
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to update user',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Delete user
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    await apiClient.delete<{ success: boolean }>(`admin/users/${userId}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to delete user',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string): Promise<User> {
  try {
    const response = await apiClient.get<{ success: boolean; data: User }>(`admin/users/${userId}`)
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to fetch user',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

// ============================================================================
// Subject Management Functions
// ============================================================================

/**
 * Get all subjects
 */
export async function getSubjects(): Promise<Subject[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Subject[] }>('admin/subjects')
    return response.data.data || []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch subjects:', error.response?.data)
      throw {
        message: error.response?.data?.message || 'Failed to fetch subjects',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Create a new subject
 */
export async function createSubject(subjectData: CreateSubjectRequest): Promise<Subject> {
  try {
    const response = await apiClient.post<{ success: boolean; data: Subject }>('admin/subjects', subjectData)
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      let errorMessage = 'Failed to create subject'
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Invalid data provided'
      } else if (error.response?.status === 409) {
        errorMessage = 'Subject with this code already exists'
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized. Please log in again'
      }
      throw {
        message: errorMessage,
        status: error.response?.status,
        code: error.response?.data?.code,
      } as ApiError
    }
    throw error
  }
}

/**
 * Update subject
 */
export async function updateSubject(subjectId: string, subjectData: UpdateSubjectRequest): Promise<Subject> {
  try {
    const response = await apiClient.put<{ success: boolean; data: Subject }>(
      `admin/subjects/${subjectId}`,
      subjectData
    )
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to update subject',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Delete subject
 */
export async function deleteSubject(subjectId: string): Promise<void> {
  try {
    await apiClient.delete<{ success: boolean }>(`admin/subjects/${subjectId}`)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to delete subject',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

// ============================================================================
// Role Management Functions
// ============================================================================

/**
 * Get all roles
 */
export async function getRoles(): Promise<Role[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Role[] }>('admin/roles')
    return response.data.data || []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch roles:', error.response?.data)
      throw {
        message: error.response?.data?.message || 'Failed to fetch roles',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

// ============================================================================
// Dashboard Stats Functions
// ============================================================================

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const response = await apiClient.get<{ success: boolean; data: DashboardStats }>('admin/stats')
    
    if (!response.data.success) {
      console.error('[getDashboardStats] API returned success: false')
      return {
        totalUsers: 0,
        activeUsers: 0,
        totalTeachers: 0,
        totalStudents: 0,
        totalSubjects: 0,
        totalRoles: 0,
      }
    }
    
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('[getDashboardStats] Axios error:', error.message)
      console.error('[getDashboardStats] Response:', error.response?.data)
      console.error('[getDashboardStats] Status:', error.response?.status)
      console.error('[getDashboardStats] Request URL:', error.config?.url)
    } else {
      console.error('[getDashboardStats] Error:', error)
    }
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalTeachers: 0,
      totalStudents: 0,
      totalSubjects: 0,
      totalRoles: 0,
    }
  }
}

// ============================================================================
// Teacher Subject Assignment Functions
// ============================================================================

/**
 * Assign subjects to a teacher
 */
export async function assignSubjectsToTeacher(teacherId: string, subjectIds: string[]): Promise<User> {
  try {
    const response = await apiClient.post<{ success: boolean; data: User }>(
      `admin/teachers/${teacherId}/subjects`,
      { subjectIds }
    )
    return response.data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to assign subjects',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Get teacher's assigned subjects
 */
export async function getTeacherAssignedSubjects(teacherId: string): Promise<Subject[]> {
  try {
    const response = await apiClient.get<{ success: boolean; data: Subject[] }>(
      `admin/teachers/${teacherId}/subjects`
    )
    return response.data.data || []
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to fetch teacher subjects:', error.response?.data)
      throw {
        message: error.response?.data?.message || 'Failed to fetch teacher subjects',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}
