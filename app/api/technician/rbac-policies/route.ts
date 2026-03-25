/**
 * Technician RBAC Policies API Proxy
 *
 * Proxies RBAC policies requests to backend /api/technician/rbac/policies
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    console.log('[RBAC API] Proxying request to backend...')
    console.log('[RBAC API] Token present:', !!token)

    // Backend expects "Bearer <token>" format
    const authHeader = token ? `Bearer ${token.replace('Bearer ', '')}` : undefined

    const response = await fetch(`${API_BASE_URL}/api/technician/rbac/policies`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {}),
      },
    })

    console.log('[RBAC API] Backend response status:', response.status)

    const text = await response.text()
    console.log('[RBAC API] Backend response body:', text.substring(0, 1000))

    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      console.error('[RBAC API] Backend returned non-JSON response')
      return NextResponse.json(
        { error: 'Backend returned invalid response' },
        { status: response.status }
      )
    }

    if (!response.ok) {
      console.error('[RBAC API] Backend error:', response.status, data)
      return NextResponse.json(data, { status: response.status })
    }

    // Transform backend format {policies: {role: [permissions]}} to array
    if (data && data.policies && typeof data.policies === 'object') {
      const policiesArray = Object.entries(data.policies).map(([role, permissions]) => ({
        id: `rbac_${role}`,
        name: formatRoleName(role),
        role: role,
        permissions: permissions as string[],
        status: 'active' as const,
        userCount: 0, // Backend doesn't provide user count
        lastModified: new Date().toISOString(),
      }))
      console.log('[RBAC API] Transformed to array:', policiesArray.length, 'roles')
      return NextResponse.json(policiesArray)
    }

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
