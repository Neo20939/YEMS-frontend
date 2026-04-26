/**
 * User Role Update Proxy
 * 
 * Proxies PATCH requests to update user roles
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: userId } = await params
    const body = await request.json()
    const token = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('yems_session')?.value
    const authToken = request.cookies.get('auth_token')?.value

    console.log('[Role API] Updating user role:', userId, 'to:', body.role)

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

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

    const response = await fetch(`${API_BASE_URL}/api/users/${userId}/role`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body),
    })

    const text = await response.text()
    console.log('[Role API] Backend response:', text.substring(0, 500))

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

    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('[Role API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to update user role', message: error.message },
      { status: 500 }
    )
  }
}
