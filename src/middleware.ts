// middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export default function middleware(req: NextRequest) {
  const token = req.cookies.get('@nextauth.token');

  // Defina as rotas públicas (que podem ser acessadas sem autenticação)
  const publicRoutes = ['/', '/signup', '/forgotpassword', '/resetpassword']; // Exemplo de rotas públicas

  // Verifica se a rota atual está na lista de rotas públicas
  const isPublicRoute = publicRoutes.some((route) => req.nextUrl.pathname.startsWith(route));

  // Se for uma rota pública, permite o acesso
  console.warn('mdd:',isPublicRoute)
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Verifica a autenticação para as rotas protegidas
  if (!token) {
    if(req.nextUrl.pathname === '/'){
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL('/', req.url)); // Redireciona para a página de login se o token não existe
  }

  return NextResponse.next();
}

// Configuração para aplicar o middleware em todas as rotas
export const config = {
  matcher: ['/','/dashboard/:path*'],
};
