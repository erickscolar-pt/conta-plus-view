import Link from "next/link";
import { useEffect, useState } from "react";
import { FaWandMagicSparkles, FaCheck, FaArrowRight } from "react-icons/fa6";
import type { AiCreditsStatus } from "@/types/ai";
import { fetchBillingPlans } from "@/services/ai";

type Props = {
  credits: AiCreditsStatus | null;
  variant?: "banner" | "overlay";
  loading?: boolean;
  onUpgradeClick?: () => void;
};

const PREMIUM_FEATURES = [
  "Chat ilimitado com coach que conhece seus gastos",
  "Análises profundas: score, projeções e plano de dívidas",
  "Descubra quanto pode economizar todo mês",
  "Respostas em segundos — sem planilha, sem guesswork",
];

function lockReason(credits: AiCreditsStatus | null): string {
  if (!credits) return "Carregando seu plano…";
  if (!credits.aiReady) {
    return "A IA está sendo ativada no servidor. Tente novamente em instantes.";
  }
  if (credits.premium) {
    return "Seus créditos deste mês acabaram. Renove ou aguarde o próximo ciclo.";
  }
  const chatOut = (credits.chat.remaining ?? 0) <= 0;
  const analysisOut = (credits.analyses.remaining ?? 0) <= 0;
  if (chatOut && analysisOut) {
    return "Você usou sua amostra grátis deste mês. Desbloqueie o coach completo com o Premium.";
  }
  if (chatOut) {
    return "Suas mensagens grátis acabaram. Com Premium, pergunte o quanto quiser.";
  }
  return "Suas análises grátis acabaram. Upgrade para insights ilimitados.";
}

function formatBrl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function AiPremiumUpsell({
  credits,
  variant = "banner",
  loading = false,
  onUpgradeClick,
}: Props) {
  const [premiumPlan, setPremiumPlan] = useState<{
    price_cents: number;
    annual_price_cents?: number | null;
  } | null>(null);

  useEffect(() => {
    void fetchBillingPlans()
      .then((plans: Array<{ code: string; price_cents: number; annual_price_cents?: number | null }>) => {
        const premium = plans.find((p) => p.code === "AI_PREMIUM");
        if (premium) setPremiumPlan(premium);
      })
      .catch(() => undefined);
  }, []);

  const isPremium = credits?.premium;
  const locked =
    loading ||
    (credits &&
      (!credits.aiReady || (!credits.canUseChat && !credits.canUseAnalysis)));

  if (isPremium && !locked) return null;

  const monthlyLabel = premiumPlan
    ? formatBrl(premiumPlan.price_cents)
    : "R$ 19,90";
  const annualLabel = premiumPlan?.annual_price_cents
    ? formatBrl(premiumPlan.annual_price_cents)
    : "R$ 199";

  const title = loading
    ? "Carregando seu plano…"
    : locked
    ? "Desbloqueie seu consultor financeiro"
    : "Experimente grátis — depois vá além";

  const subtitle = locked
    ? lockReason(credits)
    : credits
      ? `Plano gratuito: ${credits.chat.remaining ?? 0} mensagens e ${credits.analyses.remaining ?? 0} análises restantes este mês. Premium = ilimitado.`
      : "Coach IA treinado para suas finanças pessoais.";

  const inner = (
    <>
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-ai to-planning shadow-glow-ai">
          <FaWandMagicSparkles className="text-lg text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ai">
            Conta+ AI Premium
          </p>
          <h3 className="mt-0.5 text-base font-bold text-white sm:text-lg">{title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-cp-muted">{subtitle}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2">
        {PREMIUM_FEATURES.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-cp-muted">
            <FaCheck className="mt-0.5 shrink-0 text-primary" size={14} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link
          href="/planos"
          onClick={onUpgradeClick}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-ai to-planning px-5 py-2.5 text-sm font-semibold text-white shadow-glow-ai transition hover:brightness-110"
        >
          Assinar por {monthlyLabel}/mês
          <FaArrowRight size={12} />
        </Link>
        <span className="text-xs text-cp-subtle">ou {annualLabel}/ano · cancele quando quiser</span>
      </div>
    </>
  );

  if (variant === "overlay") {
    return (
      <div className="absolute inset-0 z-10 flex items-end sm:items-center justify-center rounded-2xl bg-cp-base/85 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl border border-ai/25 bg-cp-card p-5 shadow-glow-ai ring-1 ring-ai/10">
          {inner}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-ai/20 bg-gradient-to-br from-ai/10 via-cp-card to-planning/5 p-5 ring-1 ring-ai/10">
      {inner}
    </div>
  );
}
