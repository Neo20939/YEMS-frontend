/**
 * Technician Health API Proxy
 *
 * Proxies health requests to backend
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const yemsSession = request.cookies.get('yems_session')?.value

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    if (yemsSession) {
      headers['Cookie'] = `yems_session=${yemsSession}`
    }

    const response = await fetch(`${API_BASE_URL}/status/health`, {
      method: 'GET',
      headers,
      credentials: 'include',
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[Health API] Backend error:', response.status, errorText)
      return NextResponse.json(
        { error: `Backend error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Health API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch health', message: error.message },
      { status: 500 }
    )
  }
}
