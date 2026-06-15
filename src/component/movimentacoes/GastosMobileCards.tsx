import type { ReactNode } from "react";
import { formatCurrency, formatDate } from "@/helper";
import { Dividas } from "@/model/type";
import { Toggle } from "@/component/ui/toggle";
import { MdDelete, MdEdit } from "react-icons/md";

type GastosMobileCardsProps = {
  items: Dividas[];
  getTipoNome: (tipoDividaId: number) => string;
  onTogglePaid: (id: number, paid: boolean) => void;
  onEdit: (d: Dividas) => void;
  onDelete: (d: Dividas) => void;
};

function Row({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex justify-between gap-3 text-xs">
      <span className="shrink-0 text-cp-subtle">{label}</span>
      <span className="min-w-0 text-right text-white/90">{value}</span>
    </div>
  );
}

export default function GastosMobileCards({
  items,
  getTipoNome,
  onTogglePaid,
  onEdit,
  onDelete,
}: GastosMobileCardsProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {items.map((d) => {
        const temParceiro =
          !!(d.username && String(d.username).trim()) ||
          (d.valor_debito_vinculo != null && d.valor_debito_vinculo > 0);
        return (
          <li
            key={d.id}
            className="rounded-2xl border border-white/[0.08] bg-cp-card p-4 shadow-card ring-1 ring-expense/10"
          >
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-snug text-white">
                {d.nome_divida || "—"}
              </p>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] font-medium uppercase tracking-wide text-cp-subtle">
                  Quanto vou pagar
                </span>
                <span className="text-lg font-semibold tabular-nums text-expense">
                  {formatCurrency(d.quantoVouPagar ?? 0)}
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-2 border-t border-white/[0.06] pt-3">
              <Row label="Valor do boleto" value={formatCurrency(d.valor)} />
              <Row
                label="Categoria"
                value={getTipoNome(d.tipo_divida_id ?? 0)}
              />
              <Row label="Vence" value={formatDate(d.data_inclusao)} />
              {d.plot ? (
                <Row label="Parcela" value={String(d.plot)} />
              ) : null}
              {temParceiro ? (
                <>
                  {d.username ? (
                    <Row label="Dividir com" value={d.username} />
                  ) : null}
                  <Row
                    label="Parceiro(a) paga"
                    value={formatCurrency(d.valor_debito_vinculo ?? 0)}
                  />
                </>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-cp-subtle">Pago</span>
                <Toggle
                  checked={!!d.payment}
                  onChange={(e) => onTogglePaid(d.id, e.target.checked)}
                />
              </div>
              {d.is_edit ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-dash/20 text-dash ring-1 ring-dash/25 transition hover:bg-dash/30"
                    onClick={() => onEdit(d)}
                    title="Editar"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-expense/20 text-expense ring-1 ring-expense/25 transition hover:bg-expense/30"
                    onClick={() => onDelete(d)}
                    title="Excluir"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
