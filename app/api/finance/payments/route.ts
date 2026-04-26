import { NextRequest, NextResponse } from 'next/server'
import { getApiBaseUrl } from '@/lib/api/env'

const API_BASE_URL = getApiBaseUrl()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const response = await fetch(`${API_BASE_URL}/finance/payments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': request.headers.get('cookie') || '' },
      body: JSON.stringify(body),
      credentials: 'include',
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create payment' }, { status: 500 })
  }
}