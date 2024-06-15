import Head from 'next/head';
import styles from './styles.module.scss';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { setupAPIClient } from '@/services/api';
import { AuthContexts } from '@/contexts/AuthContexts';
import Router, { useRouter } from 'next/router';
import { useQRCode } from 'next-qrcode';
import { FaCopy, FaSpinner } from 'react-icons/fa';
import { formatCurrency } from '@/helper';

interface PaymentProps {
    payment: Payment;
}

interface Payment {
    qr_code: string;
    plano: string;
    valor: string;
    status: string;
    payment_id: number;
    user_id: number;
}

export default function Payment() {
    const router = useRouter();
    const { paymentData } = router.query;
    const [payment, setPayment] = useState<Payment | null>(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const { Image } = useQRCode();
    console.log(payment)
    useEffect(() => {
        if (paymentData) {
            const parsedPaymentData = Array.isArray(paymentData) ? paymentData[0] : paymentData;
            setPayment(JSON.parse(parsedPaymentData));
        }
    }, [paymentData]);

    useEffect(() => {
        if (payment && payment.payment_id) {
            checkPaymentStatus(payment.payment_id);
        }
    }, [payment]);

    const checkPaymentStatus = (paymentId: number) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/${payment.user_id}/status`);
                const data = await response.json();

                if (data.status === 'approved') {
                    setPaymentStatus('approved');
                    clearInterval(interval);
                    Router.push('/');
                } else if (data.status !== 'pending') {
                    setPaymentStatus('failed');
                    clearInterval(interval);
                }
            } catch (error) {
                console.error('Erro ao verificar o status do pagamento', error);
            }
        }, 5000); // Verifica a cada 5 segundos
    };

    const handleCopyLink = () => {
        if (payment) {
            navigator.clipboard.writeText(`${payment.qr_code}`);
            toast.success('Link copiado!', {
                position: toast.POSITION.TOP_RIGHT,
            });
        }
    };

    return (
        <>
            <Head>
                <title>Conta Plus - Pagamento</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.qrCodeContainer}>
                    {payment ? (
                        <>
                            <Image
                                text={payment.qr_code}
                                options={{
                                    type: 'image/jpeg',
                                    quality: 0.3, // Ajuste a qualidade para reduzir o tamanho do QR Code
                                    errorCorrectionLevel: 'M',
                                    margin: 3,
                                    scale: 4,
                                    width: 200,
                                    color: {
                                        dark: '#000',
                                        light: '#FFF',
                                    },
                                }}
                            />
                            <h1>Plano escolhido</h1>
                            <p>{payment.plano}</p>
                            <p>{formatCurrency(+payment.valor)}</p>
                            <button onClick={handleCopyLink}>
                                <FaCopy /> Copiar Link
                            </button>
                            <p>Status do Pagamento: {paymentStatus === 'pending' ? <span className={styles.pending}>Aguardando pagamento...</span> : paymentStatus === 'approved' ? <span className={styles.approved}>Pagamento aprovado!</span> : <span className={styles.fail}>Pagamento falhou!</span>}</p>
                        </>
                    ) : (
                        <>
                            <div className={styles.contentLoading}>
                                <FaSpinner className={styles.loading} color='#fff' size={40} />
                            </div>
                        </>
                    )

                    }
                </div>
            </div>

        </>
    );
}
