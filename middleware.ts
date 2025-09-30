import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('session');
    
    // Check if session exists and has a value
    if (!session || !session.value || session.value.trim() === '') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.delete('redirect'); // Remove any redirect params
      return NextResponse.redirect(url);
    }
    
    // Additional validation: check if session is not expired
    try {
      // Basic validation - in a real app, you'd verify the JWT or session token
      const sessionData = JSON.parse(session.value);
      if (!sessionData || !sessionData.id) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    } catch {
      // Invalid session format
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  
  // Protect API routes that require authentication
  if (pathname.startsWith('/api/me') || pathname.startsWith('/api/dashboard')) {
    const session = request.cookies.get('session');
    if (!session || !session.value || session.value.trim() === '') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next({
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/me',
    '/api/dashboard/:path*'
  ],
};


