import { NextRequest, NextResponse } from 'next/server'

const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')
  }
  return process.env.NEXT_PUBLIC_API_LOCAL_URL || 'http://localhost/shdhfh@s/api'
}

const API_BASE_URL = getBackendUrl()

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }>}) {
  const { id } = await params
  const sessionCookie = request.cookies.get('yems_session')?.value
  
  try {
    const axios = require('axios')
    const response = await axios.default.post(`${API_BASE_URL}/api/exams/submissions/${id}/submit`, {}, {
      headers: {
        'Cookie': sessionCookie ? `yems_session=${sessionCookie}` : '',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    })
    return NextResponse.json(response.data, { status: response.status })
  } catch (error: any) {
    const axios = require('axios')
    if (axios.default.isAxiosError(error) && error.response) {
      return NextResponse.json(error.response.data, { status: error.response.status })
    }
    return NextResponse.json({ message: 'Failed to submit exam', error: error.message }, { status: 500 })
  }
}