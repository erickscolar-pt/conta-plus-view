import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('@nextauth.token');

  const publicRoutes = ['/signup', '/forgotpassword', '/resetpassword','/tecnologiasderastreamento','/politicadeprivacidade','/politicadecookies','/paymentuser','/payment','/manual','/codigo'];
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  if (!token) {
    console.warn('Token não encontrado, redirecionando para login...');
    return NextResponse.redirect(new URL('/', req.url));
  }

  console.log('Acesso permitido à rota:', req.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/ganhos','/metas','/gastos','/perfil','/paymentauth'],
};
