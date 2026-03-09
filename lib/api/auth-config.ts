/**
 * Authentication API Configuration
 * 
 * Centralized configuration for backend API authentication.
 * Update these values to change the backend connection.
 */

export const AUTH_CONFIG = {
  // Base URL for the backend API
  // Change this to your production URL when deploying
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev',
  
  // API Endpoints
  endpoints: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    me: '/api/auth/me',
  },
  
  // Request timeout in milliseconds
  timeout: 30000,
  
  // Number of retry attempts
  retries: 3,
  
  // Token storage key
  tokenStorageKey: 'auth_token',
  refreshTokenStorageKey: 'refresh_token',
  userStorageKey: 'auth_user',
}

export type LoginCredentials = {
  email: string
  password: string
}

export type LoginResponse = {
  user: {
    id: string
    email: string
    name: string
    role: string
    avatar?: string
  }
  accessToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: string
}

export type ApiError = {
  message: string
  code?: string
  status?: number
}

/**
 * Create API URL from endpoint
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = AUTH_CONFIG.baseUrl.replace(/\/$/, '')
  return `${baseUrl}${endpoint}`
}

/**
 * Create headers for API requests
 */
export function createHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

/**
 * Save auth token to storage
 */
export function saveAuthToken(accessToken: string, refreshToken?: string, user?: { id: string; email: string; name: string; role: string; avatar?: string }): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_CONFIG.tokenStorageKey, accessToken)
    if (refreshToken) {
      localStorage.setItem(AUTH_CONFIG.refreshTokenStorageKey, refreshToken)
    }
    if (user) {
      localStorage.setItem(AUTH_CONFIG.userStorageKey, JSON.stringify(user))
    }
  }
}

/**
 * Get auth token from storage
 */
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(AUTH_CONFIG.tokenStorageKey)
  }
  return null
}

/**
 * Get user from storage
 */
export function getStoredUser(): { id: string; email: string; name: string; role: string; avatar?: string } | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem(AUTH_CONFIG.userStorageKey)
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch {
        return null
      }
    }
  }
  return null
}

/**
 * Clear auth tokens from storage
 */
export function clearAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_CONFIG.tokenStorageKey)
    localStorage.removeItem(AUTH_CONFIG.refreshTokenStorageKey)
    localStorage.removeItem(AUTH_CONFIG.userStorageKey)
  }
}

/**
 * Get user redirect path based on role
 */
export function getRedirectPathByRole(role: string): string {
  switch (role.toLowerCase()) {
    case 'admin':
      return '/admin'
    case 'teacher':
    case 'professor':
      return '/teachers/dashboard'
    case 'student':
    default:
      return '/dashboard'
  }
}
