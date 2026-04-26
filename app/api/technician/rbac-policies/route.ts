/**
 * Technician RBAC Policies API Proxy
 *
 * Proxies RBAC policies requests to backend /technician/rbac/policies
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const yemsSession = request.cookies.get('yems_session')?.value

    console.log('[RBAC API] Proxying request to backend...')
    console.log('[RBAC API] Token present:', !!token)
    console.log('[RBAC API] Session present:', !!yemsSession)

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    }
    if (yemsSession) {
      headers['Cookie'] = `yems_session=${yemsSession}`
      headers['x-session-token'] = yemsSession
    }

    const response = await fetch(`${API_BASE_URL}/technician/rbac/policies`, {
      method: 'GET',
      headers,
      credentials: 'include',
    })

    console.log('[RBAC API] Backend response status:', response.status)

    const text = await response.text()
    console.log('[RBAC API] Backend response body:', text.substring(0, 1000))

    if (!response.ok) {
      console.error('[RBAC API] Backend error:', response.status, text)
      return NextResponse.json(
        { error: `Backend error: ${response.status}`, details: text },
        { status: response.status }
      )
    }

    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('[RBAC API] Backend returned non-JSON response')
      return NextResponse.json(
        { error: 'Backend returned invalid response' },
        { status: 500 }
      )
    }

    // Transform backend format to array if needed
    if (data && data.policies && typeof data.policies === 'object') {
      const policiesArray = Object.entries(data.policies).map(([role, permissions]) => ({
        id: `rbac_${role}`,
        name: formatRoleName(role),
        role: role,
        permissions: permissions as string[],
        status: 'active' as const,
        userCount: 0,
        lastModified: new Date().toISOString(),
      }))
      console.log('[RBAC API] Transformed to array:', policiesArray.length, 'roles')
      return NextResponse.json(policiesArray)
    }

    // If already an array, return as-is
    if (Array.isArray(data)) {
      return NextResponse.json(data)
    }

    console.log('[RBAC API] Unexpected data format:', typeof data)
    return NextResponse.json([])
  } catch (error: any) {
    console.error('[RBAC API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RBAC policies', message: error.message },
      { status: 500 }
    )
  }
}

function formatRoleName(role: string): string {
  return role
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
