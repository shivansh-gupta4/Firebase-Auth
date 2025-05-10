import { NextResponse } from 'next/server';

export function middleware(request) {
  
  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/auth';

  const token = request.cookies.get('authToken')?.value;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/auth-success', request.url));
  }

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/auth-success/:path*',
    '/auth',
  ]
}; 