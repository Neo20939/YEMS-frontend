import { NextRequest, NextResponse } from 'next/server'
import { getApiBaseUrl } from '@/lib/api/env'

const API_BASE_URL = getApiBaseUrl()

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/announcements/targeted`, {
      headers: { 'Cookie': request.headers.get('cookie') || '' },
      credentials: 'include',
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch targeted announcements' }, { status: 500 })
  }
}