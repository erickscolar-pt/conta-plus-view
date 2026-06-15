import { NextResponse, NextRequest } from 'next/server';
import { isPublicRoute } from '@/utils/publicRoutes';
import { AUTH_COOKIE, isAuthTokenValid } from '@/utils/authToken';

function isStaticOrApiPath(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/sw.js' ||
    !!pathname.match(/\.(ico|png|jpg|svg|webp|css|js|webmanifest)$/)
  );
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (isStaticOrApiPath(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const signInURL = new URL('/login', req.url);

  if (!isAuthTokenValid(token)) {
    if (isPublicRoute(pathname)) {
      const response = NextResponse.next();
      if (token) {
        response.cookies.set(AUTH_COOKIE, '', { maxAge: 0, path: '/' });
      }
      return response;
    }
    return NextResponse.redirect(signInURL);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
