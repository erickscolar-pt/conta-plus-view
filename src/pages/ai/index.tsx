import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { Usuario } from "@/model/type";
import AiChat from "@/component/ai/AiChat";
import AiPremiumUpsell from "@/component/ai/AiPremiumUpsell";
import PremiumCard from "@/component/ui/PremiumCard";
import SubscriptionPlanPanel from "@/component/billing/SubscriptionPlanPanel";
import { AiCreditsBadge } from "@/component/ai/AiScoreCard";
import { fetchAiCredits, fetchAiNotifications, runCoach } from "@/services/ai";
import type { AiCreditsStatus, AiNotificationItem, CoachResponse } from "@/types/ai";
import { formatCurrency } from "@/helper";
import type { DashboardData } from "@/pages/dashboard/index";
import { toast } from "react-toastify";
import { FaWandMagicSparkles } from "react-icons/fa6";
import {
  MdAutoAwesome,
  MdSavings,
  MdTrendingDown,
  MdAccountBalance,
  MdLightbulb,
} from "react-icons/md";

type Props = {
  usuario: Usuario;
  dashboardSnapshot: DashboardData | null;
};

function buildInsightsFromDashboard(data: DashboardData | null): string[] {
  if (!data) {
    return ["Adicione movimentações para receber insights personalizados."];
  }
  const insights: string[] = [];
  const commitment = data.insights?.debtCommitment ?? 0;
  if (commitment > 0) {
    insights.push(
      `Suas despesas fixas representam cerca de ${Math.round(commitment)}% da renda no período.`,
    );
  }
  const byType = data.insights?.byType ?? [];
  if (byType.length > 0) {
    const top = [...byType].sort((a, b) => b.total - a.total)[0];
    insights.push(
      `Maior categoria de gasto: ${top.tipo} (${formatCurrency(top.total)}).`,
    );
  }
  const saldo = data.summary?.saldoPeriodo ?? 0;
  if (saldo > 0) {
    insights.push(`Saldo positivo no período: ${formatCurrency(saldo)}.`);
  } else if (saldo < 0) {
    insights.push(
      `Atenção: saldo negativo de ${formatCurrency(Math.abs(saldo))} no período analisado.`,
    );
  }
  return insights.length
    ? insights.slice(0, 4)
    : ["Adicione movimentações para receber insights personalizados."];
}

const QUICK_PROMPTS = [
  { label: "Analisar meu mês", icon: MdAutoAwesome, message: "Analise minhas finanças deste mês e resuma os pontos principais." },
  { label: "Como economizar?", icon: MdSavings, message: "Com base no meu perfil financeiro, como posso economizar mais?" },
  { label: "Estou gastando demais?", icon: MdTrendingDown, message: "Estou gastando demais? Compare com padrões saudáveis." },
  { label: "Quanto posso investir?", icon: MdAccountBalance, message: "Quanto posso investir com segurança este mês?" },
  { label: "Criar plano financeiro", icon: MdLightbulb, message: "Crie um plano financeiro personalizado para os próximos 3 meses." },
];

