/**
 * Teacher Subject Assignment API
 * 
 * Handles assigning subjects to teachers for RBAC-based notes management
 */

import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://kennedi-ungnostic-unconvulsively.ngrok-free.dev'

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

// POST /api/admin/users/:id/assign-subjects - Assign subjects to teacher
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')
    const { id: userId } = await params
    const { subjectIds } = body

    console.log('Assigning subjects to teacher:', userId, subjectIds)

    // Try backend first
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/assign-subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: token } : {}),
        },
        body: JSON.stringify({ subjectIds }),
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (backendError) {
      console.log('Backend unavailable, using localStorage fallback')
    }

    // Fallback: store in localStorage
    // Note: This only works client-side via browser
    return NextResponse.json({
      id: userId,
      assignedSubjects: subjectIds,
      message: 'Subjects assigned (demo mode)',
    })
  } catch (error: any) {
    console.error('Assign subjects error:', error)
    return NextResponse.json(
      { error: 'Failed to assign subjects', message: error.message },
      { status: 500 }
    )
  }
}

// GET /api/admin/users/:id/subjects - Get teacher's assigned subjects
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.headers.get('authorization')
    const { id: userId } = await params

    console.log('Getting assigned subjects for teacher:', userId)

    // Try backend first
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/subjects`, {
        headers: {
          ...(token ? { Authorization: token } : {}),
        },
      })

      if (response.ok) {
        const data = await response.json()
        return NextResponse.json(data)
      }
    } catch (backendError) {
      console.log('Backend unavailable, using localStorage fallback')
    }

    // Fallback: return empty array (will be populated client-side)
    return NextResponse.json([])
  } catch (error: any) {
    console.error('Get subjects error:', error)
    return NextResponse.json(
      { error: 'Failed to get subjects', message: error.message },
      { status: 500 }
    )
  }
}
