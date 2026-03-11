import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import path from 'path';

const PROTECTED_ROUTES = ['/', '/user', '/settings', '/user/form', '/change-password', '/city', '/listing'];
const PUBLIC_ONLY_ROUTES = ['/login']; // routes to avoid if already logged in

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  const isProtected = PROTECTED_ROUTES.some((route) => {
    if (route === '/') return pathname === '/';
    return pathname.startsWith(route);
  });

  const isPublicOnly = PUBLIC_ONLY_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    if(pathname){
      loginUrl.searchParams.set('redirect', pathname);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register
  if (isPublicOnly && token) {
    // Check if a 'redirect' param exists in the URL
    const redirectUrl = request.nextUrl.searchParams.get('redirect');
    
    // Use the redirect path if it exists, otherwise default to '/'
    const destination = redirectUrl || '/';
    
    const destinationUrl = new URL(destination, request.url);
    return NextResponse.redirect(destinationUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/user/:path*',
    '/settings/:path*',
    '/login',
    '/change-password',
    '/city/:path*',
    '/listing/:path*'
  ],
};
