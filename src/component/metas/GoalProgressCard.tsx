import { formatCurrency } from "@/helper";
import { Objetivos } from "@/model/type";
import PremiumCard from "@/component/ui/PremiumCard";
import { motion } from "framer-motion";

const EMOJI: Record<string, string> = {
  viagem: "✈️",
  carro: "🚗",
  casa: "🏠",
  educação: "📚",
  educacao: "📚",
  reserva: "💰",
  default: "🎯",
};

function pickEmoji(nome: string, categoria?: string) {
  const text = `${nome} ${categoria ?? ""}`.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI)) {
    if (key !== "default" && text.includes(key)) return emoji;
  }
  return EMOJI.default;
}

export default function GoalProgressCard({
  goal,
  onEdit,
}: {
  goal: Objetivos;
  onEdit?: (g: Objetivos) => void;
}) {
  const target = goal.meta_valor_vinculo > 0 ? goal.meta_valor_vinculo : goal.valor * 1.5 || 1;
  const current = goal.valor;
  const pct = Math.min(100, Math.round((current / target) * 100));
  const remaining = Math.max(0, target - current);

  return (
    <PremiumCard glow="none" className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-goals/15 text-xl">
            {pickEmoji(goal.nome_objetivo, goal.categoria)}
          </span>
          <div>
            <h3 className="font-semibold text-white">{goal.nome_objetivo}</h3>
            {goal.categoria ? (
              <p className="text-xs text-cp-subtle">{goal.categoria}</p>
            ) : null}
          </div>
        </div>
        <span className="rounded-full bg-goals/15 px-2.5 py-1 text-sm font-bold text-goals">
          {pct}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-goals to-brand-300"
        />
      </div>

      <div className="mt-4 flex items-end justify-between gap-2 text-sm">
        <div>
          <p className="text-cp-muted">
            {formatCurrency(current)}{" "}
            <span className="text-cp-subtle">de {formatCurrency(target)}</span>
          </p>
          <p className="mt-1 text-xs text-cp-subtle">
            Faltam: <span className="font-medium text-white">{formatCurrency(remaining)}</span>
          </p>
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(goal)}
            className="text-xs font-medium text-goals hover:underline"
          >
            Editar
          </button>
        )}
      </div>
    </PremiumCard>
  );
}
