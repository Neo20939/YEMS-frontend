import { NextRequest, NextResponse } from 'next/server'

const getBackendUrl = () => {
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')
  }
  return process.env.NEXT_PUBLIC_API_LOCAL_URL || 'http://localhost/shdhfh@s/api'
}

const API_BASE_URL = getBackendUrl()
const backendClient = (() => {
  if (typeof window === 'undefined') {
    return null
  }
  const axios = require('axios')
  return axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  })
})()

export async function POST(request: NextRequest) {
  const contentType = request.headers.get('content-type') || ''
  
  let body
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { message: 'Invalid request content type', code: 'INVALID_CONTENT_TYPE' },
      { status: 415 }
    )
  }
  
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { message: 'Invalid JSON body', code: 'INVALID_JSON' },
      { status: 400 }
    )
  }
  
  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { message: 'Email and password are required', code: 'MISSING_CREDENTIALS' },
      { status: 400 }
    )
  }

  try {
    const axios = require('axios')
    const response = await axios.default.post(`${API_BASE_URL}/api/auth/login`, body, {
      withCredentials: true,
    })

    const nextResponse = NextResponse.json(response.data)

    const setCookieHeader = response.headers['set-cookie']
    if (setCookieHeader) {
      const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader]
      cookies.forEach(cookie => {
        if (cookie.includes('yems_session')) {
          nextResponse.headers.append('set-cookie', cookie)
          const cookieParts = cookie.split(';')
          const cookieValue = cookieParts[0]
          nextResponse.headers.append('set-cookie', `${cookieValue}; Path=/; SameSite=Lax`)
        }
      })
    }

    return nextResponse
  } catch (error: any) {
    const axios = require('axios')
    if (axios.default.isAxiosError(error)) {
      const errCode = error.code
      if (errCode === 'ECONNABORTED' || error.message?.includes('timeout')) {
        return NextResponse.json(
          { message: 'Request timed out. Please check your internet connection.', code: 'TIMEOUT' },
          { status: 504 }
        )
      }
      if (errCode === 'ERR_NETWORK' || !error.response) {
        return NextResponse.json(
          { message: 'Unable to connect to the server.', code: 'ERR_NETWORK' },
          { status: 503 }
        )
      }
      if (error.response?.status === 401) {
        return NextResponse.json(
          { message: 'Invalid email or password.', code: 'INVALID_CREDENTIALS' },
          { status: 401 }
        )
      }
      if (error.response?.status === 404) {
        return NextResponse.json(
          { message: 'User not found.', code: 'USER_NOT_FOUND' },
          { status: 404 }
        )
      }
      if (error.response?.status === 403) {
        return NextResponse.json(
          { message: 'Account disabled.', code: 'ACCOUNT_DISABLED' },
          { status: 403 }
        )
      }
      return NextResponse.json(
        error.response?.data || { message: 'Login failed.', code: 'LOGIN_FAILED' },
        { status: error.response?.status || 500 }
      )
    }

    return NextResponse.json(
      { message: 'An unexpected error occurred.', code: 'UNKNOWN_ERROR' },
      { status: 500 }
    )
  }
}