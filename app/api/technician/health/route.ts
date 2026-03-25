/**
 * Technician Health API Proxy
 *
 * Proxies system health requests to backend
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    // Try to fetch from backend health endpoint
    const response = await fetch(`${API_BASE_URL}/status/health`, {
      headers: {
        ...(token ? { Authorization: token } : {}),
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Backend returned error status
    const errorData = await response.text()
    console.log('[Health API] Backend returned error:', response.status, errorData)
    return NextResponse.json(
      { error: 'Backend health endpoint unavailable', status: response.status },
      { status: response.status }
    )
  } catch (error) {
    console.error('Health proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to connect to backend health endpoint' },
      { status: 503 }
    )
  }
}
