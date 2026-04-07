/**
 * Admin Students API Proxy
 *
 * Proxies student operations to the backend API
 * Backend has /api/students/ for student management
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

// GET /api/admin/students - List students
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    const response = await fetch(`${API_BASE_URL}/api/students/`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    const text = await response.text()

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json(
        { error: 'Backend returned invalid response' },
        { status: response.status }
      )
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    // Wrap in success format
    return NextResponse.json({ success: true, data: data })
  } catch (error: any) {
    console.error('[Students API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch students', message: error.message },
      { status: 500 }
    )
  }
}

// POST /api/admin/students - Create student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')

    console.log('[Students API] Creating student with body:', body)

    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    // Backend /api/students/ expects: email, firstName, lastName, academicYearId, termId
    // But we receive: email, name, password, role from frontend
    // Let's try creating via /api/users/ first as it's more flexible
    const userResponse = await fetch(`${API_BASE_URL}/api/users/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify({
        email: body.email,
        firstName: body.name?.split(' ')[0] || body.name,
        lastName: body.name?.split(' ').slice(1).join(' ') || '',
        password: body.password,
        roles: ['student'],
      }),
    })

    const userText = await userResponse.text()
    console.log('[Students API] User creation response:', userText.substring(0, 500))

    let userData
    try {
      userData = JSON.parse(userText)
    } catch {
      return NextResponse.json(
        { error: 'Backend returned invalid response', details: userText.substring(0, 200) },
        { status: userResponse.status }
      )
    }

    if (!userResponse.ok) {
      return NextResponse.json(userData, { status: userResponse.status })
    }

    return NextResponse.json({ success: true, data: userData })
  } catch (error: any) {
    console.error('[Students API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to create student', message: error.message },
      { status: 500 }
    )
  }
}
