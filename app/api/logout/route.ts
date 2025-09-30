import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Create response with success message
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    // Clear session cookie with multiple attempts to ensure it's cleared
    const cookieOptions = {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };

    // Clear session cookie
    response.cookies.set('session', '', cookieOptions);
    
    // Also try to delete the cookie by setting it to empty with past date
    response.cookies.delete('session');

    // Clear any other auth-related cookies
    response.cookies.set('auth-token', '', cookieOptions);
    response.cookies.delete('auth-token');

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}
