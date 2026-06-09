import PremiumCard from "@/component/ui/PremiumCard";
import { Dividas } from "@/model/type";
import { formatCurrency } from "@/helper";

type Status = "paid" | "pending" | "overdue";

function debtStatus(d: Dividas): Status {
  if (d.payment) return "paid";
  const date = new Date(d.data_inclusao);
  const now = new Date();
  if (date < now) return "overdue";
  return "pending";
}

const STATUS_STYLE: Record<Status, { label: string; className: string }> = {
  paid: { label: "Pago", className: "bg-income/15 text-income ring-income/25" },
  pending: { label: "Pendente", className: "bg-amber-500/15 text-amber-300 ring-amber-500/25" },
  overdue: { label: "Atrasado", className: "bg-expense/15 text-expense ring-expense/25" },
};

export default function DebtCard({
  debt,
  onEdit,
}: {
  debt: Dividas;
  onEdit?: (d: Dividas) => void;
}) {
  const status = debtStatus(debt);
  const st = STATUS_STYLE[status];
  const installments =
    debt.installments && debt.n_installments
      ? `${debt.n_installments}/${debt.installments}`
      : debt.plot || "—";

  return (
    <PremiumCard className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wider text-cp-subtle">Tipo</p>
          <h3 className="mt-1 font-semibold text-white">{debt.nome_divida}</h3>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${st.className}`}>
          {st.label}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-cp-subtle">Valor</p>
          <p className="font-semibold text-expense">{formatCurrency(debt.valor)}</p>
        </div>
        <div>
          <p className="text-xs text-cp-subtle">Parcelas</p>
          <p className="font-medium text-cp-muted">{installments}</p>
        </div>
      </div>
      {onEdit && (
        <button
          type="button"
          onClick={() => onEdit(debt)}
          className="mt-4 text-xs font-medium text-dash hover:underline"
        >
          Gerenciar
        </button>
      )}
    </PremiumCard>
  );
}
