import Header from "@/component/header";
import MenuLateral from "@/component/menulateral";
import { setupAPIClient } from "@/services/api";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Title } from "@/component/ui/title";
import { FormEvent, useContext, useState } from "react";
import {
  AuthContexts,
  ResponsePayments,
  SelectedPlanType,
} from "@/contexts/AuthContexts";
import { FaCheck, FaCopy, FaSpinner } from "react-icons/fa";
import { toast } from "react-toastify";
import { formatCurrency } from "@/helper";
import { useQRCode } from "next-qrcode";
import Head from "next/head";
import { Usuario } from "@/model/type";

interface PaymentAuthProps {
  planos: Planos[];
  usuario: Usuario;
}
interface Planos {
  id: number;
  plano: string;
  descricao: string;
  valor: number;
  duration: number;
  is_free: boolean;
}
export default function PaymentAuth({ planos, usuario }: PaymentAuthProps) {
  const [selectedPlan, setSelectedPlan] = useState<Planos | null>(null);
  const { checkPlan } = useContext(AuthContexts);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<ResponsePayments>();
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const { Image } = useQRCode();

  const handleSub = async (event: FormEvent) => {
    event.preventDefault();
    if (!selectedPlan) {
      toast.warn("Selecione um plano");
      return;
    }
    setLoading(true);
    if (selectedPlan && usuario) {
      const planType: SelectedPlanType = {
        email: usuario.email,
        plano_id: selectedPlan.id,
        usuario_id: usuario.id,
        description: "Pagamento do Plano " + selectedPlan.plano,
      };
      const apiClient = setupAPIClient();

      const res = await apiClient.post("/payments/auth", planType);
      toast.success("Realizar pagamento!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      if (res) {
        setPaymentData(res.data);
        setLoading(false);
        setPayment(true);
        checkPaymentStatus(res.data.id);
      }
    }
  };

  const checkPaymentStatus = (paymentId: number) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/${paymentId}/${usuario.id}/status`
        );
        const data = await response.json();

        if (data.status === "approved") {
          setPaymentStatus("approved");
          clearInterval(interval);
        } else if (data.status !== "pending") {
          setPaymentStatus("failed");
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Erro ao verificar o status do pagamento", error);
      }
    }, 5000); // Verifica a cada 5 segundos
  };

  const selectPlan = (plan: Planos) => {
    setSelectedPlan(plan);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${paymentData.qr_code}`);
    toast.success("Link copiado!", {
      position: toast.POSITION.TOP_RIGHT,
    });
  };

  return (
    <>
      <Head>
        <title>Conta Plus - Pagamento</title>
      </Head>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <MenuLateral />
        <div className="flex-1 flex flex-col md:ml-20 pb-16">
          <Header usuario={usuario} />
          <main className="flex-1 p-2 sm:p-4 md:p-8 flex flex-col items-center">
            <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-8 mt-4 flex flex-col items-center">
              {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                  <FaSpinner className="animate-spin text-4xl text-gray-700" />
                </div>
              ) : !payment ? (
                <form
                  className="w-full grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
                  onSubmit={handleSub}
                >
                  {planos?.map(
                    (plan) =>
                      !plan.is_free && (
                        <div
                          key={plan.id}
                          className={`p-6 border rounded-xl cursor-pointer transition duration-300 flex flex-col items-start bg-gray-50 ${
                            selectedPlan === plan
                              ? "border-emerald-500 shadow-lg ring-2 ring-emerald-200"
                              : "border-gray-200 hover:border-emerald-400 hover:shadow-md"
                          }`}
                          onClick={() => selectPlan(plan)}
                        >
                          <h5 className="text-xl font-semibold text-gray-900 mb-2">
                            {plan.plano}
                          </h5>
                          <p className="text-sm text-gray-500 mb-4">
                            {plan.descricao}
                          </p>
                          <div className="flex items-end gap-1">
                            <span className="text-3xl font-bold text-emerald-600">
                              {formatCurrency(plan.valor)}
                            </span>
                            <span className="text-base text-gray-500 mb-1">
                              /{plan.duration === 30
                                ? "mês"
                                : plan.duration === 365
                                ? "ano"
                                : plan.duration === 180
                                ? "semestre"
                                : "período"}
                            </span>
                          </div>
                        </div>
                      )
                  )}
                  <div className="flex items-end mt-4 md:mt-0">
                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg shadow-md transition flex items-center space-x-2 w-full"
                    >
                      <FaCheck />
                      <span>Finalizar</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center w-full py-8">
                  {paymentStatus === "approved" ? (
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-emerald-600 text-2xl font-bold">
                        Pagamento aprovado!
                      </span>
                      <FaCheck className="text-emerald-600 text-4xl" />
                    </div>
                  ) : (
                    <>
                      <div className="bg-white rounded-xl p-6 flex flex-col items-center shadow-md mb-4">
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
                        <button
                          className="flex items-center gap-2 mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg shadow transition"
                          onClick={handleCopyLink}
                        >
                          <FaCopy />
                          Copiar Link
                        </button>
                      </div>
                      <div className="text-center mb-2">
                        <h1 className="text-lg font-bold text-gray-800">
                          Plano escolhido
                        </h1>
                        <p className="text-gray-700">{selectedPlan.plano}</p>
                        <p className="text-emerald-600 font-bold text-xl">
                          {formatCurrency(selectedPlan.valor)}
                        </p>
                      </div>
                      <p className="mt-2">
                        Status do Pagamento:{" "}
                        {paymentStatus === "pending" ? (
                          <span className="text-yellow-500 font-semibold">
                            Aguardando pagamento...
                          </span>
                        ) : paymentStatus === "approved" ? (
                          <span className="text-emerald-600 font-semibold">
                            Pagamento aprovado!
                          </span>
                        ) : (
                          <span className="text-red-500 font-semibold">
                            Pagamento falhou!
                          </span>
                        )}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  try {
    const planos = await apiClient.get("/payments/planos");
    const user = await apiClient.get("/user/get");

    return {
      props: {
        planos: planos.data.data,
        usuario: user.data,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar usuario:", error.message);
    return {
      props: {
        planos: [],
        usuario: [],
      },
    };
  }
});