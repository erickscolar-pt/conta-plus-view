import { jwtDecode } from 'jwt-decode';
import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCookie } from 'nookies';

export function canSSRAuth<P>(fn: GetServerSideProps<P>) {
  return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
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
        destroyCookie(ctx, '@nextauth.token'); // Remove o token
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
      destroyCookie(ctx, '@nextauth.token');
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  };
}
