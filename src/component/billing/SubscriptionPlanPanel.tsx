import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  FaCheck,
  FaCopy,
  FaPix,
  FaRotateRight,
  FaWandMagicSparkles,
} from "react-icons/fa6";
import { getErrorMessage } from "@/services/api";
import {
  createPlanPixPayment,
  cycleLabel,
  fetchBillingPlans,
  fetchMySubscription,
  getPixPaymentStatus,
  listBillingPayments,
  planPriceForCycle,
  type BillingCycle,
  type BillingPlan,
  type PixPayment,
  type UserSubscription,
} from "@/services/billing";
import {
  canChangeBillingCycle,
  canUpgradeToPremium,
  freePlanBlockedMessage,
  isApprovedPayment,
  isPendingPayment,
  isPlanActionDisabled,
  isPremiumPlan,
  planActionLabel,
} from "@/utils/billing-plan-rules";

type UsuarioLite = { nome: string; email: string };

type Props = {
  usuario: UsuarioLite;
  variant?: "compact" | "full";
  showTitle?: boolean;
  className?: string;
};

function formatBrl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function planFeatures(plan: BillingPlan): string[] {
  if (plan.code === "AI_PREMIUM") {
    return [
      "Análises financeiras ilimitadas",
      "Chat com coach IA ilimitado",
      "Score, projeções e plano de dívidas",
    ];
  }
  return [
    `${plan.monthly_analysis_limit ?? 5} análises por mês`,
    `${plan.monthly_chat_limit ?? 10} mensagens de chat por mês`,
    "Score e diagnóstico básico",
  ];
}

