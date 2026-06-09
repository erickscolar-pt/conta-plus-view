import Head from "next/head";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { Usuario } from "@/model/type";
import {
  createPlanPixPayment,
  fetchBillingPlans,
  fetchMySubscription,
  getPixPaymentStatus,
  listBillingPayments,
  type BillingPlan,
  type PixPayment,
  type UserSubscription,
} from "@/services/billing";
import { getErrorMessage } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  FaPix,
  FaCopy,
  FaRotateRight,
  FaWandMagicSparkles,
  FaCheck,
} from "react-icons/fa6";

type Props = { usuario: Usuario };

function formatBrl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function isPending(status?: string | null) {
  return String(status || "").toLowerCase() === "pending";
}

function isApproved(status?: string | null) {
  return String(status || "").toLowerCase() === "approved";
}

function planFeatures(plan: BillingPlan): string[] {
  if (plan.code === "AI_PREMIUM") {
    return [
      "Análises financeiras ilimitadas",
      "Chat com coach IA ilimitado",
      "Score, projeções e plano de dívidas",
      "Notificações inteligentes (em breve)",
    ];
  }
  return [
    `${plan.monthly_analysis_limit ?? 5} análises por mês`,
    `${plan.monthly_chat_limit ?? 10} mensagens de chat por mês`,
    "Score e diagnóstico básico",
    "Sem cartão — plano gratuito automático",
  ];
}

