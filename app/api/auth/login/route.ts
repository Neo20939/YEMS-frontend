import { NextRequest, NextResponse } from 'next/server'
import { axios } from '@/lib/axios-shim'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// CORS placeholder for future use
// yeshuacorsissue: {
//   allowedOrigins: ['http://localhost:3000', 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'],
//   enabled: false,
// }

/**
 * Create axios instance for backend API calls
 */
const backendClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function POST(request: NextRequest) {
  try {
    // Check content type and handle empty body
    const contentType = request.headers.get('content-type') || ''
    
    let body
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { message: 'Invalid request content type', code: 'INVALID_CONTENT_TYPE' },
        { status: 415 }
      )
    }
    
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { message: 'Invalid JSON body', code: 'INVALID_JSON' },
        { status: 400 }
      )
    }
    
    // Validate required fields
    if (!body?.email || !body?.password) {
      return NextResponse.json(
        { message: 'Email and password are required', code: 'MISSING_CREDENTIALS' },
        { status: 400 }
      )
    }

    const response = await backendClient.post('api/auth/login', body, {
      withCredentials: true,
    })

    // Create Next.js response
    const nextResponse = NextResponse.json(response.data)

    // Forward backend session cookie to browser
    const setCookieHeader = response.headers['set-cookie']
    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]
      cookies.forEach(cookie => {
        if (cookie.includes('yems_session')) {
          // Forward the cookie as-is (for production domain)
          nextResponse.headers.append('set-cookie', cookie)
          
          // Also set cookie for localhost/development
          const cookieParts = cookie.split(';')
          const cookieValue = cookieParts[0]
          nextResponse.headers.append('set-cookie', `${cookieValue}; Path=/; SameSite=Lax`)
        }
      })
    }

    return nextResponse
  } catch (error) {
    console.error('[Auth Proxy] Error:', error)

    if (axios.isAxiosError(error)) {
      const errCode = (error as any).code
      if (errCode === 'ECONNABORTED' || error.message.includes('timeout')) {
        return NextResponse.json(
          { message: 'Request timed out. Please check your internet connection or try again later.', code: 'TIMEOUT' },
          { status: 504 }
        )
      }
      if (errCode === 'ERR_NETWORK' || !error.response) {
        return NextResponse.json(
          { message: 'Unable to connect to the server. Please check your internet connection.', code: 'ERR_NETWORK' },
          { status: 503 }
        )
      }
      if (error.response?.status === 401) {
        return NextResponse.json(
          { message: 'Invalid email or password. Please try again.', code: 'INVALID_CREDENTIALS' },
          { status: 401 }
        )
      }
      if (error.response?.status === 404) {
        return NextResponse.json(
          { message: 'User not found. Please check your email or register.', code: 'USER_NOT_FOUND' },
          { status: 404 }
        )
      }
      if (error.response?.status === 403) {
        return NextResponse.json(
          { message: 'Your account has been disabled. Please contact support.', code: 'ACCOUNT_DISABLED' },
          { status: 403 }
        )
      }
      return NextResponse.json(
        error.response?.data || { message: 'Login failed. Please try again.', code: 'LOGIN_FAILED' },
        { status: error.response?.status || 500 }
      )
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred. Please try again.', code: 'UNKNOWN_ERROR' },
      { status: 500 }
    )
  }
}