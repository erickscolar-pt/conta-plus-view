import { NextResponse, NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('@nextauth.token');
  const signInURL = new URL('/', req.url);

  // Se o token não existir, redirecionar para login
  if (!token) {
    console.warn('Token não encontrado, redirecionando para login... mdl');
    if(req.nextUrl.pathname === '/'){
      return NextResponse.next();
    }
    return NextResponse.redirect(signInURL);
  }

  try {
    // Decodificar e verificar expiração
    const decodedToken: { exp: number } = jwtDecode(token.value);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decodedToken.exp < currentTime) {
      console.log('Token expirado! Redirecionando para login... mdl');
      const response = NextResponse.redirect(new URL('/', req.url));

      // Remove o cookie expirado
      response.cookies.set('@nextauth.token', '', { maxAge: 0 });
      return response;
    }
  } catch (error) {
    console.error('Erro ao decodificar o token, redirecionando para login...', error);
    const response = NextResponse.redirect(new URL('/', req.url));
    response.cookies.set('@nextauth.token', '', { maxAge: 0 });
    return response;
  }

  // Verificar se a rota é pública
  const publicRoutes = [
    '/',
    '/signup',
    '/forgotpassword',
    '/resetpassword',
    '/tecnologiasderastreamento',
    '/politicadeprivacidade',
    '/politicadecookies',
    '/paymentuser',
    '/payment',
    '/manual',
    '/codigo',
  ];
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  console.log('Acesso permitido à rota:', req.nextUrl.pathname);
  return NextResponse.next();
}

// Configuração de rotas
export const config = {
  matcher: ['/','/dashboard/:path*', '/ganhos', '/metas', '/gastos', '/perfil', '/paymentauth', '/'], // Rotas protegidas e públicas
};
