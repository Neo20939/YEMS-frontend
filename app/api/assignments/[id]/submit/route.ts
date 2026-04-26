import { NextRequest, NextResponse } from 'next/server'
import { getApiBaseUrl } from '@/lib/api/env'

const API_BASE_URL = getApiBaseUrl()

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const response = await fetch(`${API_BASE_URL}/assignments/${id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[assignments/[id]/submit] POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to submit assignment' }, { status: 500 })
  }
}