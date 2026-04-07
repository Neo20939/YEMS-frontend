/**
 * Term by ID API Proxy
 *
 * Proxies get, update, delete operations for a specific term
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// GET /api/academic/terms/{id} - Get term by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/academic/terms/${id}`, {
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
    console.error('[Term API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch term', message: error.message },
      { status: 500 }
    )
  }
}

// PATCH /api/academic/terms/{id} - Update term
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/academic/terms/${id}`, {
      method: 'PATCH',
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
    console.error('[Term API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to update term', message: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/academic/terms/{id} - Delete term
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const token = request.headers.get('authorization')

    const response = await fetch(`${API_BASE_URL}/api/academic/terms/${id}`, {
      method: 'DELETE',
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

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('[Term API] Proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to delete term', message: error.message },
      { status: 500 }
    )
  }
}
