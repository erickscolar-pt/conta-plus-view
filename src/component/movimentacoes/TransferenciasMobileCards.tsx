import { MdInfoOutline } from "react-icons/md";
import { formatCurrency } from "@/helper";
import type { Transferencia } from "@/model/type";

type TransferenciasMobileCardsProps = {
  items: Transferencia[];
  onDetail: (t: Transferencia) => void;
};

function formatDateBr(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split("-");
  if (!y || !m || !d) return yyyyMmDd;
  return `${d}/${m}/${y}`;
}

export default function TransferenciasMobileCards({
  items,
  onDetail,
}: TransferenciasMobileCardsProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {items.map((t) => {
        const enviada = t.direcao === "enviada";
        const cancelada = t.status !== "concluida";
        return (
          <li
            key={t.id}
            className="rounded-2xl border border-white/[0.08] bg-cp-card p-4 shadow-card ring-1 ring-primary/10"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-snug text-white">
                {t.descricao ||
                  (enviada
                    ? `Transferência para ${t.contraparte.nome}`
                    : `Transferência de ${t.contraparte.nome}`)}
              </p>
              <span className="text-xs text-cp-subtle">
                {enviada ? "Para " : "De "}
                <span className="text-white/90">{t.contraparte.nome}</span>
              </span>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/25">
                  {enviada ? "Transferência enviada" : "Transferência recebida"}
                </span>
                <span
                  className={`text-lg font-semibold tabular-nums ${
                    cancelada
                      ? "text-cp-subtle line-through"
                      : enviada
                        ? "text-expense"
                        : "text-income"
                  }`}
                >
                  {enviada ? "- " : "+ "}
                  {formatCurrency(t.valor)}
                </span>
              </div>
            </div>
            <p className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-cp-muted">
              <span className="text-cp-subtle">Data </span>
              <span className="font-medium text-white/90">
                {formatDateBr(t.data)}
              </span>
              <span className="ml-2 text-cp-subtle">· {t.operationId}</span>
            </p>
            <div className="mt-4 flex justify-end border-t border-white/[0.06] pt-3">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] px-3 py-2 text-xs font-semibold text-cp-muted transition hover:bg-white/[0.04] hover:text-white"
                onClick={() => onDetail(t)}
              >
                <MdInfoOutline size={16} />
                Detalhes
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
