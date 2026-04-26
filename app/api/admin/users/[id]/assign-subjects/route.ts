/**
 * Teacher Subject Assignment API
 * 
 * Handles assigning subjects to teachers for RBAC-based notes management
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// POST /api/admin/users/:id/assign-subjects - Assign subjects to teacher
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('yems_session')?.value
    const authToken = request.cookies.get('auth_token')?.value
    const { id: userId } = await params
    const { subjectIds } = body

    console.log('[Assign Subjects API] Assigning subjects to teacher:', userId, subjectIds)

    // Build headers with auth
    const authHeader = token 
      ? `Bearer ${token.replace('Bearer ', '')}` 
      : (authToken ? `Bearer ${authToken}` : undefined)

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

    const response = await fetch(`${API_BASE_URL}/api/teachers/${userId}/subjects`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ subjectIds }),
    })

    const text = await response.text()
    console.log('[Assign Subjects API] Backend response:', text.substring(0, 500))

    if (response.ok) {
      let data
      try {
        data = JSON.parse(text)
      } catch {
        return NextResponse.json({ success: true })
      }
      return NextResponse.json({ success: true, data })
    }

    // If backend fails, return error
    let errorData
    try {
      errorData = JSON.parse(text)
    } catch {
      errorData = { error: 'Failed to assign subjects' }
    }
    return NextResponse.json(errorData, { status: response.status })
  } catch (error: any) {
    console.error('[Assign Subjects API] Assign subjects error:', error)
    return NextResponse.json(
      { error: 'Failed to assign subjects', message: error.message },
      { status: 500 }
    )
  }
}

// GET /api/admin/users/:id/subjects - Get teacher's assigned subjects
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('yems_session')?.value
    const authToken = request.cookies.get('auth_token')?.value
    const { id: userId } = await params

    console.log('[Assign Subjects API] Getting assigned subjects for teacher:', userId)

    // Build headers with auth
    const authHeader = token 
      ? `Bearer ${token.replace('Bearer ', '')}` 
      : (authToken ? `Bearer ${authToken}` : undefined)

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }
    if (authHeader) headers['Authorization'] = authHeader
    if (sessionCookie) {
      // Use x-session-token header for cross-site auth (SameSite=Strict fix)
      headers['x-session-token'] = sessionCookie
      headers['Cookie'] = `yems_session=${sessionCookie}`
    }

    const response = await fetch(`${API_BASE_URL}/api/teachers/${userId}/subjects`, {
      method: 'GET',
      headers,
    })

    const text = await response.text()
    console.log('[Assign Subjects API] Backend response:', text.substring(0, 500))

    if (response.ok) {
      let data
      try {
        data = JSON.parse(text)
      } catch {
        return NextResponse.json({ success: true, data: [] })
      }
      return NextResponse.json({ success: true, data })
    }

    // If backend fails, return empty array
    return NextResponse.json({ success: true, data: [] })
  } catch (error: any) {
    console.error('[Assign Subjects API] Get subjects error:', error)
    return NextResponse.json(
      { error: 'Failed to get subjects', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/users/:id/assign-subjects - Remove subject assignment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')
    const { id: userId } = await params
    const { subjectIds } = body

    console.log('[Assign Subjects API] Removing subjects from teacher:', userId, subjectIds)

    // Build headers with auth
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (token) headers['Authorization'] = token.replace('Bearer ', '')

    const response = await fetch(`${API_BASE_URL}/api/teachers/${userId}/subjects`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ subjectIds }),
    })

    if (response.ok) {
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Failed to remove subjects' },
      { status: response.status }
    )
  } catch (error: any) {
    console.error('[Assign Subjects API] Remove subjects error:', error)
    return NextResponse.json(
      { error: 'Failed to remove subjects', message: error.message },
      { status: 500 }
    )
  }
}
