import { NextRequest, NextResponse } from 'next/server'

const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')
  }
  return process.env.NEXT_PUBLIC_API_LOCAL_URL || 'http://localhost/shdhfh@s/api'
}

const API_BASE_URL = getBackendUrl()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionCookie = request.cookies.get('yems_session')?.value
  const queryString = searchParams.toString()
  const url = `${API_BASE_URL}/api/exams${queryString ? `?${queryString}` : ''}`
  
  try {
    const axios = require('axios')
    const response = await axios.default.get(url, {
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
    return NextResponse.json({ message: 'Failed to fetch exams', error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const sessionCookie = request.cookies.get('yems_session')?.value
  const body = await request.json()
  
  try {
    const axios = require('axios')
    const response = await axios.default.post(`${API_BASE_URL}/api/exams`, body, {
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
    return NextResponse.json({ message: 'Failed to create exam', error: error.message }, { status: 500 })
  }
}