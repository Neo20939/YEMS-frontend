/**
 * Audit Logs API Proxy
 * 
 * Proxies audit log requests to the backend API
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

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const level = searchParams.get('level')
    const action = searchParams.get('action')

    console.log('Proxying audit logs request to backend...')
    console.log('Token:', token ? 'Present' : 'Missing')
    console.log('Filters:', { startDate, endDate, level, action })

    // Build query string
    const queryParams = new URLSearchParams()
    if (startDate) queryParams.append('startDate', startDate)
    if (endDate) queryParams.append('endDate', endDate)
    if (level) queryParams.append('level', level)
    if (action) queryParams.append('action', action)

    const queryString = queryParams.toString()
    const url = `${API_BASE_URL}/api/audit-logs${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      headers: {
        ...(token ? { Authorization: token } : {}),
      },
    })

    console.log('Backend response status:', response.status)
    
    const text = await response.text()
    console.log('Backend response body:', text.substring(0, 500))
    
    // Try to parse as JSON
    let data
    try {
      data = JSON.parse(text)
    } catch {
      // If not JSON, return empty array (backend doesn't have this endpoint yet)
      console.log('Backend returned non-JSON response, returning empty array')
      return NextResponse.json([])
    }

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(Array.isArray(data) ? data : [])
  } catch (error: any) {
    console.error('Proxy error:', error)
    // Return empty array for demo purposes when backend is unavailable
    return NextResponse.json([])
  }
}
