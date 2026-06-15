import { NextResponse, NextRequest } from 'next/server';
import { isPublicRoute } from '@/utils/publicRoutes';
import { AUTH_COOKIE, decodeAuthToken, isAuthTokenValid } from '@/utils/authToken';

function isAdminHost(host: string | null) {
  if (!host) return false;
  const h = host.split(':')[0].toLowerCase();
  return h === 'admin.contaplus.app.br' || h.startsWith('admin.');
}

function isStaticOrApiPath(pathname: string) {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon') ||
    !!pathname.match(/\.(ico|png|jpg|svg|webp|css|js)$/)
  );
}

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  const adminHost = isAdminHost(host);
  const pathname = req.nextUrl.pathname;

  if (isStaticOrApiPath(pathname)) {
    return NextResponse.next();
  }

  if (adminHost) {
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    if (
      !pathname.startsWith('/admin') &&
      !pathname.startsWith('/verificar-email')
    ) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const signInURL = new URL(adminHost ? '/admin/login' : '/login', req.url);

  if (!isAuthTokenValid(token)) {
    if (isPublicRoute(pathname)) {
      const response = NextResponse.next();
      if (token) {
        response.cookies.set(AUTH_COOKIE, '', { maxAge: 0, path: '/' });
      }
      return response;
    }
    if (adminHost && pathname.startsWith('/admin')) {
      if (pathname === '/admin/login') return NextResponse.next();
      return NextResponse.redirect(signInURL);
    }
    if (!adminHost) {
      return NextResponse.redirect(signInURL);
    }
    return NextResponse.next();
  }

  const decodedToken = decodeAuthToken(token);

  if (adminHost && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (decodedToken?.role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
