/**
 * Authentication API Client
 * 
 * Handles all authentication-related API calls.
 */

import axios from 'axios'
import {
  AUTH_CONFIG,
  LoginCredentials,
  LoginResponse,
  ApiError,
  saveAuthToken,
  clearAuthToken,
  getRedirectPathByRole,
} from './auth-config'

/**
 * Create axios instance with default config
 */
const apiClient = axios.create({
  baseURL: AUTH_CONFIG.baseUrl,
  timeout: AUTH_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Login user with credentials
 */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    console.log("=== LOGIN ATTEMPT ===")
    console.log("Base URL:", AUTH_CONFIG.baseUrl)
    console.log("Endpoint:", AUTH_CONFIG.endpoints.login)
    console.log("Credentials:", { email: credentials.email, password: "[REDACTED]" })

    // First, check if user exists in localStorage (for demo/offline mode)
    if (typeof window !== 'undefined') {
      // Initialize default mock users if none exist
      let mockUsers = JSON.parse(localStorage.getItem('mock_users') || '[]')
      if (mockUsers.length === 0) {
        mockUsers = [
          {
            id: 'tech-001',
            email: 'technician@yems.local',
            password: 'TechnicianPass123!',
            name: 'System Technician',
            role: 'technician',
            avatar: '',
          },
          {
            id: 'teacher-001',
            email: 'teacher@yems.local',
            password: 'TeacherPass123!',
            name: 'John Teacher',
            role: 'teacher',
            avatar: '',
          },
          {
            id: 'student-001',
            email: 'student@yems.local',
            password: 'StudentPass123!',
            name: 'Jane Student',
            role: 'student',
            avatar: '',
          },
          {
            id: 'admin-001',
            email: 'admin@yems.local',
            password: 'AdminPass123!',
            name: 'Platform Admin',
            role: 'platform_admin',
            avatar: '',
          },
        ]
        localStorage.setItem('mock_users', JSON.stringify(mockUsers))
      }

      const mockUser = mockUsers.find(
        (u: any) => u.email === credentials.email && u.password === credentials.password
      )

      if (mockUser) {
        console.log("=== MOCK USER FOUND ===")
        console.log("Mock user:", mockUser)

        // Create a mock token
        const mockToken = `mock-token-${Date.now()}`
        const mockResponse: LoginResponse = {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            name: mockUser.name,
            role: mockUser.role,
            avatar: mockUser.avatar,
          },
          accessToken: mockToken,
          refreshToken: mockToken,
          expiresIn: 3600,
          tokenType: 'Bearer',
        }

        saveAuthToken(mockToken, mockToken, mockResponse.user)
        return mockResponse
      }
    }

    const { data } = await apiClient.post<LoginResponse>(
      AUTH_CONFIG.endpoints.login,
      {
        email: credentials.email,
        password: credentials.password,
      }
    )

    console.log("=== AUTH-CLIENT LOGIN RESPONSE ===")
    console.log("Raw data from API:", JSON.stringify(data, null, 2))

    // Save tokens and user data to storage
    saveAuthToken(data.accessToken, data.refreshToken, data.user)

    return data
  } catch (error) {
    console.error("=== LOGIN ERROR ===")
    console.error("Error type:", error?.constructor?.name || typeof error)
    console.error("Full error:", error)

    if (axios.isAxiosError(error)) {
      console.error("Axios error details:")
      console.error("  - Status:", error.response?.status)
      console.error("  - Status Text:", error.response?.statusText)
      console.error("  - Data:", error.response?.data)
      console.error("  - Message:", error.message)
      console.error("  - Code:", error.code)

      let errorMessage = 'Login failed. Please check your credentials.'

      // Provide more specific error messages
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please check your internet connection or try again later.'
      } else if (error.code === 'ERR_NETWORK' || !error.response) {
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
        code: error.response?.data?.code || error.code,
        status: error.response?.status,
        details: error.response?.data,
      }
      throw apiError
    }

    // Non-Axios errors
    console.error("Unknown error type:", error)
    throw {
      message: 'An unexpected error occurred. Please try again.',
      code: 'UNKNOWN_ERROR',
    } as ApiError
  }
}

/**
 * Logout user and clear tokens
 */
export async function logout(token?: string): Promise<void> {
  try {
    await apiClient.post(
      AUTH_CONFIG.endpoints.logout,
      {},
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      }
    )
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    clearAuthToken()
  }
}

/**
 * Refresh access token
 */
export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  try {
    const { data } = await apiClient.post<LoginResponse>(
      AUTH_CONFIG.endpoints.refresh,
      { refreshToken }
    )
    
    saveAuthToken(data.accessToken, data.refreshToken)
    
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to refresh token',
        status: error.response?.status,
      } as ApiError
    }
    throw error
  }
}

/**
 * Get current user info
 */
export async function getCurrentUser(token: string): Promise<LoginResponse['user']> {
  try {
    const { data } = await apiClient.get<{ user: LoginResponse['user'] }>(
      AUTH_CONFIG.endpoints.me,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    
    return data.user
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw {
        message: error.response?.data?.message || 'Failed to get user info',
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
