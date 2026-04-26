import { NextRequest, NextResponse } from 'next/server'
import { getApiBaseUrl } from '@/lib/api/env'

const API_BASE_URL = getApiBaseUrl()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      headers: { 'Cookie': request.headers.get('cookie') || '' },
      credentials: 'include',
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch announcement' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Cookie': request.headers.get('cookie') || '' },
      body: JSON.stringify(body),
      credentials: 'include',
    })
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update announcement' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const response = await fetch(`${API_BASE_URL}/announcements/${id}`, {
      method: 'DELETE',
      headers: { 'Cookie': request.headers.get('cookie') || '' },
      credentials: 'include',
    })
    return NextResponse.json({}, { status: response.status })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete announcement' }, { status: 500 })
  }
}