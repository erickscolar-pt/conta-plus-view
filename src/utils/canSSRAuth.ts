import { jwtDecode } from 'jwt-decode';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { clearAuthCookie, parseRequestCookies } from './cookies';

export function canSSRAuth<P extends { [key: string]: any } = { [key: string]: any }>(
  fn: (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>,
): GetServerSideProps<P> {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseRequestCookies(ctx);
    const token = cookies['@nextauth.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    try {
      const decodedToken: { exp: number } = jwtDecode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < currentTime) {
        console.error('Token expirado, redirecionando para login');
        clearAuthCookie(ctx);
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }

      return await fn(ctx);
    } catch (error) {
      console.error('Erro ao validar token, redirecionando para login:', error);
      clearAuthCookie(ctx);
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  };
}
