import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { AuthTokenError } from '../services/errors/AuthTokenError';
import { api } from '@/services/apiCliente';
import { clearAuthCookie, parseRequestCookies } from './cookies';

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseRequestCookies(ctx);
        const token = cookies['@nextauth.token'];

        if (token) {
            try {
                return {
                    redirect: {
                        destination: '/movimentacoes',
                        permanent: false,
                    }
                };
            } catch (err) {
                if (err instanceof AuthTokenError) {
                    clearAuthCookie(ctx);
                    return await fn(ctx);
                }
            }
        }

        return await fn(ctx);
    };
}
