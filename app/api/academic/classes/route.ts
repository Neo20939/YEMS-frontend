/**
 * Classes API Proxy
 *
 * Proxies class operations to the backend API
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

// GET /api/academic/classes - List classes
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/academic/classes`, {
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
    console.error('[Classes API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch classes', message: error.message },
      { status: 500 }
    )
  }
}

// POST /api/academic/classes - Create class
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/academic/classes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { Authorization: token.replace('Bearer ', '') } : {}),
      },
      body: JSON.stringify(body),
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

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Classes API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to create class', message: error.message },
      { status: 500 }
    )
  }
}
