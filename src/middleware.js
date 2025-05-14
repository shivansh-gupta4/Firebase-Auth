import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get('authToken')?.value;

 
  const isProtectedRoute = path.startsWith('/auth-success');
  const isAuthRoute = path === '/auth';

  
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/auth-success', request.url));
  }

 
  if (isProtectedRoute && !token) {
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