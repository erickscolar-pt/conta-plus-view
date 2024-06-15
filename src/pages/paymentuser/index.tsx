import React, { FormEvent, useContext, useState, useEffect } from 'react';
import { FaArrowLeft, FaCheck, FaCopy, FaSpinner } from 'react-icons/fa';
import styles from './styles.module.scss';
import { AuthContexts, ResponsePayments } from '@/contexts/AuthContexts';
import { useQRCode } from 'next-qrcode';
import Router, { useRouter } from 'next/router'
import { toast } from 'react-toastify';
import { formatCurrency } from '@/helper';

interface PaymentsProps {
    planos: Data;
    userData: Usuario;
}
interface Data {
    data: Planos[]
}
interface Planos {
    id: number,
    plano: string,
    descricao: string,
    valor: number
}

type Usuario = {
    id: number,
    email: string,
}

export default function PaymentUser() {
    const router = useRouter();
    const { userData, planosData } = router.query;
    const [selectedPlan, setSelectedPlan] = useState<Planos | null>(null);
    const { checkPlan } = useContext(AuthContexts);
    const [loading, setLoading] = useState(false);
    const [payment, setPayment] = useState(false);
    const [paymentData, setPaymentData] = useState<ResponsePayments>();
    const [user, setUserData] = useState<Usuario | null>(null);
    const [planos, setPlanos] = useState<Planos[]>([]);

    const [paymentStatus, setPaymentStatus] = useState('pending');
    const { Image } = useQRCode();
    
    useEffect(() => {
        if (userData && planosData) {
            const parsedUserData = Array.isArray(userData) ? userData[0] : userData;
            const parsedPlanosData = Array.isArray(planosData) ? planosData[0] : planosData;
            setUserData(JSON.parse(parsedUserData));
            setPlanos(JSON.parse(parsedPlanosData).data); // Acesse a propriedade data
        }
    }, [userData, planosData]);


    const handleSub = async (event: FormEvent) => {
        event.preventDefault();
        if(!selectedPlan){
            toast.warn('Selecione um plano');

            return;
        }
        setLoading(true);
        if (selectedPlan && user) {
            const res: any = await checkPlan({
                email: user.email,
                plano_id: selectedPlan.id,
                usuario_id: user.id,
                description: 'Pagamento do Plano ' + selectedPlan.plano
            });

            if (res) {
                setPaymentData(res);
                setLoading(false);
                setPayment(true);
                checkPaymentStatus(res.id);
            }
        }
    };

    const selectPlan = (plan: Planos) => {
        console.log(plan.id);
        setSelectedPlan(plan);
    };

    const checkPaymentStatus = (paymentId: number) => {
        const interval = setInterval(async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/${user.id}/status`);
            console.log(response);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/${user.id}/status`);
                console.log(response);
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

    useEffect(() => {
        if (paymentData && paymentData.id) {
            checkPaymentStatus(paymentData.id);
        }
    }, [paymentData, userData]);

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${paymentData.qr_code}`);
        toast.success('Link copiado!', {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    return (
        <div className={styles.container}>
            {loading ? (
                <div className={styles.contentLoading}>
                    <FaSpinner className={styles.loading} color='#fff' size={40} />
                </div>
            ) : !payment ? (
                <form onSubmit={handleSub}>
                    <div className={styles.formContainer}>
                        <div className={styles.form}>
                            <div className={styles.information}>
                                <h1>Falta só essa etapa</h1>
                                <h2>Selecione um plano para usar o sistema</h2>
                                <div className={styles.plans}>
                                    {planos?.map((plan) => (
                                        <div
                                            key={plan.id}
                                            className={`${styles.planCard} ${selectedPlan === plan ? styles.selected : ''}`}
                                            onClick={() => selectPlan(plan)}
                                        >
                                            <div className={styles.typePlan}>
                                                <h2>{plan.plano}</h2>
                                            </div>
                                            <div className={styles.planInfo}>
                                                <p className={styles.price}>{formatCurrency(plan.valor)}</p>
                                                <p className={styles.info}>{plan.descricao}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.buttonContainer}>
                        <button type='submit'>Finalizar <FaCheck /></button>
                    </div>
                </form>
            ) : (
                <div className={styles.qrCodeContainer}>
                    <Image
                        text={paymentData.qr_code}
                        options={{
                            type: 'image/jpeg',
                            quality: 0.3,
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
                    <p>{selectedPlan.plano}</p>
                    <p>Valor do plano: {formatCurrency(selectedPlan.valor)}</p>
                    <button onClick={handleCopyLink}>
                        <FaCopy /> Copiar Link
                    </button>
                    <p>Status do Pagamento: {paymentStatus === 'pending' ? <span className={styles.pending}>Aguardando pagamento...</span> : paymentStatus === 'approved' ? <span className={styles.approved}>Pagamento aprovado!</span> : <span className={styles.fail}>Pagamento falhou!</span>}</p>
                </div>
            )}
        </div>
    );
}
