import { NextResponse, NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

function isAdminHost(host: string | null) {
  if (!host) return false;
  const h = host.split(':')[0].toLowerCase();
  return h === 'admin.contaplus.app.br' || h.startsWith('admin.');
}

export function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  const adminHost = isAdminHost(host);
  const pathname = req.nextUrl.pathname;

  if (adminHost) {
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/favicon') ||
      pathname.match(/\.(ico|png|jpg|svg|webp|css|js)$/)
    ) {
      return NextResponse.next();
    }

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

  const token = req.cookies.get('@nextauth.token');
  const signInURL = new URL(adminHost ? '/admin/login' : '/login', req.url);

  if (!token) {
    if (pathname === '/login' || pathname === '/admin/login') {
      return NextResponse.next();
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

  try {
    const decodedToken: { exp: number; role?: string } = jwtDecode(token.value);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      const response = NextResponse.redirect(signInURL);
      response.cookies.set('@nextauth.token', '', { maxAge: 0, path: '/' });
      return response;
    }

    if (adminHost && pathname.startsWith('/admin') && pathname !== '/admin/login') {
      if (decodedToken.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }
    }
  } catch {
    const response = NextResponse.redirect(signInURL);
    response.cookies.set('@nextauth.token', '', { maxAge: 0, path: '/' });
    return response;
  }

  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/tecnologiasderastreamento',
    '/politicadeprivacidade',
    '/politicadecookies',
    '/manual',
    '/codigo',
    '/verificar-email',
    '/admin/login',
  ];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
