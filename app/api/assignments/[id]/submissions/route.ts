import { NextRequest, NextResponse } from 'next/server'
import { getApiBaseUrl } from '@/lib/api/env'

const API_BASE_URL = getApiBaseUrl()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const response = await fetch(`${API_BASE_URL}/assignments/${id}/submissions`, {
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      credentials: 'include',
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[assignments/[id]/submissions] GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch submissions' }, { status: 500 })
  }
}