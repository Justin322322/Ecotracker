import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/dashboard')) {
    const session = request.cookies.get('session');
    if (!session || !session.value) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next({
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export const config = {
  matcher: ['/dashboard/:path*'],
};