export default function PlanosPage({ usuario }: Props) {
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);
  const [payment, setPayment] = useState<PixPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [polling, setPolling] = useState(false);

  const currentPlanCode = subscription?.plan?.code ?? "FREE";
  const isPremium = currentPlanCode === "AI_PREMIUM";

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => a.price_cents - b.price_cents),
    [plans],
  );

  const selectedPlan = useMemo(
    () => sortedPlans.find((p) => p.code === selectedPlanCode) ?? null,
    [sortedPlans, selectedPlanCode],
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [planList, sub, history] = await Promise.all([
        fetchBillingPlans(),
        fetchMySubscription(),
        listBillingPayments(10).catch(() => [] as PixPayment[]),
      ]);
      setPlans(planList);
      setSubscription(sub);
      const pending = history.find((p) => isPending(p.status));
      setPayment(pending ?? null);
      if (pending?.plan?.code) {
        setSelectedPlanCode(pending.plan.code);
      }
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) || "Erro ao carregar planos.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleCreatePix(planCode: string) {
    setSelectedPlanCode(planCode);
    setCreating(true);
    try {
      const pix = await createPlanPixPayment(planCode, {
        payerEmail: usuario.email,
        payerName: usuario.nome,
      });
      setPayment(pix);
      if (isApproved(pix.status)) {
        toast.success("Pagamento aprovado! Plano ativado.");
        await loadData();
      } else {
        toast.info("PIX gerado. Escaneie ou copie o código para pagar.");
      }
    } catch (error) {
      toast.error(getErrorMessage((error as AxiosError).response?.data) || "Erro ao gerar PIX.");
    } finally {
      setCreating(false);
    }
  }

  async function handleRefreshStatus() {
    if (!payment?.id) return;
    setPolling(true);
    try {
      const updated = await getPixPaymentStatus(payment.id);
      setPayment(updated);
      if (isApproved(updated.status)) {
        toast.success("Pagamento confirmado! Plano ativado.");
        await loadData();
      } else {
        toast.info("Pagamento ainda pendente.");
      }
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) || "Erro ao consultar pagamento.",
      );
    } finally {
      setPolling(false);
    }
  }

  async function copyPixCode() {
    if (!payment?.qrCode) return;
    try {
      await navigator.clipboard.writeText(payment.qrCode);
      toast.success("Código PIX copiado.");
    } catch {
      toast.error("Não foi possível copiar o código.");
    }
  }

  useEffect(() => {
    if (!payment?.id || !isPending(payment.status)) return;
    const timer = setInterval(() => {
      void getPixPaymentStatus(payment.id)
        .then((updated) => {
          setPayment(updated);
          if (isApproved(updated.status)) {
            toast.success("Pagamento confirmado! Plano ativado.");
            void loadData();
          }
        })
        .catch(() => undefined);
    }, 12000);
    return () => clearInterval(timer);
  }, [payment?.id, payment?.status, loadData]);

  return (
    <>
      <Head>
        <title>Planos | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-3 py-6 sm:px-6 md:px-10 md:py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-400">
                <FaWandMagicSparkles />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Planos Conta+ AI
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
                Escolha seu plano
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Compare os planos e assine o Premium via PIX quando quiser mais análises com IA.
              </p>
              {!loading && (
                <p className="mt-2 text-sm text-slate-500">
                  Plano atual:{" "}
                  <span className="font-medium text-emerald-300">
                    {subscription?.plan?.name ?? "Conta+ Free"}
                  </span>
                  {subscription?.end_date && isPremium && (
                    <>
                      {" "}
                      · válido até{" "}
                      {new Date(subscription.end_date).toLocaleDateString("pt-BR")}
                    </>
                  )}
                </p>
              )}
            </div>

            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
                Carregando planos...
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  {sortedPlans.map((plan) => {
                    const isCurrent = plan.code === currentPlanCode;
                    const isPaid = plan.price_cents > 0;
                    const isSelected = selectedPlanCode === plan.code;
                    const highlighted = plan.code === "AI_PREMIUM";

                    return (
                      <div
                        key={plan.code}
                        className={`relative flex flex-col rounded-2xl border p-6 backdrop-blur-xl transition ${
                          highlighted
                            ? "border-emerald-500/40 bg-gradient-to-br from-emerald-500/10 to-cyan-500/5"
                            : "border-white/10 bg-white/5"
                        } ${isSelected ? "ring-2 ring-emerald-400/50" : ""}`}
                      >
                        {highlighted && (
                          <span className="absolute -top-3 left-4 rounded-full bg-emerald-600 px-3 py-0.5 text-xs font-medium text-white">
                            Recomendado
                          </span>
                        )}
                        {isCurrent && (
                          <span className="absolute -top-3 right-4 rounded-full border border-white/20 bg-slate-800 px-3 py-0.5 text-xs text-slate-200">
                            Seu plano
                          </span>
                        )}

                        <h2 className="text-lg font-semibold text-white">{plan.name}</h2>
                        <p className="mt-2 text-3xl font-bold text-emerald-400">
                          {plan.price_cents === 0 ? "Grátis" : formatBrl(plan.price_cents)}
                          {plan.price_cents > 0 && (
                            <span className="text-sm font-normal text-slate-400"> / mês</span>
                          )}
                        </p>

                        <ul className="mt-5 flex-1 space-y-2.5 text-sm text-slate-300">
                          {planFeatures(plan).map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <FaCheck className="mt-0.5 shrink-0 text-emerald-400" />
                              {feature}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6">
                          {isCurrent ? (
                            <button
                              type="button"
                              disabled
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-400"
                            >
                              Plano ativo
                            </button>
                          ) : isPaid ? (
                            <button
                              type="button"
                              onClick={() => void handleCreatePix(plan.code)}
                              disabled={creating && selectedPlanCode === plan.code}
                              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-60"
                            >
                              <FaPix />
                              {creating && selectedPlanCode === plan.code
                                ? "Gerando PIX..."
                                : "Assinar com PIX"}
                            </button>
                          ) : (
                            <p className="text-center text-xs text-slate-500">
                              Plano gratuito — ativo automaticamente na conta
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {payment && isPending(payment.status) && selectedPlan && (
                  <div className="space-y-4 rounded-2xl border border-emerald-500/20 bg-black/20 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h3 className="font-medium text-white">Pagamento PIX — {selectedPlan.name}</h3>
                        <p className="text-sm text-slate-400">
                          Escaneie o QR ou copie o código abaixo
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void handleRefreshStatus()}
                        disabled={polling}
                        className="flex items-center gap-1 text-sm text-emerald-400 hover:underline disabled:opacity-60"
                      >
                        <FaRotateRight className={polling ? "animate-spin" : ""} />
                        Atualizar status
                      </button>
                    </div>

                    {payment.qrCodeBase64 ? (
                      <div className="flex justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`data:image/png;base64,${payment.qrCodeBase64}`}
                          alt="QR Code PIX"
                          className="h-56 w-56 rounded-xl bg-white p-2"
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400">
                        QR Code indisponível. Use o código copia e cola abaixo.
                      </p>
                    )}

                    {payment.qrCode && (
                      <div className="space-y-2">
                        <label className="text-xs text-slate-500">PIX copia e cola</label>
                        <div className="flex gap-2">
                          <input
                            readOnly
                            value={payment.qrCode}
                            className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-slate-300"
                          />
                          <button
                            type="button"
                            onClick={() => void copyPixCode()}
                            className="rounded-lg border border-white/10 px-3 py-2 text-emerald-400 hover:bg-white/5"
                            aria-label="Copiar código PIX"
                          >
                            <FaCopy />
                          </button>
                        </div>
                      </div>
                    )}

                    <p className="text-center text-sm text-slate-400">
                      Valor:{" "}
                      <strong className="text-white">
                        {payment.amount.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </strong>
                      {" · "}
                      Status: <span className="text-amber-300">{payment.status}</span>
                    </p>
                  </div>
                )}

                {isPremium && !payment && (
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-sm text-slate-300">
                    Você está no AI Premium.{" "}
                    <Link href="/ai" className="text-emerald-400 hover:underline">
                      Ir para Conta+ AI
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const { data: usuario } = await apiClient.get<Usuario>("/user/get");
  return { props: { usuario } };
});
