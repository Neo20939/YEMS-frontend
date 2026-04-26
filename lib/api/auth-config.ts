/**
 * Authentication API Configuration
 *
 * Centralized configuration for backend API authentication.
 * Update these values to change the backend connection.
 */

// CORS placeholder for future use
// yeshuacorsissue: {
//   allowedOrigins: ['http://localhost:3000', 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'],
//   enabled: false,
// }

export const AUTH_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_LOCAL_URL || 'http://localhost/shdhfh@s/api',

  endpoints: {
    login: 'auth/login',
    logout: 'auth/logout',
    me: 'auth/me',
  },

  timeout: 30000,
  retries: 3,
  sessionCookieName: 'yems_session',
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
    firstName?: string
    lastName?: string
    roles?: number[] | Array<{ id: number; name: string }>
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
  details?: unknown
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
export function saveAuthToken(accessToken: string, refreshToken?: string, user?: { id: string; email: string; name: string; role: string; avatar?: string; roles?: unknown[] }): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_CONFIG.tokenStorageKey, accessToken)
    if (refreshToken) {
      localStorage.setItem(AUTH_CONFIG.refreshTokenStorageKey, refreshToken)
    }
    if (user) {
      const userForStorage = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        roles: user.roles,
      }
      localStorage.setItem(AUTH_CONFIG.userStorageKey, JSON.stringify(userForStorage))
      // Also set cookies for middleware to read
      document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(userForStorage))}; path=/; max-age=86400; SameSite=Lax`
    }
    // Set auth token cookie for middleware
    document.cookie = `auth_token=${accessToken}; path=/; max-age=86400; SameSite=Lax`
    
    // Force cookie to be sent immediately by setting it synchronously
    // Also set a version cookie to trigger immediate send
    document.cookie = `auth_version=1; path=/; max-age=86400; SameSite=Lax`
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
        const user = JSON.parse(userStr)
        // Map role ID to role name if needed (matches API spec message.txt lines 65-78)
        const roleIdMap: Record<string, string> = {
          '1': 'admin',
          '2': 'technician',
          '3': 'subject_teacher',
          '4': 'class_teacher',
          '5': 'finance_staff',
          '6': 'reserved',
          '7': 'student_js1',
          '8': 'student_js2',
          '9': 'student_js3',
          '10': 'student_ss1',
          '11': 'student_ss2',
          '12': 'student_ss3',
        }
        // If role is a number-like string, map it
        if (roleIdMap[user.role]) {
          user.role = roleIdMap[user.role]
        }
        return user
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
    // Clear cookies
    document.cookie = 'auth_token=; path=/; max-age=0'
    document.cookie = 'auth_user=; path=/; max-age=0'
  }
}

/**
 * Get user redirect path based on role
 */
export function getRedirectPathByRole(role: string): string {
  const normalizedRole = role.toLowerCase().trim()

  // Admin roles
  if (normalizedRole === 'admin' ||
      normalizedRole === 'administrator' ||
      normalizedRole === 'platform_admin') {
    return '/admin'
  }

  // Technician role
  if (normalizedRole === 'technician') {
    return '/technician/dashboard'
  }

  // Teacher roles (subject teachers)
  if (normalizedRole === 'subject_teacher' ||
      normalizedRole === 'teacher' ||
      normalizedRole === 'professor' ||
      normalizedRole === 'instructor') {
    return '/teachers/dashboard'
  }

  // Class teacher / Form teacher role
  if (normalizedRole === 'class_teacher' ||
      normalizedRole === 'form_teacher') {
    return '/class-teachers'
  }

  // Finance role
  if (normalizedRole === 'finance_staff' ||
      normalizedRole === 'finance') {
    return '/finance/dashboard'
  }

  // Student role (all student tiers go to student dashboard)
  if (normalizedRole === 'student' ||
      normalizedRole.startsWith('student_js') ||
      normalizedRole.startsWith('student_ss')) {
    return '/dashboard'
  }

  // Reserved role - redirect to admin
  if (normalizedRole === 'reserved') {
    return '/admin'
  }

  // Default to student dashboard for unknown roles
  return '/dashboard'
}
