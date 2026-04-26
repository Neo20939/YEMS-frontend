import { NextRequest, NextResponse } from 'next/server'

const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')
  }
  return process.env.NEXT_PUBLIC_API_LOCAL_URL || 'http://localhost/shdhfh@s/api'
}

const API_BASE_URL = getBackendUrl()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  const { id } = await params
  const sessionCookie = request.cookies.get('yems_session')?.value
  
  try {
    const axios = require('axios')
    const response = await axios.default.get(`${API_BASE_URL}/api/exams/submissions/${id}`, {
      headers: {
        'Cookie': sessionCookie ? `yems_session=${sessionCookie}` : '',
        'Accept': 'application/json',
      },
      withCredentials: true,
    })
    return NextResponse.json(response.data)
  } catch (error: any) {
    const axios = require('axios')
    if (axios.default.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status })
    }
    return NextResponse.json({ message: 'Failed to get submission', error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  const { id } = await params
  const sessionCookie = request.cookies.get('yems_session')?.value
  const body = await request.json()
  
  try {
    const axios = require('axios')
    const response = await axios.default.patch(`${API_BASE_URL}/api/exams/submissions/${id}`, body, {
      headers: {
        'Cookie': sessionCookie ? `yems_session=${sessionCookie}` : '',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
    return NextResponse.json(response.data)
  } catch (error: any) {
    const axios = require('axios')
    if (axios.default.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status })
    }
    return NextResponse.json({ message: 'Failed to update submission', error: error.message }, { status: 500 })
  }
}