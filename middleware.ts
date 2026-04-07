import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that don't require authentication
const publicRoutes = [
  '/login',
  '/api',
  '/status',
  '/_next',
  '/favicon.ico',
]

// Routes that should redirect to login if not authenticated
const protectedRoutes = [
  '/dashboard',
  '/admin',
  '/teachers',
  '/technician',
  '/students',
  '/finance',
  '/academic',
  '/notes',
  '/exams',
  '/class-teachers',
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Get auth token from cookies or localStorage (via cookie)
  const authToken = request.cookies.get('auth_token')?.value || 
                    request.cookies.get('session')?.value
  
  // Get stored user data (if using cookie-based storage)
  const storedUser = request.cookies.get('auth_user')?.value
  
  // Get yems_session cookie for backend auth
  const yemsSession = request.cookies.get('yems_session')?.value
  
  // If it's a protected route and user is not authenticated, redirect to login
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!authToken && !storedUser) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }
  
  // If user is authenticated and tries to access login, redirect to dashboard
  if (pathname.startsWith('/login') && (authToken || storedUser)) {
    const user = storedUser ? JSON.parse(storedUser) : null
    const role = user?.role?.toLowerCase() || 'student'
    
    let redirectPath = '/dashboard'
    
    if (role === 'admin' || role === 'administrator' || role === 'platform_admin') {
      redirectPath = '/admin'
    } else if (role === 'class_teacher' || role === 'form_teacher') {
      redirectPath = '/class-teachers'
    } else if (role === 'teacher' || role === 'professor' || role === 'instructor' || role === 'subject_teacher') {
      redirectPath = '/teachers/dashboard'
    } else if (role === 'technician') {
      redirectPath = '/technician/dashboard'
    }
    
    return NextResponse.redirect(new URL(redirectPath, request.url))
  }
  
  // For API routes that need yems_session, create a response with the cookie forwarded
  if (pathname.startsWith('/api/admin') && yemsSession) {
    const response = NextResponse.next()
    // Ensure yems_session cookie is included in API requests
    response.cookies.set('yems_session', yemsSession, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    })
    return response
  }
  
  return NextResponse.next()
}

// Configure which routes should run the middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
}