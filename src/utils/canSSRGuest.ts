import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { clearAuthCookie, parseRequestCookies } from './cookies';
import { AUTH_COOKIE, isAuthTokenValid } from './authToken';

export function canSSRGuest<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  fn: (ctx: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>,
): GetServerSideProps<P> {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseRequestCookies(ctx);
    const token = cookies[AUTH_COOKIE];

    if (isAuthTokenValid(token)) {
      return {
        redirect: {
          destination: '/movimentacoes',
          permanent: false,
        },
      };
    }

    if (token) {
      clearAuthCookie(ctx);
    }

    return await fn(ctx);
  };
}
