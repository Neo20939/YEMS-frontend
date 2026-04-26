import { NextRequest, NextResponse } from 'next/server'
import { getApiBaseUrl } from '@/lib/api/env'

const API_BASE_URL = getApiBaseUrl()

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const { submissionId } = await params
    const body = await request.json()
    const response = await fetch(
      `${API_BASE_URL}/assignments/submissions/${submissionId}/grade`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': request.headers.get('cookie') || '',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      }
    )
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('[assignments/submissions/[submissionId]/grade] PATCH error:', error)
    return NextResponse.json({ success: false, error: 'Failed to grade submission' }, { status: 500 })
  }
}