export default function SubscriptionPlanPanel({
  usuario,
  variant = "full",
  showTitle = true,
  className = "",
}: Props) {
  const [plans, setPlans] = useState<BillingPlan[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [payment, setPayment] = useState<PixPayment | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [polling, setPolling] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [selectedPlanCode, setSelectedPlanCode] = useState<string | null>(null);

  const premiumPlan = useMemo(
    () => plans.find((p) => p.code === "AI_PREMIUM") ?? null,
    [plans],
  );

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => a.price_cents - b.price_cents),
    [plans],
  );

  const isPremium = isPremiumPlan(subscription?.plan?.code);
  const hasPending = Boolean(payment && isPendingPayment(payment.status));
  const showCycleToggle =
    premiumPlan &&
    canChangeBillingCycle(subscription, payment) &&
    (canUpgradeToPremium(subscription, payment) || isPremium);

  const annualSavingsPercent = useMemo(() => {
    if (!premiumPlan?.annual_price_cents) return null;
    const monthlyTotal = premiumPlan.price_cents * 12;
    if (monthlyTotal <= 0) return null;
    return Math.round((1 - premiumPlan.annual_price_cents / monthlyTotal) * 100);
  }, [premiumPlan]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setLoadError(null);
      const [planList, sub, history] = await Promise.all([
        fetchBillingPlans(),
        fetchMySubscription(),
        listBillingPayments(10).catch(() => [] as PixPayment[]),
      ]);
      setPlans(planList);
      setSubscription(sub);
      const pending = history.find((p) => isPendingPayment(p.status));
      setPayment(pending ?? null);
      if (pending?.plan?.code) setSelectedPlanCode(pending.plan.code);
      if (pending?.billingCycle) setBillingCycle(pending.billingCycle);
      else if (sub?.billing_cycle) setBillingCycle(sub.billing_cycle);
    } catch (error) {
      const msg =
        getErrorMessage((error as AxiosError).response?.data) ||
        "Erro ao carregar planos.";
      setLoadError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!payment?.id || !isPendingPayment(payment.status)) return;
    const timer = setInterval(() => {
      void getPixPaymentStatus(payment.id)
        .then((updated) => {
          setPayment(updated);
          if (isApprovedPayment(updated.status)) {
            toast.success("Pagamento confirmado! Plano atualizado.");
            void loadData();
          }
        })
        .catch(() => undefined);
    }, 12000);
    return () => clearInterval(timer);
  }, [payment?.id, payment?.status, loadData]);

  async function handleCreatePix(planCode: string) {
    setSelectedPlanCode(planCode);
    setCreating(true);
    try {
      const pix = await createPlanPixPayment(planCode, {
        billingCycle,
        payerEmail: usuario.email,
        payerName: usuario.nome,
      });
      setPayment(pix);
      if (isApprovedPayment(pix.status)) {
        toast.success("Pagamento aprovado! Plano ativado.");
        await loadData();
      } else {
        toast.info("PIX gerado. Escaneie ou copie o código para pagar.");
      }
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Erro ao gerar PIX.",
      );
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
      if (isApprovedPayment(updated.status)) {
        toast.success("Pagamento confirmado! Plano atualizado.");
        await loadData();
      } else {
        toast.info("Pagamento ainda pendente.");
      }
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Erro ao consultar pagamento.",
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

  const selectedPlan =
    sortedPlans.find((p) => p.code === selectedPlanCode) ??
    sortedPlans.find((p) => p.code === payment?.plan?.code) ??
    null;

  if (loading) {
    return (
      <div className={`rounded-2xl border border-white/10 bg-white/5 p-6 text-center text-slate-400 ${className}`}>
        Carregando plano...
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {showTitle && (
        <div>
          <div className="flex items-center gap-2 text-brand-400">
            <FaWandMagicSparkles />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Plano Conta+ AI
            </span>
          </div>
          {variant === "full" && (
            <p className="mt-2 text-sm text-slate-400">
              Escolha mensal ou anual. O plano gratuito só volta automaticamente após o vencimento do Premium.
            </p>
          )}
        </div>
      )}

      {loadError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {loadError}
          <button
            type="button"
            onClick={() => void loadData()}
            className="ml-2 font-medium underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      <div className="rounded-xl border border-white/10 bg-cp-card-secondary/40 px-4 py-3 text-sm text-slate-300">
        <p>
          Plano atual:{" "}
          <span className="font-medium text-brand-300">
            {subscription?.plan?.name ?? "Conta+ Free"}
          </span>
          {subscription?.billing_cycle && isPremium && (
            <span className="text-slate-400"> · {cycleLabel(subscription.billing_cycle)}</span>
          )}
        </p>
        {subscription?.start_date && isPremium && (
          <p className="mt-1 text-slate-400">
            Início: {new Date(subscription.start_date).toLocaleDateString("pt-BR")}
            {subscription.end_date && (
              <>
                {" "}
                · Vencimento:{" "}
                <span className="font-medium text-brand-300/90">
                  {new Date(subscription.end_date).toLocaleDateString("pt-BR")}
                </span>
              </>
            )}
          </p>
        )}
        {isPremium && (
          <p className="mt-2 text-xs text-amber-200/90">{freePlanBlockedMessage(subscription)}</p>
        )}
        {hasPending && (
          <p className="mt-2 text-xs text-amber-300">
            Há um PIX pendente. Finalize o pagamento antes de alterar o plano.
          </p>
        )}
      </div>

      {showCycleToggle && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-400">Ciclo de cobrança:</span>
          <div className="inline-flex rounded-xl border border-white/[0.08] bg-cp-card p-1">
            {(["monthly", "annual"] as BillingCycle[]).map((cycle) => (
              <button
                key={cycle}
                type="button"
                disabled={hasPending}
                onClick={() => setBillingCycle(cycle)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                  billingCycle === cycle
                    ? "bg-primary text-cp-base shadow-sm"
                    : "text-cp-muted hover:text-white"
                }`}
              >
                {cycle === "monthly" ? "Mensal" : "Anual"}
                {cycle === "annual" && annualSavingsPercent != null && (
                  <span className="ml-1 text-xs opacity-90">(-{annualSavingsPercent}%)</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {variant === "compact" && premiumPlan && !isPremium && !hasPending && (
        <button
          type="button"
          disabled={creating}
          onClick={() => void handleCreatePix("AI_PREMIUM")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60 sm:w-auto"
        >
          <FaPix />
          {creating ? "Gerando PIX..." : `Assinar Premium ${cycleLabel(billingCycle)}`}
        </button>
      )}

      {variant === "compact" && isPremium && !hasPending && subscription?.billing_cycle !== billingCycle && (
        <button
          type="button"
          disabled={creating}
          onClick={() => void handleCreatePix("AI_PREMIUM")}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary/90 px-4 py-3 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60 sm:w-auto"
        >
          <FaPix />
          {creating ? "Gerando PIX..." : `Mudar para ${cycleLabel(billingCycle)}`}
        </button>
      )}

      {variant === "full" && (
        <div className="grid gap-4 md:grid-cols-2">
          {sortedPlans.map((plan) => {
            const highlighted = plan.code === "AI_PREMIUM";
            const isPaid = plan.price_cents > 0;
            const disabled = isPlanActionDisabled(
              plan,
              subscription,
              billingCycle,
              payment,
              creating && selectedPlanCode === plan.code,
            );

            return (
              <div
                key={plan.code}
                className={`relative flex flex-col rounded-2xl border p-5 ${
                  highlighted
                    ? "border-primary/40 bg-gradient-to-br from-primary/10 to-ai/5"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-2xl font-bold text-brand-400">
                  {plan.price_cents === 0
                    ? "Grátis"
                    : formatBrl(
                        planPriceForCycle(
                          plan,
                          isPaid && highlighted ? billingCycle : "monthly",
                        ),
                      )}
                  {plan.price_cents > 0 && (
                    <span className="text-sm font-normal text-slate-400">
                      {" "}
                      / {isPaid && highlighted && billingCycle === "annual" ? "ano" : "mês"}
                    </span>
                  )}
                </p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-slate-300">
                  {planFeatures(plan).map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <FaCheck className="mt-0.5 shrink-0 text-brand-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {plan.code === "FREE" && isPremium ? (
                    <p className="text-center text-xs text-slate-500">
                      {freePlanBlockedMessage(subscription)}
                    </p>
                  ) : isPaid ? (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => void handleCreatePix(plan.code)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaPix />
                      {creating && selectedPlanCode === plan.code
                        ? "Gerando PIX..."
                        : planActionLabel(plan, subscription, billingCycle)}
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
      )}

      {payment && isPendingPayment(payment.status) && selectedPlan && (
        <div className="space-y-4 rounded-2xl border border-primary/20 bg-black/20 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-medium text-white">
                PIX pendente — {selectedPlan.name} ({cycleLabel(payment.billingCycle)})
              </h4>
              <p className="text-xs text-slate-400">Conclua este pagamento para alterar o plano</p>
            </div>
            <button
              type="button"
              onClick={() => void handleRefreshStatus()}
              disabled={polling}
              className="flex items-center gap-1 text-sm text-brand-400 hover:underline disabled:opacity-60"
            >
              <FaRotateRight className={polling ? "animate-spin" : ""} />
              Atualizar
            </button>
          </div>
          {payment.qrCodeBase64 ? (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`data:image/png;base64,${payment.qrCodeBase64}`}
                alt="QR Code PIX"
                className="h-48 w-48 rounded-xl bg-white p-2"
              />
            </div>
          ) : null}
          {payment.qrCode && (
            <div className="flex gap-2">
              <input
                readOnly
                value={payment.qrCode}
                className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-slate-300"
              />
              <button
                type="button"
                onClick={() => void copyPixCode()}
                className="rounded-lg border border-white/10 px-3 py-2 text-brand-400"
                aria-label="Copiar PIX"
              >
                <FaCopy />
              </button>
            </div>
          )}
        </div>
      )}

      {variant === "compact" && (
        <Link href="/planos" className="inline-block text-sm text-brand-400 hover:underline">
          Ver todos os planos →
        </Link>
      )}
    </div>
  );
}
