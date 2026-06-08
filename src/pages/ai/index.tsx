import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { Usuario } from "@/model/type";
import AiScoreCard, { AiCoachCard, AiCreditsBadge } from "@/component/ai/AiScoreCard";
import AiChat from "@/component/ai/AiChat";
import {
  fetchAiCredits,
  runCoach,
  runDiagnostic,
  runProjection,
  runScore,
  runDebtPlan,
} from "@/services/ai";
import type {
  AiCreditsStatus,
  CoachResponse,
  DiagnosticResponse,
  ScoreResponse,
} from "@/types/ai";
import { getErrorMessage } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { FaWandMagicSparkles, FaChartLine, FaScaleBalanced } from "react-icons/fa6";

type Props = { usuario: Usuario };

export default function AiPage({ usuario }: Props) {
  const [credits, setCredits] = useState<AiCreditsStatus | null>(null);
  const [score, setScore] = useState<ScoreResponse | null>(null);
  const [coach, setCoach] = useState<CoachResponse | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResponse | null>(null);
  const [projection, setProjection] = useState<Record<string, unknown> | null>(null);
  const [loadingScore, setLoadingScore] = useState(false);
  const [loadingCoach, setLoadingCoach] = useState(false);
  const [loadingDiag, setLoadingDiag] = useState(false);
  const [loadingProj, setLoadingProj] = useState(false);

  const refreshCredits = useCallback(async () => {
    try {
      const c = await fetchAiCredits();
      setCredits(c);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refreshCredits();
  }, [refreshCredits]);

  async function handleAnalysis<T>(
    fn: () => Promise<T>,
    setData: (d: T) => void,
    setLoading: (v: boolean) => void,
    label: string,
  ) {
    setLoading(true);
    try {
      const data = await fn();
      setData(data as T);
      void refreshCredits();
      toast.success(`${label} concluída.`);
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      if (status === 402) {
        toast.warning("Limite mensal atingido. Assine o Conta+ AI Premium.");
      } else {
        toast.error(getErrorMessage((error as AxiosError).response?.data) || "Erro na análise.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Conta+ AI | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-3 py-6 sm:px-6 md:px-10 md:py-8">
          <div className="mx-auto max-w-6xl space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="mb-1 flex items-center gap-2 text-emerald-400">
                  <FaWandMagicSparkles />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    Conta+ AI Premium
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white md:text-3xl">
                  Seu coach financeiro inteligente
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  Análises personalizadas com base nas suas movimentações reais.
                </p>
              </div>
              <AiCreditsBadge credits={credits} />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <AiScoreCard
                  score={score}
                  loading={loadingScore}
                  onRefresh={() =>
                    void handleAnalysis(runScore, setScore, setLoadingScore, "Score")
                  }
                />
              </div>
              <div className="lg:col-span-2">
                <AiCoachCard data={coach} loading={loadingCoach} />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Finance Coach",
                  icon: FaWandMagicSparkles,
                  action: () =>
                    handleAnalysis(runCoach, setCoach, setLoadingCoach, "Coach"),
                  loading: loadingCoach,
                },
                {
                  label: "Diagnóstico",
                  icon: FaScaleBalanced,
                  action: () =>
                    handleAnalysis(runDiagnostic, setDiagnostic, setLoadingDiag, "Diagnóstico"),
                  loading: loadingDiag,
                },
                {
                  label: "Projeções",
                  icon: FaChartLine,
                  action: () =>
                    handleAnalysis(runProjection, setProjection, setLoadingProj, "Projeção"),
                  loading: loadingProj,
                },
                {
                  label: "Plano de dívidas",
                  icon: FaScaleBalanced,
                  action: () =>
                    handleAnalysis(
                      runDebtPlan,
                      () => {},
                      () => {},
                      "Plano de dívidas",
                    ).then(() => toast.info("Veja o resultado no chat ou histórico.")),
                  loading: false,
                },
              ].map(({ label, icon: Icon, action, loading }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => void action()}
                  disabled={loading}
                  className="flex flex-col items-start gap-2 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-emerald-500/5 p-4 text-left backdrop-blur-xl transition hover:border-emerald-500/30 disabled:opacity-60"
                >
                  <Icon className="text-emerald-400" />
                  <span className="font-medium text-slate-100">{label}</span>
                  <span className="text-xs text-slate-500">
                    {loading ? "Processando..." : "Executar análise"}
                  </span>
                </button>
              ))}
            </div>

            {diagnostic?.resumo && (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-slate-300">
                <strong className="text-amber-200">Diagnóstico: </strong>
                {diagnostic.resumo}
              </div>
            )}

            {projection && (
              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-sm text-slate-300">
                <strong className="text-cyan-200">Projeção: </strong>
                Consulte os horizontes calculados nos dados retornados pela IA.
              </div>
            )}

            <AiChat />
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
    return { props: { usuario: user.data } };
  } catch {
    return { redirect: { destination: "/login", permanent: false } };
  }
});
