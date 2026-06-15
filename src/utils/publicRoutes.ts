/** Rotas acessíveis sem autenticação (landing, cadastro, docs legais, etc.) */
export const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/tecnologiasderastreamento',
  '/politicadeprivacidade',
  '/politicadecookies',
  '/termosdeuso',
  '/manual',
  '/codigo',
  '/verificar-email',
  '/esqueci-senha',
  '/redefinir-senha',
  '/importreport',
  '/instalar-app',
] as const;

export function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  return PUBLIC_ROUTES.some(
    (route) => route !== '/' && (pathname === route || pathname.startsWith(`${route}/`)),
  );
}
