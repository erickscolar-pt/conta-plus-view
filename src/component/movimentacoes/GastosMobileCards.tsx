import type { ReactNode } from "react";
import { formatCurrency, formatDate } from "@/helper";
import { Dividas } from "@/model/type";
import { Toggle } from "@/component/ui/toggle";
import { MdDelete, MdEdit, MdSwapHoriz } from "react-icons/md";
import { isTransferenciaGasto } from "@/component/movimentacoes/gastoTransferRows";

type GastosMobileCardsProps = {
  items: Dividas[];
  getTipoNome: (tipoDividaId: number, row?: Dividas) => string;
  selectedIds?: Set<number>;
  onToggleSelect?: (id: number, next: boolean) => void;
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
  selectedIds,
  onToggleSelect,
  onTogglePaid,
  onEdit,
  onDelete,
}: GastosMobileCardsProps) {
  return (
    <ul className="space-y-3 md:hidden">
      {items.map((d) => {
        const isTransfer = isTransferenciaGasto(d);
        const temParceiro =
          !!(d.username && String(d.username).trim()) ||
          (d.valor_debito_vinculo != null && d.valor_debito_vinculo > 0);
        return (
          <li
            key={isTransfer ? `trf-${d.id}` : `div-${d.id}`}
            className="rounded-2xl border border-white/[0.08] bg-cp-card p-4 shadow-card ring-1 ring-expense/10"
          >
            <div className="flex items-start gap-3">
              {!isTransfer && onToggleSelect ? (
                <input
                  type="checkbox"
                  checked={selectedIds?.has(d.id) ?? false}
                  onChange={(e) => onToggleSelect(d.id, e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-cp-base text-primary focus:ring-primary/40"
                  aria-label={`Selecionar ${d.nome_divida}`}
                />
              ) : null}
              <div className="min-w-0 flex-1 flex flex-col gap-1">
                <p className="text-sm font-medium leading-snug text-white">
                  {d.nome_divida || "—"}
                </p>
                {isTransfer ? (
                  <span className="inline-flex w-fit items-center gap-1 rounded-md bg-dash/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dash ring-1 ring-dash/25">
                    <MdSwapHoriz size={12} aria-hidden />
                    Transferência
                  </span>
                ) : null}
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-cp-subtle">
                    {isTransfer ? "Valor enviado" : "Quanto vou pagar"}
                  </span>
                  <span className="text-lg font-semibold tabular-nums text-expense">
                    {formatCurrency(d.quantoVouPagar ?? 0)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-3 space-y-2 border-t border-white/[0.06] pt-3">
              {!isTransfer ? (
                <Row label="Valor do boleto" value={formatCurrency(d.valor)} />
              ) : null}
              <Row
                label="Categoria"
                value={getTipoNome(d.tipo_divida_id ?? 0, d)}
              />
              <Row
                label={isTransfer ? "Data" : "Vence"}
                value={formatDate(d.data_inclusao)}
              />
              {!isTransfer && d.plot ? (
                <Row label="Parcela" value={String(d.plot)} />
              ) : null}
              {temParceiro ? (
                <>
                  {d.username ? (
                    <Row
                      label={isTransfer ? "Para" : "Dividir com"}
                      value={d.username}
                    />
                  ) : null}
                  {!isTransfer ? (
                    <Row
                      label="Parceiro(a) paga"
                      value={formatCurrency(d.valor_debito_vinculo ?? 0)}
                    />
                  ) : null}
                </>
              ) : null}
              {isTransfer && d.operationId ? (
                <Row label="Operação" value={d.operationId} />
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-3">
              {isTransfer ? (
                <span className="text-xs font-medium text-emerald-300">
                  Enviado
                </span>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-cp-subtle">Pago</span>
                  <Toggle
                    checked={!!d.payment}
                    onChange={(e) => onTogglePaid(d.id, e.target.checked)}
                  />
                </div>
              )}
              {!isTransfer && d.is_edit ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-dash/20 text-dash ring-1 ring-dash/25 transition hover:bg-dash/30"
                    onClick={() => onEdit(d)}
                    title="Editar"
                  >
                    <MdEdit size={18} />
                  </button>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/25 text-red-200 ring-1 ring-red-500/30 transition hover:bg-red-500/40"
                    onClick={() => onDelete(d)}
                    title="Excluir"
                  >
                    <MdDelete size={18} />
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
