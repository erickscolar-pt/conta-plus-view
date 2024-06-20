import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies, destroyCookie } from 'nookies';
import { AuthTokenError } from '../services/errors/AuthTokenError';

export function canSSRAuth<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const token = cookies['@nextauth.token'];

        if (!token) {
            console.log("No token found, redirecting to login");
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            };
        }

        try {
            return await fn(ctx);
        } catch (err) {
            if (err instanceof AuthTokenError) {
                console.log("AuthTokenError, destroying token and redirecting to login");
                destroyCookie(ctx, '@nextauth.token');
                return {
                    redirect: {
                        destination: '/',
                        permanent: false,
                    }
                };
            }

            console.log("Unexpected error, redirecting to login:", err);
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            };
        }
    };
}
