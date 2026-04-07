/**
 * Authentication API Client
 *
 * Handles all authentication-related API calls.
 * 
 * YEMS uses session-based authentication with cookie: yems_session
 */

import { axios } from '@/lib/axios-shim'
import {
  AUTH_CONFIG,
  LoginCredentials,
  LoginResponse,
  ApiError,
  saveAuthToken,
  clearAuthToken,
  getAuthToken,
  getRedirectPathByRole,
} from './auth-config'

// CORS placeholder for future use
// yeshuacorsissue: {
//   allowedOrigins: ['http://localhost:3000', 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'],
//   enabled: false,
// }

/**
 * Create axios instance with default config
 * Calls Next.js API routes which proxy to the ngrok backend
 * This avoids CORS issues when calling ngrok directly from browser
 */
const apiClient = axios.create({
  baseURL: '/api',
  timeout: AUTH_CONFIG.timeout,
  withCredentials: true, // Send cookies for session-based auth
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.response.use(
  response => response,
  error => {
    console.log("=== API RESPONSE ERROR ===")
    console.log("URL:", error.config?.url)
    console.log("Status:", error.response?.status)
    console.log("Data:", error.response?.data)
    console.log("Message:", error.message)
    return Promise.reject(error)
  }
)

/**
 * Login user with credentials
 * Priority: API first, then mock data fallback
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  console.log("=== LOGIN ATTEMPT ===")
  console.log("Base URL:", AUTH_CONFIG.baseUrl)
  console.log("Endpoint:", AUTH_CONFIG.endpoints.login)
  console.log("Credentials:", { email: credentials.email, password: "[REDACTED]" })

  // Try API call first
  console.log("=== TRYING API LOGIN ===")
  try {
    const response = await apiClient.post<{ success: boolean; data: { user: any; expiresAt: string } }>(
      AUTH_CONFIG.endpoints.login,
      {
        email: credentials.email,
        password: credentials.password,
      }
    )

    const apiData = response.data
    console.log("=== API LOGIN SUCCESS ===")
    console.log("Raw data from API:", JSON.stringify(apiData, null, 2))

    if (!apiData.success || !apiData.data) {
      throw new Error('Invalid response from server')
    }

    const user = apiData.data.user
    let expiresIn = 3600
    if (apiData.data.expiresAt) {
      const expiresDate = new Date(apiData.data.expiresAt)
      const now = new Date()
      expiresIn = Math.floor((expiresDate.getTime() - now.getTime()) / 1000)
    }

    // Map role ID to role name
    const roleIdMap: Record<number, string> = {
      1: 'admin',
      2: 'technician',
      3: 'teacher',
      4: 'class_teacher',
      5: 'finance',
      6: 'admin',
      7: 'student',
      8: 'student',
      9: 'student',
      10: 'student',
      11: 'student',
      12: 'student',
    }
    
    const firstRole = user.roles?.[0]
    let roleName: string
    if (typeof firstRole === 'object' && firstRole?.name) {
      roleName = firstRole.name
    } else if (typeof firstRole === 'number') {
      roleName = roleIdMap[firstRole] || 'student'
    } else if (typeof firstRole === 'string') {
      roleName = firstRole
    } else {
      roleName = 'student'
    }

    const loginResponse: LoginResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
        role: roleName,
        avatar: user.profilePicture || user.avatar || undefined,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      },
      accessToken: 'cookie-based',
      refreshToken: 'cookie-based',
      expiresIn,
      tokenType: 'Bearer',
    }

    console.log("Processed user data:", JSON.stringify(loginResponse.user, null, 2))
    console.log("Login response user.role:", loginResponse.user.role)

    // Save user data to storage (token is in cookie)
    saveAuthToken(loginResponse.accessToken, loginResponse.refreshToken, loginResponse.user)

    return loginResponse
  } catch (error) {
    console.log("=== API LOGIN FAILED ===")
    console.error("API Error:", error)

    // Re-throw the error - no mock fallback
    console.error("=== LOGIN FAILED COMPLETELY ===")
    
    if (axios.isAxiosError(error)) {
      let errorMessage = 'Login failed. Please check your credentials.'
      const errCode = (error as any).code

      if (errCode === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection or try again later.'
      } else if (errCode === 'ERR_NETWORK' || !error.response) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection.'
      } else if (error.response?.status === 401) {
        errorMessage = 'Invalid email or password. Please try again.'
      } else if (error.response?.status === 403) {
        errorMessage = 'Your account has been disabled. Please contact support.'
      } else if (error.response?.status === 404) {
        errorMessage = 'User not found. Please check your email or register.'
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later or contact support.'
      } else if (error.response?.status === 503) {
        errorMessage = 'Service unavailable. Please try again later.'
      }

      const apiError: ApiError = {
        message: errorMessage,
        code: error.response?.data?.code || (error as any).code,
        status: error.response?.status,
        details: error.response?.data,
      }
      throw apiError
    }

    throw {
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
    } as ApiError
  }
}

/**
 * Logout user and clear tokens
 */
export async function logout(): Promise<void> {
  try {
    await apiClient.post(AUTH_CONFIG.endpoints.logout, {})
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    clearAuthToken()
  }
}

/**
 * Refresh access token - Not available in this API (uses cookie-based sessions)
 */
export async function refreshToken(_refreshToken: string): Promise<LoginResponse> {
  throw new Error('Token refresh not supported - API uses cookie-based sessions')
}

/**
 * Get current user info
 */
export async function getCurrentUser(): Promise<LoginResponse['user']> {
  try {
    const response = await apiClient.get<{ success: boolean; data: { userId: string; email: string; firstName: string; lastName: string; roles: { id: number; name: string }[]; schoolId: string | null } }>(
      AUTH_CONFIG.endpoints.me
    )

    const userData = response.data.data
    
    // Convert backend response to frontend format
    return {
      id: userData.userId,
      email: userData.email,
      name: userData.firstName && userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.email,
      role: userData.roles?.[0]?.name || 'student',
      avatar: undefined,
      firstName: userData.firstName,
      lastName: userData.lastName,
      roles: userData.roles,
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || error.response?.data?.error || 'Failed to get user info',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken()
}

/**
 * Get stored token
 */
export function getToken(): string | null {
  return getAuthToken()
}

export { getRedirectPathByRole }
