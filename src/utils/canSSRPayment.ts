import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { parseCookies } from 'nookies';
import { api } from '@/services/apiCliente';

export function canSSRPayment<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);
        const token = cookies['@nextauth.token'];

        if (!token) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            };
        }

        try {
            const data = await api.get('/auth/check-payment', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!data.data.isPaymentDone) {
                return {
                    redirect: {
                        destination: '/payment',
                        permanent: false,
                    }
                };
            }
            return await fn(ctx);
        } catch (err) {
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            };
        }
    };
}
