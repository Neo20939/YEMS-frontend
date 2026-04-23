/**
 * Teacher Subjects API Proxy
 * 
 * Proxies teacher subject assignment requests to the backend API
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

// GET /api/admin/teachers/[id]/subjects - Get subjects assigned to a teacher
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teacherId } = await params
    const token = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('yems_session')?.value

    console.log('[Teacher Subjects API] Getting subjects for teacher:', teacherId)

    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (authHeader) headers['Authorization'] = authHeader
    if (sessionCookie) {
      // Use x-session-token header for cross-site auth (SameSite=Strict fix)
      headers['x-session-token'] = sessionCookie
      headers['Cookie'] = `yems_session=${sessionCookie}`
    }

    const response = await fetch(`${API_BASE_URL}/api/teachers/${teacherId}/subjects`, {
      method: 'GET',
      headers,
    })

    console.log('[Teacher Subjects API] Backend response status:', response.status)

    const text = await response.text()
    console.log('[Teacher Subjects API] Backend response body:', text.substring(0, 500))

    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'Backend returned invalid response', message: text.substring(0, 200) },
        { status: response.status }
      )
    }

    if (!response.ok) {
      console.error('[Teacher Subjects API] Backend error:', response.status, data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json({ success: true, data: data })
  } catch (error: any) {
    console.error('[Teacher Subjects API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch teacher subjects', message: error.message || 'Server error' },
      { status: 500 }
    )
  }
}

// POST /api/admin/teachers/[id]/subjects - Assign subjects to a teacher
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: teacherId } = await params
    const body = await request.json()
    const token = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('yems_session')?.value

    console.log('[Teacher Subjects API] Assigning subjects to teacher:', teacherId)
    console.log('[Teacher Subjects API] Body:', body)

    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (authHeader) headers['Authorization'] = authHeader
    if (sessionCookie) {
      // Use x-session-token header for cross-site auth (SameSite=Strict fix)
      headers['x-session-token'] = sessionCookie
      headers['Cookie'] = `yems_session=${sessionCookie}`
    }

    const response = await fetch(`${API_BASE_URL}/api/teachers/${teacherId}/subjects`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })

    console.log('[Teacher Subjects API] Backend response status:', response.status)

    const text = await response.text()
    console.log('[Teacher Subjects API] Backend response body:', text.substring(0, 500))

    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'Backend returned invalid response', message: text.substring(0, 200) },
        { status: response.status }
      )
    }

    if (!response.ok) {
      console.error('[Teacher Subjects API] Backend error:', response.status, data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json({ success: true, data: data })
  } catch (error: any) {
    console.error('[Teacher Subjects API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to assign teacher subjects', message: error.message || 'Server error' },
      { status: 500 }
    )
  }
}