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

export async function GET(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''

    // Extract yems_session cookie from the request
    const yemsSessionMatch = cookieHeader.match(/yems_session=([^;]+)/)
    const yemsSession = yemsSessionMatch ? yemsSessionMatch[1] : null

    if (!yemsSession) {
      return NextResponse.json(
        { success: false, error: 'UNAUTHORIZED', message: 'Not authenticated' },
        { status: 401 }
      )
    }

    const response = await backendClient.get('api/auth/me', {
      headers: {
        'Cookie': `yems_session=${yemsSession}`,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('[Auth Me Proxy] Error:', error)

    if (axios.isAxiosError(error)) {
      const errCode = (error as any).code
      if (errCode === 'ERR_NETWORK' || !error.response) {
        return NextResponse.json(
          { success: false, error: 'NETWORK_ERROR', message: 'Unable to connect to the server' },
          { status: 503 }
        )
      }
      if (error.response?.status === 401) {
        return NextResponse.json(
          { success: false, error: 'UNAUTHORIZED', message: 'Not authenticated' },
          { status: 401 }
        )
      }
      return NextResponse.json(
        error.response?.data || { success: false, error: 'UNKNOWN_ERROR', message: 'Failed to get user info' },
        { status: error.response?.status || 500 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'UNKNOWN_ERROR', message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}