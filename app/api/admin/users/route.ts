/**
 * Admin API Proxy
 * 
 * Proxies admin requests to the backend API to avoid CORS issues
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')
    
    // Get session cookie from incoming request
    const sessionCookie = request.cookies.get('yems_session')?.value

    console.log('[Users API] Creating user...')
    console.log('[Users API] yems_session cookie:', sessionCookie ? 'present' : 'missing')
    console.log('[Users API] Body:', body)

    // Backend /api/users/ expects specific fields
    // Transform frontend data to match backend expectations
    const backendData: Record<string, any> = {
      email: body.email,
    }
    
    // Handle name - check for firstName/lastName OR name (backwards compatibility)
    if (body.firstName && body.lastName) {
      backendData.firstName = body.firstName
      backendData.lastName = body.lastName
    } else if (body.name) {
      // Fallback: split name into firstName and lastName
      const nameParts = body.name.split(' ')
      backendData.firstName = nameParts[0]
      backendData.lastName = nameParts.slice(1).join(' ') || ''
    }
    
    // Handle password
    if (body.password) {
      backendData.password = body.password
    }
    
    // Handle roles - backend expects array of numbers (role IDs)
    if (body.roles && Array.isArray(body.roles)) {
      // Already in correct format (array of numbers)
      backendData.roles = body.roles
    } else if (body.role) {
      // Map frontend role strings to backend role IDs (legacy format)
      const roleIdMap: Record<string, number> = {
        'student': 7,        // First student role ID
        'subject_teacher': 3,
        'class_teacher': 4,
        'teacher': 3,
        'admin': 1,
        'platform_admin': 1,
        'technician': 2,
        'finance': 5,
      }
      const roleId = roleIdMap[body.role] || 3
      backendData.roles = [roleId]
    }

    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (authHeader) headers['Authorization'] = authHeader
    
    console.log('[Users API] Session cookie value:', sessionCookie ? 'present' : 'missing')
    if (sessionCookie) {
      headers['Cookie'] = `yems_session=${sessionCookie}`
    }

    console.log('[Users API] Final headers:', JSON.stringify(headers))

    const response = await fetch(`${API_BASE_URL}/api/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify(backendData),
    })

    console.log('[Users API] Backend response status:', response.status)

    const text = await response.text()
    console.log('[Users API] Backend response body:', text.substring(0, 500))

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
      console.error('[Users API] Backend error response:', data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json({ success: true, data: data })
  } catch (error: any) {
    console.error('[Users API] Proxy error:', error)
    console.error('[Users API] Error details:', error.stack)
    return NextResponse.json(
      { error: 'Failed to create user', message: error.message || 'Server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('yems_session')?.value

    console.log('[Users API] Proxying GET request to backend...')
    console.log('[Users API] Token present:', !!token)
    console.log('[Users API] Session cookie present:', !!sessionCookie)

    // Backend has /api/users/ for listing users
    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (authHeader) headers['Authorization'] = authHeader
    if (sessionCookie) {
      headers['Cookie'] = `yems_session=${sessionCookie}`
      console.log('[Users API] Sending cookie to backend')
    }

    console.log('[Users API] Calling backend:', `${API_BASE_URL}/api/users`)
    
    let response
    try {
      response = await fetch(`${API_BASE_URL}/api/users`, {
        headers,
      })
    } catch (fetchError: any) {
      console.error('[Users API] Fetch error:', fetchError.message)
      console.error('[Users API] Fetch error type:', fetchError.constructor.name)
      return NextResponse.json(
        { error: 'Failed to connect to backend', message: fetchError.message, type: fetchError.constructor.name },
        { status: 502 }
      )
    }

    console.log('[Users API] Backend response status:', response.status)

    const text = await response.text()
    console.log('[Users API] Backend response body:', text.substring(0, 1000))

    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('[Users API] Backend returned non-JSON response')
      return NextResponse.json(
        { error: 'Backend returned invalid response' },
        { status: response.status }
      )
    }

    console.log('[Users API] Parsed data:', data)
    console.log('[Users API] Is array?', Array.isArray(data))

    if (!response.ok) {
      console.error('[Users API] Backend error:', response.status, data)
      return NextResponse.json(data, { status: response.status })
    }

    // Wrap response in success format to match expected format
    return NextResponse.json({ success: true, data: data })
  } catch (error: any) {
    console.error('[Users API] Proxy error:', error)
    console.error('[Users API] Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message, details: error.stack },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('yems_session')?.value
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Backend uses /api/users/{id} for deleting users
    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (authHeader) headers['Authorization'] = authHeader
    if (sessionCookie) headers['Cookie'] = `yems_session=${sessionCookie}`

    const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: 'DELETE',
      headers,
    })

    if (!response.ok) {
      const data = await response.json()
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Users API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to delete user', message: error.message },
      { status: 500 }
    )
  }
}
