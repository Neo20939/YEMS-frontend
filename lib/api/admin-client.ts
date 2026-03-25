/**
 * Admin API Client
 *
 * Handles all admin-related API calls for user management, roles, and system stats.
 */

import axios from 'axios'
import { getAuthToken } from './auth-config'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// Use Next.js API proxy for admin operations to avoid CORS issues
const PROXY_BASE_URL = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'

/**
 * Create axios instance with auth interceptors
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Create proxy client for admin operations
const proxyClient = axios.create({
  baseURL: PROXY_BASE_URL,
  timeout: 30000,
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
export interface User {
  id: string
  email: string
  name: string
  role: string
  status?: 'active' | 'inactive' | 'pending'
  avatar?: string
  createdAt?: string
  updatedAt?: string
  assignedSubjects?: string[] // Subject IDs assigned to teacher
}

export interface Role {
  id: string
  name: string
  description: string
  users: number
  status: 'active' | 'inactive'
  permissions?: string[]
  icon?: string
  iconColor?: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalTeachers: number
  totalStudents: number
  totalExams: number
  pendingRequests: number
  systemHealth: 'healthy' | 'warning' | 'critical'
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  iconType?: 'math' | 'science' | 'english' | 'philosophy' | 'history' | 'computer'
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Try to get stats from health/metrics endpoints
    const [healthResponse, metricsResponse] = await Promise.all([
      apiClient.get('/admin/health').catch(() => ({ data: null })),
      apiClient.get('/status/metrics').catch(() => ({ data: null })),
    ])

    // Get user counts from users endpoint
    const usersResponse = await apiClient.get<User[]>('/admin/users').catch(() => ({ data: [] }))
    const users = usersResponse.data || []

    const stats: DashboardStats = {
      totalUsers: users.length || 0,
      activeUsers: users.filter(u => u.status === 'active').length || 0,
      totalTeachers: users.filter(u => u.role === 'teacher' || u.role === 'professor').length || 0,
      totalStudents: users.filter(u => u.role === 'student').length || 0,
      totalExams: 0, // Will be populated from exams endpoint
      pendingRequests: 0, // Will be populated from requests endpoint
      systemHealth: healthResponse.data?.status === 'healthy' ? 'healthy' : 'warning',
    }

    return stats
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    // Return default stats on error
    return {
      totalUsers: 0,
      activeUsers: 0,
      totalTeachers: 0,
      totalStudents: 0,
      totalExams: 0,
      pendingRequests: 0,
      systemHealth: 'warning',
    }
  }
}

/**
 * Get all users
 */
export async function getUsers(): Promise<User[]> {
  try {
    const token = getAuthToken()
    console.log('[getUsers] Token present:', !!token)

    const response = await proxyClient.get('/api/admin/users', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    console.log('[getUsers] Response status:', response.status)
    console.log('[getUsers] Response data:', response?.data)

    const data = response?.data

    // Backend returns { users: [...], pagination: {...} }
    if (data && typeof data === 'object') {
      if (Array.isArray(data.users)) {
        let users = data.users.map((user: any) => ({
          ...user,
          status: user.isActive ? 'active' as const : 'inactive' as const,
        }))
        
        // Merge localStorage subject assignments
        if (typeof window !== 'undefined') {
          users = users.map((user: User) => {
            const stored = localStorage.getItem(`user_${user.id}_subjects`)
            if (stored) {
              return { ...user, assignedSubjects: JSON.parse(stored) }
            }
            return user
          })
        }
        
        console.log('[getUsers] Returning', users.length, 'users from backend')
        return users
      }
    }

    console.warn('[getUsers] Unexpected response format:', data)
    return []
  } catch (error) {
    console.error('[getUsers] Failed to fetch users from backend:', error)
    throw error
  }
}

/**
 * Get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  try {
    const { data } = await apiClient.get<User>(`/admin/users/${id}`)
    return data
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error)
    return null
  }
}

/**
 * Create new user
 */
export async function createUser(userData: {
  email: string
  name: string
  password: string
  role: string
}): Promise<User> {
  try {
    console.log('Creating user with payload:', userData)
    const token = getAuthToken()

    const { data } = await proxyClient.post<User>('/api/admin/users', userData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    console.log('User created:', data)
    return data
  } catch (error: any) {
    console.error('Create user error:', error)
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data)
      console.error('Response status:', error.response?.status)
    }
    throw error
  }
}

