import { NextRequest, NextResponse } from 'next/server'
import { axios } from '@/lib/axios-shim'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// CORS placeholder for future use
// yeshuacorsissue: {
//   allowedOrigins: ['https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'],
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
    const cookieHeader = request.headers.get('cookie') || ''

    const response = await backendClient.post('api/auth/logout', {}, {
      headers: {
        'Cookie': cookieHeader,
      },
    })

    return NextResponse.json(response.data)
  } catch (error) {
    console.error('[Auth Proxy] Error:', error)
    return NextResponse.json(
      { message: 'Unable to connect to the server', code: 'ERR_NETWORK' },
      { status: 500 }
    )
  }
}