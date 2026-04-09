import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const cookieName = process.env.AUTH_COOKIE_NAME || 'abujanda_session';

export function proxy(request: NextRequest) {
  const token = request.cookies.get(cookieName)?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === '/login';
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard && token !== 'logged-in') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthPage && token === 'logged-in') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/dashboard/:path*'],
};
