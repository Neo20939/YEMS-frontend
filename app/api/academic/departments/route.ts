/**
 * Departments API Proxy
 *
 * Proxies get departments to the backend API
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

// GET /api/academic/departments - List departments
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/academic/departments`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        ...(token ? { Authorization: token.replace('Bearer ', '') } : {}),
      },
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
    console.error('[Departments API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch departments', message: error.message },
      { status: 500 }
    )
  }
}