export default function AiPage({ usuario, dashboardSnapshot }: Props) {
  const [credits, setCredits] = useState<AiCreditsStatus | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(true);
  const [chatSeed, setChatSeed] = useState<string | undefined>();
  const [insights, setInsights] = useState<string[]>(() =>
    buildInsightsFromDashboard(dashboardSnapshot),
  );
  const [notifications, setNotifications] = useState<AiNotificationItem[]>([]);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coach, setCoach] = useState<CoachResponse | null>(null);

  const refreshCredits = useCallback(async () => {
    setCreditsLoading(true);
    try {
      setCredits(await fetchAiCredits());
    } catch {
      setCredits(null);
    } finally {
      setCreditsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshCredits();
    void fetchAiNotifications()
      .then((items) => setNotifications(items as AiNotificationItem[]))
      .catch(() => undefined);
  }, [refreshCredits]);

  async function handleCoachAnalysis() {
    setCoachLoading(true);
    try {
      const result = await runCoach();
      setCoach(result);
      const fromCoach = [
        result.resumo,
        ...result.problemas.slice(0, 2),
        ...result.recomendacoes.slice(0, 1),
      ].filter(Boolean);
      if (fromCoach.length) setInsights(fromCoach.slice(0, 4));
      await refreshCredits();
      toast.success("Análise gerada com sucesso.");
    } catch {
      toast.error("Não foi possível gerar a análise. Verifique seus créditos.");
    } finally {
      setCoachLoading(false);
    }
  }

  const notificationInsights = notifications
    .filter((n) => !n.read)
    .slice(0, 3)
    .map((n) => n.message);
  const displayInsights =
    notificationInsights.length > 0 ? notificationInsights : insights;

  const chatLocked = creditsLoading || !credits?.canUseChat;
  const analysisLocked = creditsLoading || !credits?.canUseAnalysis;
  const chatDisabledReason = chatLocked
    ? creditsLoading
      ? "Verificando seu plano…"
      : !credits?.aiReady
        ? "IA em configuração no servidor. Tente em instantes."
        : credits?.premium
          ? "Chat indisponível no momento."
          : (credits?.chat.remaining ?? 0) <= 0
            ? "Suas mensagens grátis acabaram. Assine o Premium para chat ilimitado."
            : "Chat indisponível."
    : undefined;

  return (
    <>
      <Head>
        <title>IA Financeira | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-2 text-ai">
                      <FaWandMagicSparkles />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        IA Financeira
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl">
                      Seu consultor financeiro inteligente
                    </h2>
                    <p className="mt-1 text-sm text-cp-muted">
                      Pergunte qualquer coisa sobre seu dinheiro — respostas com seus dados reais.
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-start gap-2 sm:flex-col sm:items-end">
                    <AiCreditsBadge credits={credits} />
                  </div>
                </div>
              </motion.div>

              {!credits?.premium ? (
                <AiPremiumUpsell credits={credits} variant="banner" />
              ) : null}

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {QUICK_PROMPTS.map(({ label, icon: Icon, message }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setChatSeed(message)}
                    disabled={chatLocked}
                    title={
                      chatLocked
                        ? "Assine o Premium ou aguarde novos créditos"
                        : undefined
                    }
                    className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-cp-card p-3 text-left text-sm text-cp-muted transition hover:border-ai/30 hover:bg-ai/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/[0.08] disabled:hover:bg-cp-card disabled:hover:text-cp-muted"
                  >
                    <Icon className="shrink-0 text-ai" size={18} />
                    {label}
                  </button>
                ))}
              </div>

              <PremiumCard glow="ai" className="relative min-h-[320px] flex-1 p-3 sm:min-h-[420px] sm:p-5">
                {chatLocked ? (
                  <AiPremiumUpsell credits={credits} variant="overlay" loading={creditsLoading} />
                ) : null}
                <AiChat
                  seedMessage={chatSeed}
                  onMessageSent={() => void refreshCredits()}
                  disabled={chatLocked}
                  disabledReason={chatDisabledReason}
                />
              </PremiumCard>
            </div>

            <aside className="w-full shrink-0 space-y-4 lg:w-80">
              <PremiumCard glow="ai" className="p-4">
                <SubscriptionPlanPanel usuario={usuario} variant="compact" showTitle={false} />
              </PremiumCard>

              <PremiumCard className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Insights IA</h3>
                    <p className="mt-1 text-xs text-cp-subtle">
                      Com base nos seus dados reais
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleCoachAnalysis()}
                    disabled={coachLoading || analysisLocked}
                    title={
                      analysisLocked
                        ? "Assine o Premium ou aguarde novos créditos de análise"
                        : undefined
                    }
                    className="shrink-0 rounded-lg bg-ai/20 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-ai ring-1 ring-ai/30 transition hover:bg-ai/30 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {coachLoading ? "…" : analysisLocked ? "Premium" : "Atualizar"}
                  </button>
                </div>
                {analysisLocked && !coach ? (
                  <p className="mt-3 rounded-xl border border-ai/20 bg-ai/5 px-3 py-2 text-xs text-cp-muted">
                    Análises profundas com IA fazem parte do Premium. Veja quanto você
                    pode economizar — assine em um clique.
                  </p>
                ) : null}
                {coach?.economiaPotencial ? (
                  <p className="mt-3 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-xs text-primary">
                    Economia potencial estimada:{" "}
                    {formatCurrency(coach.economiaPotencial)}
                  </p>
                ) : null}
                <ul className="mt-4 space-y-3">
                  {displayInsights.map((text) => (
                    <li
                      key={text}
                      className="rounded-xl border border-ai/20 bg-ai/5 px-3 py-2.5 text-xs leading-relaxed text-cp-muted"
                    >
                      {text}
                    </li>
                  ))}
                </ul>
              </PremiumCard>
            </aside>
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  try {
    const user = await apiClient.get("/user/get");
    const end = new Date();
    const start = new Date();
    start.setMonth(end.getMonth() - 3);
    let dashboardSnapshot = null;
    try {
      const dash = await apiClient.post(
        `/dashboard?initial=${start.toISOString().split("T")[0]}&final=${end.toISOString().split("T")[0]}`,
      );
      dashboardSnapshot = dash.data;
    } catch {
      /* optional */
    }
    return { props: { usuario: user.data, dashboardSnapshot } };
  } catch {
    return { redirect: { destination: "/login", permanent: false } };
  }
});
