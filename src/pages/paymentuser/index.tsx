import React, { FormEvent, useContext, useState, useEffect } from "react";
import { FaArrowLeft, FaCheck, FaCopy, FaSpinner } from "react-icons/fa";
import styles from "./styles.module.scss";
import { AuthContexts, ResponsePayments } from "@/contexts/AuthContexts";
import { useQRCode } from "next-qrcode";
import Router, { useRouter } from "next/router";
import { toast } from "react-toastify";
import { formatCurrency } from "@/helper";
import Head from "next/head";

interface PaymentsProps {
  planos: Data;
  userData: Usuario;
}
interface Data {
  data: Planos[];
}
interface Planos {
  id: number;
  plano: string;
  descricao: string;
  valor: number;
}

type Usuario = {
  id: number;
  email: string;
};

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

  const [paymentStatus, setPaymentStatus] = useState("pending");
  const { Image } = useQRCode();

  useEffect(() => {
    if (userData && planosData) {
      const parsedUserData = Array.isArray(userData) ? userData[0] : userData;
      const parsedPlanosData = Array.isArray(planosData)
        ? planosData[0]
        : planosData;
      setUserData(JSON.parse(parsedUserData));
      setPlanos(JSON.parse(parsedPlanosData).data); // Acesse a propriedade data
    }
  }, [userData, planosData]);

  const handleSub = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedPlan) {
      toast.warn("Selecione um plano");

      return;
    }
    setLoading(true);
    if (selectedPlan && user) {
      const res: any = await checkPlan({
        email: user.email,
        plano_id: selectedPlan.id,
        usuario_id: user.id,
        description: "Pagamento do Plano " + selectedPlan.plano,
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
    setSelectedPlan(plan);
  };

  const checkPaymentStatus = (paymentId: number) => {
    const interval = setInterval(async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/${user.id}/status`
      );
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/${user.id}/status`
        );
        const data = await response.json();

        if (data.status === "approved") {
          setPaymentStatus("approved");
          clearInterval(interval);
          Router.push("/");
        } else if (data.status !== "pending") {
          setPaymentStatus("failed");
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Erro ao verificar o status do pagamento", error);
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
    toast.success("Link copiado!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <Head>
        <title>Conta Plus - Pagamento</title>
      </Head>
      {loading ? (
        <div className="flex items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-gray-700" />
        </div>
      ) : !payment ? (
        <div className="mt-24">
          <form
            className="m-4 flex justify-center flex-col gap-8 pb-4 md:grid-cols-2 lg:grid-cols-3"
            onSubmit={handleSub}
          >
            {planos?.map((plan) => (
              <div
                key={plan.id}
                className={`p-4 border rounded-md cursor-pointer transition duration-300 ${
                  selectedPlan === plan
                    ? "border-blue-500 shadow-md"
                    : "border-gray-300 hover:border-blue-500 hover:shadow-md"
                }`}
                onClick={() => selectPlan(plan)}
              >
                <div className="relative bg-clip-border mt-4 mx-4 rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none !m-0 p-6">
                  <h5 className="block antialiased tracking-normal font-sans text-xl font-semibold leading-snug text-blue-gray-900 capitalize">
                    {plan.plano}
                  </h5>
                  <p className="block antialiased font-sans text-sm leading-normal text-inherit font-normal !text-gray-500">
                    {plan.descricao}
                  </p>
                  <h3 className="antialiased tracking-normal font-sans text-3xl font-semibold leading-snug text-blue-gray-900 flex gap-1 mt-4">
                    {formatCurrency(plan.valor)}
                    <span className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 -translate-y-0.5 self-end opacity-70"></span>
                  </h3>
                </div>
              </div>
            ))}
            <div className="mt-6">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Finalizar <FaCheck className="inline-block ml-1" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.qrCodeContainer}>
          <Image
            text={paymentData.qr_code}
            options={{
              type: "image/jpeg",
              quality: 0.3,
              errorCorrectionLevel: "M",
              margin: 3,
              scale: 4,
              width: 200,
              color: {
                dark: "#000",
                light: "#FFF",
              },
            }}
          />
          <h1>Plano escolhido</h1>
          <p>{selectedPlan.plano}</p>
          <p>{formatCurrency(selectedPlan.valor)}</p>
          <button onClick={handleCopyLink}>
            <FaCopy /> Copiar Link
          </button>
          <p>
            Status do Pagamento:{" "}
            {paymentStatus === "pending" ? (
              <span className={styles.pending}>Aguardando pagamento...</span>
            ) : paymentStatus === "approved" ? (
              <span className={styles.approved}>Pagamento aprovado!</span>
            ) : (
              <span className={styles.fail}>Pagamento falhou!</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
}
