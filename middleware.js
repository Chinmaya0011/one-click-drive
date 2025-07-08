import { NextResponse } from 'next/server'
import { getSession } from './lib/auth'

export async function middleware(request) {
  const session = await getSession(request)
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Auth routes redirect if logged in
  if (pathname.startsWith('/login') && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
}