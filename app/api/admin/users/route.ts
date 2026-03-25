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

    console.log('[Users API] Creating user...')
    console.log('[Users API] Body:', body)

    // Backend expects "Bearer <token>" format
    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
      body: JSON.stringify(body),
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
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Users API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to create user', message: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    console.log('[Users API] Proxying GET request to backend...')
    console.log('[Users API] Token present:', !!token)

    // Backend expects "Bearer <token>" format
    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    console.log('[Users API] Backend response status:', response.status)

    const text = await response.text()
    console.log('[Users API] Backend response body:', text.substring(0, 500))

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

    if (!response.ok) {
      console.error('[Users API] Backend error:', response.status, data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Users API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users', message: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Backend expects "Bearer <token>" format
    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
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
