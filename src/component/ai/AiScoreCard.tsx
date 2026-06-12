import { formatCurrency } from "@/helper";
import type { ScoreResponse } from "@/types/ai";

type Props = {
  score: ScoreResponse | null;
  loading: boolean;
  onRefresh: () => void;
};

export default function AiScoreCard({ score, loading, onRefresh }: Props) {
  const value = score?.score ?? 0;
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-300">Score Financeiro</h3>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="text-xs text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
        >
          Atualizar
        </button>
      </div>
      {loading && !score ? (
        <div className="h-24 animate-pulse rounded-xl bg-white/5" />
      ) : (
        <>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-bold text-emerald-400">{value}</span>
            <span className="mb-1 text-lg text-slate-300">{score?.nivel ?? "—"}</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            {score?.explicacao ?? "Execute a análise para ver sua explicação personalizada."}
          </p>
        </>
      )}
    </div>
  );
}

export function AiCreditsBadge({
  credits,
}: {
  credits: {
    analyses: { remaining: number | null };
    chat: { remaining: number | null };
    premium: boolean;
    canUseChat?: boolean;
    canUseAnalysis?: boolean;
  } | null;
}) {
  if (!credits) return null;
  if (credits.premium) {
    return (
      <span className="rounded-full bg-gradient-to-r from-emerald-500/30 to-cyan-500/30 px-3 py-1 text-xs font-medium text-emerald-200">
        AI Premium · Ilimitado
      </span>
    );
  }
  const chatLeft = credits.chat.remaining ?? 0;
  const analysisLeft = credits.analyses.remaining ?? 0;
  const exhausted = chatLeft <= 0 && analysisLeft <= 0;
  if (exhausted) {
    return (
      <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-200">
        Amostra grátis esgotada · Upgrade
      </span>
    );
  }
  return (
    <span className="inline-flex max-w-full flex-wrap justify-end gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300 sm:px-3 sm:text-xs">
      <span className="whitespace-nowrap">Grátis: {analysisLeft} análises</span>
      <span className="text-cp-subtle">·</span>
      <span className="whitespace-nowrap">{chatLeft} mensagens</span>
    </span>
  );
}

export function AiCoachCard({
  data,
  loading,
}: {
  data: { resumo?: string; economiaPotencial?: number; recomendacoes?: string[] } | null;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
      <h3 className="mb-2 text-sm font-medium text-slate-300">Finance Coach</h3>
      {loading ? (
        <div className="h-20 animate-pulse rounded-xl bg-white/5" />
      ) : (
        <>
          <p className="text-sm text-slate-300">{data?.resumo ?? "—"}</p>
          {data?.economiaPotencial != null && (
            <p className="mt-2 text-emerald-400">
              Economia potencial: {formatCurrency(data.economiaPotencial)}
            </p>
          )}
          {data?.recomendacoes && data.recomendacoes.length > 0 && (
            <ul className="mt-3 list-inside list-disc text-sm text-slate-400">
              {data.recomendacoes.slice(0, 3).map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
