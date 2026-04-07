import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

export async function GET(request: NextRequest) {
  try {
    console.log('[Admin Stats] Starting request')
    console.log('[Admin Stats] API_BASE_URL:', API_BASE_URL)
    
    // Get session from cookies
    const yemsSession = request.cookies.get('yems_session')?.value
    const authToken = request.cookies.get('auth_token')?.value

    console.log('[Admin Stats] yems_session:', yemsSession ? 'found' : 'NOT FOUND')
    console.log('[Admin Stats] auth_token:', authToken ? 'found' : 'NOT FOUND')

    if (!yemsSession && !authToken) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    // Build headers - prefer Bearer token if available
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    
    if (yemsSession) {
      headers['Cookie'] = `yems_session=${yemsSession}`
    }

    // Direct call to external API's /admin/stats endpoint
    console.log('[Admin Stats] Calling external API at:', `${API_BASE_URL}/api/admin/stats`)
    
    const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
      method: 'GET',
      headers,
      credentials: 'include',
    })

    const data = await response.json()
    console.log('[Admin Stats] External API response:', JSON.stringify(data).substring(0, 500))

    return NextResponse.json(data)
  } catch (error) {
    console.error('[Admin Stats Proxy] Error:', error)

    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.', code: 'UNKNOWN_ERROR' },
      { status: 500 }
    )
  }
}
