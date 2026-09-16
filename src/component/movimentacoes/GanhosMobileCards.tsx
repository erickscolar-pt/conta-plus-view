import { formatCurrency, formatDate } from "@/helper";
import { Rendas } from "@/model/type";
import { MdDelete, MdEdit } from "react-icons/md";

type GanhosMobileCardsProps = {
  items: Rendas[];
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number, next: boolean) => void;
  onEdit: (r: Rendas) => void;
  onDelete: (r: Rendas) => void;
};

export default function GanhosMobileCards({
  items,
  selectedIds,
  onToggleSelect,
  onEdit,
  onDelete,
}: GanhosMobileCardsProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {items.map((r) => (
        <li
          key={r.id}
          className="rounded-2xl border border-white/[0.08] bg-cp-card p-4 shadow-card ring-1 ring-income/10"
        >
          <div className="flex items-start gap-3">
            {onToggleSelect ? (
              <input
                type="checkbox"
                checked={selectedIds?.has(r.id) ?? false}
                onChange={(e) => onToggleSelect(r.id, e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-white/20 bg-cp-base text-primary focus:ring-primary/40"
                aria-label={`Selecionar ${r.nome_renda}`}
              />
            ) : null}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium leading-snug text-white">
                {r.nome_renda || "—"}
              </p>
              <div className="mt-1 flex items-baseline justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-cp-subtle">
                  Valor
                </span>
                <span className="text-lg font-semibold tabular-nums text-income">
                  {formatCurrency(r.valor)}
                </span>
              </div>
            </div>
          </div>
          <p className="mt-3 border-t border-white/[0.06] pt-3 text-xs text-cp-muted">
            <span className="text-cp-subtle">Pago em </span>
            <span className="font-medium text-white/90">
              {formatDate(r.data_inclusao)}
            </span>
          </p>
          <div className="mt-4 flex justify-end gap-2 border-t border-white/[0.06] pt-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-dash/20 text-dash ring-1 ring-dash/25 transition hover:bg-dash/30"
              onClick={() => onEdit(r)}
              title="Editar"
            >
              <MdEdit size={20} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-expense/20 text-expense ring-1 ring-expense/25 transition hover:bg-expense/30"
              onClick={() => onDelete(r)}
              title="Excluir"
            >
              <MdDelete size={20} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
