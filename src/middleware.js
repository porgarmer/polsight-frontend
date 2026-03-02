// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access')?.value;
  const refreshToken = request.cookies.get('refresh')?.value;

  // Define protected routes
  const protectedPaths = ['/voter-trends', '/candidate-performance', '/candidate-comparison', "/data-sources"];
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));

  // Define public auth routes
  const publicAuthPaths = ['/login', '/register'];
  const isAuthRoute = publicAuthPaths.some((path) => pathname.startsWith(path));

  // 1. If accessing protected route WITHOUT cookies -> Redirect to login
  if (isProtectedRoute && !accessToken && !refreshToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If accessing login page WITH cookies -> Redirect to dashboard
  if (isAuthRoute && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL('/voter-trends', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};