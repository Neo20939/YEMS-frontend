/**
 * Admin API Client
 * 
 * Handles all admin-related API calls for user management, roles, and system stats.
 */

import axios from 'axios'
import { getAuthToken } from './auth-config'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

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
  department?: string
  createdAt?: string
  updatedAt?: string
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
    const { data } = await apiClient.get<User[]>('/admin/users')
    return data
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return []
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
    const { data } = await apiClient.post<User>('/admin/users', userData)
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to create user',
        status: error.response?.status,
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
    const { data } = await apiClient.patch<User>(`/admin/users/${userId}/role`, {
      userId,
      role,
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
    await apiClient.delete(`/admin/users/${id}`)
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
