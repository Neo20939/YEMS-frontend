/**
 * Admin Subjects API Proxy
 *
 * Proxies subject operations to the backend API
 * Backend only supports: POST /api/admin/subjects (create)
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// GET /api/admin/subjects - List subjects (from localStorage fallback)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('id')

    // Backend doesn't have GET endpoint, return empty array
    // Subjects are stored in localStorage as fallback
    if (typeof request.headers.get('x-storage') !== 'undefined') {
      return NextResponse.json([])
    }

    console.log('[Subjects API] Backend does not support GET, returning empty list')
    return NextResponse.json([])
  } catch (error: any) {
    console.error('[Subjects API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects', message: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/subjects - Create subject
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')

    console.log('[Subjects API] Creating subject...')
    console.log('[Subjects API] Body:', body)

    const response = await fetch(`${API_BASE_URL}/api/admin/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: token.replace('Bearer ', '') } : {}),
      },
      body: JSON.stringify(body),
    })

    console.log('[Subjects API] Backend response status:', response.status)

    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!isJson) {
      const text = await response.text()
      console.error('[Subjects API] Backend returned non-JSON response:', text.substring(0, 500))
      return NextResponse.json(
        { error: 'Backend returned invalid response format', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('[Subjects API] Backend response data:', data)

    if (!response.ok) {
      console.error('[Subjects API] Backend error:', response.status, data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Subjects API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to create subject', message: error.message },
      { status: 500 }
    )
  }
}
