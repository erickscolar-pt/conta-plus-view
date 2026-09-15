import type { Dividas, Transferencia } from "@/model/type";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ymd(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Período alinhado ao filtro de calendário da aba Saídas. */
export function periodFromGastoFilter(
  filterDate: string,
  filterType: "day" | "month",
): { periodStart?: string; periodEnd?: string } {
  if (!filterDate) {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { periodStart: ymd(start), periodEnd: ymd(end) };
  }

  const ref = new Date(filterDate);
  if (Number.isNaN(ref.getTime())) {
    return {};
  }

  if (filterType === "day") {
    const day = ymd(ref);
    return { periodStart: day, periodEnd: day };
  }

  const start = new Date(ref.getFullYear(), ref.getMonth(), 1);
  const end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0);
  return { periodStart: ymd(start), periodEnd: ymd(end) };
}

export function isTransferenciaGasto(d: Dividas): boolean {
  return d.kind === "transferencia";
}

/** Converte transferência enviada em linha visual de Saídas. */
export function transferenciaEnviadaToGastoRow(t: Transferencia): Dividas {
  const para = t.contraparte?.nome?.trim() || t.contraparte?.username || "contato";
  const descricao = t.descricao?.trim();
  return {
    id: t.id,
    kind: "transferencia",
    operationId: t.operationId,
    nome_divida: descricao || `Transferência para ${para}`,
    valor: t.valor,
    quantoVouPagar: t.valor,
    valor_debito_vinculo: 0,
    data_inclusao: t.data,
    username: t.contraparte?.username
      ? `@${t.contraparte.username}`
      : para,
    payment: true,
    is_edit: false,
    plot: "—",
  };
}

export function sortGastosByDateDesc(a: Dividas, b: Dividas): number {
  const da = new Date(a.data_inclusao).getTime();
  const db = new Date(b.data_inclusao).getTime();
  if (Number.isNaN(da) && Number.isNaN(db)) return 0;
  if (Number.isNaN(da)) return 1;
  if (Number.isNaN(db)) return -1;
  return db - da;
}

export const TRANSFERENCIA_CATEGORY_FILTER = "transferencia";
