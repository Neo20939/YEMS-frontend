/**
 * Admin Audit Logs API Proxy
 *
 * Proxies audit log operations to the backend API
 * Backend: GET /api/audit and GET /api/audit/export
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// GET /api/admin/audit-logs - List audit logs
// Matches backend: GET /api/audit with filters
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('yems_session')?.value

    console.log('[Audit Logs API] Fetching audit logs')

    // Forward query parameters to backend
    // Backend accepts: page, limit, actorId, action, entityType, entityId, from, to
    const queryString = request.nextUrl.search.toString()
    const backendUrl = `${API_BASE_URL}/api/audit${queryString}`

    console.log('[Audit Logs API] Proxy GET to:', backendUrl)

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    }
    if (token) headers['Authorization'] = token.replace('Bearer ', '')
    if (sessionCookie) {
      headers['x-session-token'] = sessionCookie
      headers['Cookie'] = `yems_session=${sessionCookie}`
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
    })

    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')

    if (!isJson) {
      const text = await response.text()
      return NextResponse.json(
        { error: 'Backend returned invalid response format', status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Audit Logs API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs', message: error.message },
      { status: 500 }
    )
  }
}

// GET /api/admin/audit-logs/export - Export audit logs as CSV
// Matches backend: GET /api/audit/export
export async function GET_EXPORT(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const sessionCookie = request.cookies.get('yems_session')?.value

    console.log('[Audit Logs API] Exporting audit logs as CSV')

    // Forward query parameters to backend for filtering
    const queryString = request.nextUrl.search.toString()
    const backendUrl = `${API_BASE_URL}/api/audit/export${queryString}`

    console.log('[Audit Logs API] Proxy GET to:', backendUrl)

    const headers: Record<string, string> = {}
    if (token) headers['Authorization'] = token.replace('Bearer ', '')
    if (sessionCookie) {
      headers['x-session-token'] = sessionCookie
      headers['Cookie'] = `yems_session=${sessionCookie}`
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
    })

    // Check if response is CSV
    const contentType = response.headers.get('content-type')
    const isCsv = contentType?.includes('text/csv')

    if (!isCsv) {
      // Backend may have returned an error JSON
      const text = await response.text()
      try {
        const errorData = JSON.parse(text)
        return NextResponse.json(errorData, { status: response.status })
      } catch {
        return NextResponse.json(
          { error: 'Failed to export audit logs', details: text },
          { status: response.status }
        )
      }
    }

    const csvText = await response.text()
    return new NextResponse(csvText, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error: any) {
    console.error('[Audit Logs API] Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export audit logs', message: error.message },
      { status: 500 }
    )
  }
}
