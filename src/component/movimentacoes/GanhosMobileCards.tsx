import { formatCurrency, formatDate } from "@/helper";
import { Rendas } from "@/model/type";
import { MdDelete, MdEdit } from "react-icons/md";

type GanhosMobileCardsProps = {
  items: Rendas[];
  onEdit: (r: Rendas) => void;
  onDelete: (r: Rendas) => void;
};

export default function GanhosMobileCards({
  items,
  onEdit,
  onDelete,
}: GanhosMobileCardsProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {items.map((r) => (
        <li
          key={r.id}
          className="rounded-2xl border border-white/10 bg-slate-900/55 p-4 shadow-sm ring-1 ring-white/[0.04]"
        >
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium leading-snug text-slate-100">
              {r.nome_renda || "—"}
            </p>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Valor
              </span>
              <span className="text-lg font-semibold tabular-nums text-emerald-200">
                {formatCurrency(r.valor)}
              </span>
            </div>
          </div>
          <p className="mt-3 border-t border-white/10 pt-3 text-xs text-slate-400">
            <span className="text-slate-500">Pago em </span>
            <span className="font-medium text-slate-200">
              {formatDate(r.data_inclusao)}
            </span>
          </p>
          <div className="mt-4 flex justify-end gap-2 border-t border-white/10 pt-3">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/25 text-sky-300 hover:bg-sky-500/35"
              onClick={() => onEdit(r)}
              title="Editar"
            >
              <MdEdit size={20} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/25 text-red-300 hover:bg-red-500/40"
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
