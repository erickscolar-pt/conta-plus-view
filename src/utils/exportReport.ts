import { formatCurrency } from "@/helper";
import type { DashboardData } from "@/pages/dashboard/index";

function escapeCsv(value: string | number) {
  const s = String(value);
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportDashboardCsv(data: DashboardData, periodLabel: string) {
  const rows: string[][] = [
    ["Conta+ — Relatório financeiro"],
    [`Período: ${periodLabel}`],
    [],
    ["Resumo"],
    ["Receitas", formatCurrency(data.summary?.totalEntradas ?? 0)],
    ["Despesas", formatCurrency(data.summary?.totalSaidasDividas ?? 0)],
    ["Saldo", formatCurrency(data.summary?.saldoPeriodo ?? 0)],
    [],
    ["Despesas por categoria", "Total"],
  ];

  for (const item of data.insights?.byType ?? []) {
    rows.push([item.tipo ?? "—", formatCurrency(item.total)]);
  }

  rows.push([]);
  rows.push(["Entradas por mês", "Valor"]);
  for (const item of data.rendas ?? []) {
    rows.push([item.mes ?? "—", formatCurrency(item.valortotal)]);
  }

  rows.push([]);
  rows.push(["Saídas por mês", "Valor"]);
  for (const item of data.dividas ?? []) {
    rows.push([item.mes ?? "—", formatCurrency(item.valortotal)]);
  }

  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
  const stamp = new Date().toISOString().slice(0, 10);
  downloadBlob(
    `conta-plus-relatorio-${stamp}.csv`,
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
  );
}

export function exportDashboardPdf(data: DashboardData, periodLabel: string) {
  const totals = {
    entradas: data.summary?.totalEntradas ?? 0,
    saidas: data.summary?.totalSaidasDividas ?? 0,
    saldo: data.summary?.saldoPeriodo ?? 0,
  };

  const categories = (data.insights?.byType ?? [])
    .map(
      (c) =>
        `<tr><td>${c.tipo ?? "—"}</td><td style="text-align:right">${formatCurrency(c.total)}</td></tr>`,
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8"/>
  <title>Relatório Conta+</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 32px; color: #0f172a; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .muted { color: #64748b; font-size: 14px; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 24px 0; }
    .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
    .label { font-size: 12px; text-transform: uppercase; color: #64748b; }
    .value { font-size: 20px; font-weight: 700; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border-bottom: 1px solid #e2e8f0; padding: 8px 4px; font-size: 14px; }
    th { text-align: left; color: #64748b; font-size: 12px; text-transform: uppercase; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>Relatório financeiro — Conta+</h1>
  <p class="muted">Período: ${periodLabel}</p>
  <div class="grid">
    <div class="card"><div class="label">Receitas</div><div class="value">${formatCurrency(totals.entradas)}</div></div>
    <div class="card"><div class="label">Despesas</div><div class="value">${formatCurrency(totals.saidas)}</div></div>
    <div class="card"><div class="label">Saldo</div><div class="value">${formatCurrency(totals.saldo)}</div></div>
  </div>
  <h2 style="font-size:16px;margin-top:32px">Despesas por categoria</h2>
  <table>
    <thead><tr><th>Categoria</th><th style="text-align:right">Total</th></tr></thead>
    <tbody>${categories || '<tr><td colspan="2">Sem dados</td></tr>'}</tbody>
  </table>
  <p class="muted" style="margin-top:32px">Gerado em ${new Date().toLocaleString("pt-BR")} — conta-plus.app.br</p>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
