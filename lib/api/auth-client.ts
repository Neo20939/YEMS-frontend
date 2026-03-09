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
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
        code: error.response?.data?.code,
        status: error.response?.status,
      }
      throw apiError
    }
    throw error
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
