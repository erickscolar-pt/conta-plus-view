import { jwtDecode } from 'jwt-decode';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { clearAuthCookie, parseRequestCookies } from './cookies';

type JwtPayload = { exp: number; role?: string; sub?: number };

export function canSSRAdmin<P extends Record<string, unknown>>(
  fn: (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>,
): GetServerSideProps<P> {
  return async (ctx) => {
    const cookies = parseRequestCookies(ctx);
    const token = cookies['@nextauth.token'];

    if (!token) {
      return { redirect: { destination: '/admin/login', permanent: false } };
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        clearAuthCookie(ctx);
        return { redirect: { destination: '/admin/login', permanent: false } };
      }
      if (decoded.role !== 'admin') {
        return { redirect: { destination: '/dashboard', permanent: false } };
      }
      return await fn(ctx);
    } catch {
      clearAuthCookie(ctx);
      return { redirect: { destination: '/admin/login', permanent: false } };
    }
  };
}
