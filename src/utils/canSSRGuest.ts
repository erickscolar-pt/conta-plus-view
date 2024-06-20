import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';
import { api } from '@/services/apiCliente';

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const token = cookies['@nextauth.token'];

        if (token) {
            try {
                return {
                    redirect: {
                        destination: '/ganhos',
                        permanent: false,
                    }
                };
            } catch (err) {
                if (err instanceof AuthTokenError) {
                    destroyCookie(ctx, '@nextauth.token');
                    return await fn(ctx);
                }
            }
        }

        return await fn(ctx);
    };
}