/**
 * Update user role
 */
export async function updateUserRole(userId: string, role: string): Promise<User> {
  try {
    const token = getAuthToken()
    const { data } = await proxyClient.patch<User>(`/api/admin/users/${userId}/role`, {
      userId,
      role,
    }, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    return data
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
 * Delete user
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    const token = getAuthToken()
    await proxyClient.delete(`/api/admin/users?id=${id}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    
    // Clean up localStorage subject assignments
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`user_${id}_subjects`)
    }
  } catch (error) {
    console.error('Delete user error:', error)
    throw error
  }
}

/**
 * Assign subjects to teacher
 * Note: Backend doesn't support this endpoint, using localStorage
 */
export async function assignSubjectsToTeacher(userId: string, subjectIds: string[]): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Subject assignment only available in browser')
  }
  
  // Store in localStorage keyed by user ID
  localStorage.setItem(`user_${userId}_subjects`, JSON.stringify(subjectIds))
}

/**
 * Get teacher's assigned subjects
 * Note: Backend doesn't support this endpoint, using localStorage
 */
export async function getTeacherAssignedSubjects(teacherId: string): Promise<string[]> {
  if (typeof window === 'undefined') {
    return []
  }
  
  const stored = localStorage.getItem(`user_${teacherId}_subjects`)
  if (stored) {
    return JSON.parse(stored)
  }
  return []
}

/**
 * Get all roles
 */
export async function getRoles(): Promise<Role[]> {
  try {
    // Try to get roles from RBAC endpoint
    const response = await apiClient.get<Role[]>('/technician/rbac/policies').catch(() => ({ data: null }))
    
    if (response.data && response.data.length > 0) {
      return response.data.map((policy: any) => ({
        id: policy.id || policy.name,
        name: policy.name || policy.role,
        description: policy.description || `Role: ${policy.name || policy.role}`,
        users: policy.userCount || 0,
        status: policy.status === 'active' ? 'active' : 'inactive',
        permissions: policy.permissions || [],
        icon: getRoleIcon(policy.name || policy.role),
        iconColor: getRoleIconColor(policy.name || policy.role),
      }))
    }

    // Fallback: derive roles from users
    const users = await getUsers()
    const roleMap = new Map<string, number>()
    
    users.forEach(user => {
      const role = user.role.toLowerCase()
      roleMap.set(role, (roleMap.get(role) || 0) + 1)
    })

    const defaultRoles: Role[] = [
      { name: 'platform_admin', description: 'Full system access', icon: 'security', baseColor: 'primary' },
      { name: 'teacher', description: 'Manage courses and students', icon: 'person', baseColor: 'blue' },
      { name: 'student', description: 'View and submit work', icon: 'school', baseColor: 'stone' },
      { name: 'technician', description: 'System maintenance', icon: 'build', baseColor: 'amber' },
    ]

    return defaultRoles.map((role) => ({
      id: role.name,
      name: formatRoleName(role.name),
      description: role.description,
      users: roleMap.get(role.name) || 0,
      status: 'active',
      icon: role.icon,
      iconColor: getRoleIconColor(role.name),
    }))
  } catch (error) {
    console.error('Failed to fetch roles:', error)
    return []
  }
}

/**
 * Get RBAC policies
 */
export async function getRbacPolicies(): Promise<any[]> {
  try {
    const { data } = await apiClient.get('/technician/rbac/policies')
    return data
  } catch (error) {
    console.error('Failed to fetch RBAC policies:', error)
    return []
  }
}

// Helper functions
function getRoleIcon(roleName: string): string {
  const icons: Record<string, string> = {
    platform_admin: 'security',
    admin: 'admin_panel_settings',
    teacher: 'person',
    professor: 'school',
    student: 'face',
    technician: 'build',
  }
  return icons[roleName.toLowerCase()] || 'badge'
}

function getRoleIconColor(roleName: string): string {
  const colors: Record<string, string> = {
    platform_admin: 'bg-primary/10 text-primary',
    admin: 'bg-primary/10 text-primary',
    teacher: 'bg-blue-100 text-blue-700',
    professor: 'bg-blue-100 text-blue-700',
    student: 'bg-stone-100 text-stone-700',
    technician: 'bg-amber-100 text-amber-700',
  }
  return colors[roleName.toLowerCase()] || 'bg-stone-100 text-stone-700'
}

function formatRoleName(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Get all subjects
 */
export async function getSubjects(): Promise<Subject[]> {
  try {
    // Backend doesn't have GET endpoint, use localStorage fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('subjects')
      if (stored) {
        const subjects = JSON.parse(stored)
        console.log('[getSubjects] Loaded from localStorage:', subjects.length, 'subjects')
        return subjects
      }
    }
    return []
  } catch (error: any) {
    console.error('[getSubjects] Failed to fetch subjects:', error)
    return []
  }
}

/**
 * Get subject by ID
 */
export async function getSubjectById(id: string): Promise<Subject | null> {
  try {
    // Backend doesn't have GET endpoint, use localStorage fallback
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('subjects')
      if (stored) {
        const subjects = JSON.parse(stored)
        return subjects.find((s: Subject) => s.id === id) || null
      }
    }
    return null
  } catch (error) {
    console.error(`Failed to fetch subject ${id}:`, error)
    return null
  }
}

/**
 * Create new subject
 */
export async function createSubject(subjectData: {
  name: string
  code: string
  description?: string
  iconType?: 'math' | 'science' | 'english' | 'philosophy' | 'history' | 'computer'
}): Promise<Subject> {
  try {
    console.log('Creating subject with payload:', subjectData)
    const token = getAuthToken()

    const response = await proxyClient.post<Subject>('/api/admin/subjects', subjectData, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
    console.log('Subject created:', response.data)
    
    // Also store in localStorage
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('subjects') || '[]')
      const newSubject = {
        ...response.data,
        id: response.data.id || `subject_${Date.now()}`,
        status: 'active' as const,
        createdAt: new Date().toISOString(),
      }
      localStorage.setItem('subjects', JSON.stringify([...stored, newSubject]))
    }
    
    return response.data
  } catch (error: any) {
    console.error('Create subject error:', error)
    
    // Fallback: store in localStorage
    if (typeof window !== 'undefined') {
      const newSubject: Subject = {
        id: `subject_${Date.now()}`,
        name: subjectData.name,
        code: subjectData.code,
        description: subjectData.description || '',
        iconType: subjectData.iconType || 'science',
        status: 'active',
        createdAt: new Date().toISOString(),
      }
      const stored = JSON.parse(localStorage.getItem('subjects') || '[]')
      localStorage.setItem('subjects', JSON.stringify([...stored, newSubject]))
      return newSubject
    }
    
    throw error
  }
}

/**
 * Update subject (localStorage only - backend doesn't support PUT)
 */
export async function updateSubject(
  subjectId: string,
  subjectData: {
    name?: string
    code?: string
    description?: string
    iconType?: 'math' | 'science' | 'english' | 'philosophy' | 'history' | 'computer'
    status?: 'active' | 'inactive'
  }
): Promise<Subject> {
  if (typeof window === 'undefined') {
    throw new Error('Update only available in browser')
  }
  
  const stored = JSON.parse(localStorage.getItem('subjects') || '[]')
  const index = stored.findIndex((s: Subject) => s.id === subjectId)
  
  if (index === -1) {
    throw new Error('Subject not found')
  }
  
  const updated = {
    ...stored[index],
    ...subjectData,
    updatedAt: new Date().toISOString(),
  }
  
  stored[index] = updated
  localStorage.setItem('subjects', JSON.stringify(stored))
  
  return updated
}

/**
 * Delete subject (localStorage only - backend doesn't support DELETE)
 */
export async function deleteSubject(id: string): Promise<void> {
  if (typeof window === 'undefined') {
    throw new Error('Delete only available in browser')
  }
  
  const stored = JSON.parse(localStorage.getItem('subjects') || '[]')
  const filtered = stored.filter((s: Subject) => s.id !== id)
  localStorage.setItem('subjects', JSON.stringify(filtered))
}
