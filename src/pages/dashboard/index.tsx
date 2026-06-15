import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import ChartGrafic from "@/component/chartgrafic";
import NotFound from "@/component/notfound";
import Head from "next/head";
import { formatCurrency } from "@/helper";
import { toast } from "react-toastify";
import {
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaScaleBalanced,
  FaTableList,
  FaPiggyBank,
} from "react-icons/fa6";
import { MdFilterAltOff, MdLink } from "react-icons/md";
import ChartGraficLine from "@/component/chartgraficline";
import MetricCard from "@/component/metriccard";
import AiChatPrompts from "@/component/ai/AiChatPrompts";
import { Usuario } from "@/model/type";
import DebtByTypeDoughnut from "@/component/dashboard/DebtByTypeDoughnut";
import PaidOpenByTypeBar from "@/component/dashboard/PaidOpenByTypeBar";
import CumulativeBalanceLine from "@/component/dashboard/CumulativeBalanceLine";
import { copyTextToClipboard } from "@/utils/copyToClipboard";

export interface DataItem {
  mes: string;
  valortotal: number;
}

export interface DashboardSummary {
  totalEntradas: number;
  totalSaidasDividas: number;
  totalObjetivos: number;
  /** Soma das metas com desconta_entrada = true (afeta o saldo). */
  totalObjetivosDescontamEntrada?: number;
  saldoPeriodo: number;
  periodoInicio: string;
  periodoFim: string;
  quantidadeLancamentos: number;
}

export interface DashboardTransaction {
  id: number;
  description: string;
  date: string;
  value: number;
  type: "renda" | "divida" | "meta";
  categoria?: string;
  descontaEntrada?: boolean;
}

export interface DashboardData {
  rendas: DataItem[];
  dividas: DataItem[];
  metas: DataItem[];
  aligned?: {
    labels: string[];
    rendas: number[];
    dividas: number[];
    metas: number[];
  };
  summary?: DashboardSummary;
  transactions?: DashboardTransaction[];
  insights?: {
    byType: { tipo: string; total: number }[];
    paidVsOpenByType: { tipo: string; paid: number; open: number }[];
    cumulativeBalance: { day: string; balance: number }[];
    debtCommitment: number;
  };
}

interface DashboardChartProps {
  dashboarddata: DashboardData;
  usuario: Usuario;
}

function toYMD(d: Date) {
  return d.toISOString().split("T")[0];
}

function presetRange(preset: string): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  switch (preset) {
    case "30d":
      start.setDate(end.getDate() - 30);
      break;
    case "3m":
      start.setMonth(end.getMonth() - 3);
      break;
    case "6m":
      start.setMonth(end.getMonth() - 6);
      break;
    case "12m":
      start.setMonth(end.getMonth() - 12);
      break;
    case "ytd":
      start.setMonth(0);
      start.setDate(1);
      break;
    default:
      start.setMonth(end.getMonth() - 3);
  }
  return { start: toYMD(start), end: toYMD(end) };
}

const TYPE_LABEL: Record<DashboardTransaction["type"], string> = {
  renda: "Entrada",
  divida: "Dívida / gasto",
  meta: "Objetivo",
};

export default function Dashboard({
  dashboarddata,
  usuario,
}: DashboardChartProps) {
  const router = useRouter();
  const initializedFromQuery = useRef(false);
  const [graficoBarra, setGraficoBarra] = useState<DashboardData | null>(null);
  const [dateStart, setDateStart] = useState(
    dashboarddata?.summary?.periodoInicio ?? "",
  );
  const [dateEnd, setDateEnd] = useState(
    dashboarddata?.summary?.periodoFim ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [preset, setPreset] = useState<string>("3m");
  const [selectedDebtType, setSelectedDebtType] = useState<string>("all");

  useEffect(() => {
    setGraficoBarra(dashboarddata);
    if (dashboarddata?.summary?.periodoInicio) {
      setDateStart(dashboarddata.summary.periodoInicio);
    }
    if (dashboarddata?.summary?.periodoFim) {
      setDateEnd(dashboarddata.summary.periodoFim);
    }
  }, [dashboarddata]);

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query.debtType;
    const value = Array.isArray(q) ? q[0] : q;
    if (!value) {
      setSelectedDebtType("all");
      return;
    }
    setSelectedDebtType(decodeURIComponent(value));
  }, [router.isReady, router.query.debtType]);

  const syncPeriodQuery = (
    nextPreset: string,
    start: string,
    end: string,
  ) => {
    const nextQuery = { ...router.query };
    if (nextPreset === "custom") {
      nextQuery.start = start;
      nextQuery.end = end;
      delete nextQuery.preset;
    } else {
      nextQuery.preset = nextPreset;
      delete nextQuery.start;
      delete nextQuery.end;
    }
    router.replace(
      { pathname: router.pathname, query: nextQuery },
      undefined,
      { shallow: true },
    );
  };

  const handleFetch = useCallback(async (start: string, end: string) => {
    setLoading(true);
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.post(
        `/dashboard?initial=${start}&final=${end}`,
      );
      setGraficoBarra(response.data);
      setDateStart(response.data?.summary?.periodoInicio ?? start);
      setDateEnd(response.data?.summary?.periodoFim ?? end);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!router.isReady || initializedFromQuery.current) return;

    const qp = Array.isArray(router.query.preset)
      ? router.query.preset[0]
      : router.query.preset;
    const qs = Array.isArray(router.query.start)
      ? router.query.start[0]
      : router.query.start;
    const qe = Array.isArray(router.query.end)
      ? router.query.end[0]
      : router.query.end;

    if (qp) {
      initializedFromQuery.current = true;
      const { start, end } = presetRange(qp);
      setPreset(qp);
      setDateStart(start);
      setDateEnd(end);
      void handleFetch(start, end);
      return;
    }

    if (qs && qe) {
      initializedFromQuery.current = true;
      setPreset("custom");
      setDateStart(qs);
      setDateEnd(qe);
      void handleFetch(qs, qe);
      return;
    }

    initializedFromQuery.current = true;
  }, [
    router.isReady,
    router.query.preset,
    router.query.start,
    router.query.end,
    handleFetch,
  ]);

  const applyPreset = async (p: string) => {
    setPreset(p);
    const { start, end } = presetRange(p);
    syncPeriodQuery(p, start, end);
    await handleFetch(start, end);
  };

  const onCustomFilter = async () => {
    if (!dateStart || !dateEnd) return;
    setPreset("custom");
    syncPeriodQuery("custom", dateStart, dateEnd);
    await handleFetch(dateStart, dateEnd);
  };

  const summary = graficoBarra?.summary;

  const totals = useMemo(() => {
    const tr =
      graficoBarra?.rendas?.reduce((a, i) => a + i.valortotal, 0) ?? 0;
    const td =
      graficoBarra?.dividas?.reduce((a, i) => a + i.valortotal, 0) ?? 0;
    const tm =
      graficoBarra?.metas?.reduce((a, i) => a + i.valortotal, 0) ?? 0;
    return {
      entradas: summary?.totalEntradas ?? tr,
      saidas: summary?.totalSaidasDividas ?? td,
      objetivos: summary?.totalObjetivos ?? tm,
      metasDescontamSaldo: summary?.totalObjetivosDescontamEntrada,
      saldo:
        summary?.saldoPeriodo ??
        tr - td - (summary?.totalObjetivosDescontamEntrada ?? 0),
    };
  }, [graficoBarra, summary]);

  const anosText = 0;
  const mesesText = 0;

  const transactions = useMemo(
    () => graficoBarra?.transactions ?? [],
    [graficoBarra],
  );
  const byType = useMemo(
    () => graficoBarra?.insights?.byType ?? [],
    [graficoBarra],
  );
  const paidVsOpenByType = useMemo(
    () => graficoBarra?.insights?.paidVsOpenByType ?? [],
    [graficoBarra],
  );
  const cumulativeBalance = useMemo(
    () => graficoBarra?.insights?.cumulativeBalance ?? [],
    [graficoBarra],
  );
  const selectedDebtTotal =
    selectedDebtType === "all"
      ? totals.saidas
      : byType.find((i) => i.tipo === selectedDebtType)?.total ?? 0;
  const debtCommitment =
    totals.entradas > 0 ? (selectedDebtTotal / totals.entradas) * 100 : 0;
  const filteredByType =
    selectedDebtType === "all"
      ? byType
      : byType.filter((i) => i.tipo === selectedDebtType);
  const filteredPaidVsOpen =
    selectedDebtType === "all"
      ? paidVsOpenByType
      : paidVsOpenByType.filter((i) => i.tipo === selectedDebtType);
  const availableTypes = useMemo(() => new Set(byType.map((i) => i.tipo)), [byType]);

  useEffect(() => {
    if (selectedDebtType !== "all" && !availableTypes.has(selectedDebtType)) {
      setSelectedDebtType("all");
    }
  }, [selectedDebtType, availableTypes]);

  const applyDebtTypeFilter = (value: string) => {
    setSelectedDebtType(value);
    const nextQuery = { ...router.query };
    if (value === "all") {
      delete nextQuery.debtType;
    } else {
      nextQuery.debtType = encodeURIComponent(value);
    }
    router.replace(
      { pathname: router.pathname, query: nextQuery },
      undefined,
      { shallow: true },
    );
  };

  const resetFilters = async () => {
    const { start, end } = presetRange("3m");
    setPreset("3m");
    setDateStart(start);
    setDateEnd(end);
    setSelectedDebtType("all");
    await router.replace({ pathname: router.pathname, query: {} }, undefined, {
      shallow: true,
    });
    await handleFetch(start, end);
  };

  const handleCopyCurrentViewLink = async () => {
    if (typeof window === "undefined") return;
    const href = window.location.href;
    const ok = await copyTextToClipboard(href);
    if (ok) {
      toast.success("Link da visão atual copiado.");
    } else {
      toast.error("Não foi possível copiar o link.");
    }
  };
  const debtCommitmentLabel =
    debtCommitment >= 80
      ? "Crítico"
      : debtCommitment >= 60
        ? "Atenção"
        : "Saudável";

  const monthTrend = useMemo(() => {
    const aligned = graficoBarra?.aligned;
    if (!aligned?.rendas?.length || aligned.rendas.length < 2) return null;
    const mid = Math.floor(aligned.rendas.length / 2);
    const first = aligned.rendas.slice(0, mid).reduce((a, v) => a + v, 0);
    const second = aligned.rendas.slice(mid).reduce((a, v) => a + v, 0);
    if (first === 0) return null;
    return ((second - first) / first) * 100;
  }, [graficoBarra?.aligned]);

  const economia = Math.max(0, totals.saldo);

  return (
    <>
      <Head>
        <title>Visão geral | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <header className="space-y-1">
                <p className="text-sm font-medium uppercase tracking-wider text-dash">
                  Dashboard executivo
                </p>
                <h2 className="text-xl font-bold text-white md:text-2xl">
                  Visão financeira do período
                </h2>
                <p className="max-w-3xl text-sm text-cp-muted">
                  Receitas, despesas, saldo e evolução — tudo em tempo real.
                </p>
              </header>

              <AiChatPrompts />

              <section className="rounded-2xl border border-white/[0.08] bg-cp-card p-4 backdrop-blur-xl sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Período de análise
                    </h2>
                    <p className="mt-1 text-xs text-cp-subtle">
                      Atalhos rápidos ou datas personalizadas
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleCopyCurrentViewLink}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-cp-card px-4 py-2 text-xs font-semibold text-white/90 transition hover:bg-white/[0.06] sm:text-sm"
                    >
                      <MdLink className="h-4 w-4" />
                      Copiar link desta visão
                    </button>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20 sm:text-sm"
                    >
                      <MdFilterAltOff className="h-4 w-4" />
                      Resetar filtros
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        ["30d", "30 dias"],
                        ["3m", "3 meses"],
                        ["6m", "6 meses"],
                        ["12m", "12 meses"],
                        ["ytd", "Ano atual"],
                      ] as const
                    ).map(([id, label]) => (
                      <button
                        key={id}
                        type="button"
                        disabled={loading}
                        onClick={() => applyPreset(id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-medium transition sm:text-sm ${
                          preset === id
                            ? "bg-primary text-white shadow-lg shadow-brand-500/25"
                            : "bg-white/10 text-white/90 hover:bg-white/15"
                        } disabled:opacity-50`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-end">
                  <div className="flex flex-1 flex-col gap-1 sm:max-w-xs">
                    <label className="text-xs font-medium text-cp-muted">
                      Data inicial
                    </label>
                    <input
                      type="date"
                      value={dateStart.slice(0, 10)}
                      onChange={(e) => {
                        setDateStart(e.target.value);
                        setPreset("custom");
                      }}
                      className="rounded-xl border border-white/10 bg-cp-card-secondary/80 px-3 py-2 text-sm text-white shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1 sm:max-w-xs">
                    <label className="text-xs font-medium text-cp-muted">
                      Data final
                    </label>
                    <input
                      type="date"
                      value={dateEnd.slice(0, 10)}
                      onChange={(e) => {
                        setDateEnd(e.target.value);
                        setPreset("custom");
                      }}
                      className="rounded-xl border border-white/10 bg-cp-card-secondary/80 px-3 py-2 text-sm text-white shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <button
                    type="button"
                    disabled={loading || !dateStart || !dateEnd}
                    onClick={onCustomFilter}
                    className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/20 transition hover:bg-primary-hover disabled:opacity-50"
                  >
                    {loading ? "Carregando…" : "Aplicar datas"}
                  </button>
                </div>
              </section>

              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  title="Receitas"
                  subtitle="Entradas no período"
                  value={formatCurrency(totals.entradas)}
                  icon={FaArrowTrendUp}
                  variant="income"
                  trend={monthTrend ?? undefined}
                  trendLabel="Comparado à 1ª metade do período"
                />
                <MetricCard
                  title="Despesas"
                  subtitle={
                    selectedDebtType === "all"
                      ? "Dívidas e gastos"
                      : `Categoria: ${selectedDebtType}`
                  }
                  value={formatCurrency(selectedDebtTotal)}
                  icon={FaArrowTrendDown}
                  variant="expense"
                />
                <MetricCard
                  title="Saldo"
                  subtitle="Receitas − despesas − metas"
                  value={formatCurrency(totals.saldo)}
                  icon={FaScaleBalanced}
                  variant="balance"
                />
                <MetricCard
                  title="Economia"
                  subtitle="Saldo positivo acumulado"
                  value={formatCurrency(economia)}
                  icon={FaPiggyBank}
                  variant="savings"
                />
              </section>

              {byType.length > 0 && (
                <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-cp-muted">
                      Filtrar por tipo de dívida:
                    </span>
                    <button
                      type="button"
                      onClick={() => applyDebtTypeFilter("all")}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                        selectedDebtType === "all"
                          ? "bg-income/20 text-green-100"
                          : "bg-white/10 text-cp-muted hover:bg-white/15"
                      }`}
                    >
                      Todas
                    </button>
                    {byType.map((item) => (
                      <button
                        key={item.tipo}
                        type="button"
                        onClick={() => applyDebtTypeFilter(item.tipo)}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                          selectedDebtType === item.tipo
                            ? "bg-red-500/25 text-red-200"
                            : "bg-white/10 text-cp-muted hover:bg-white/15"
                        }`}
                      >
                        {item.tipo}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-cp-muted">
                      Comprometimento da renda
                    </p>
                    <p className="mt-1 text-2xl font-semibold text-white">
                      {debtCommitment.toFixed(1)}%
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      debtCommitment >= 80
                        ? "bg-red-500/20 text-red-300"
                        : debtCommitment >= 60
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-income/20 text-income"
                    }`}
                  >
                    {debtCommitmentLabel}
                  </span>
                </div>
                <p className="mt-2 text-xs text-cp-subtle">
                  Percentual do total de saídas sobre entradas no período.
                </p>
              </section>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-card backdrop-blur-sm sm:p-6">
                  <h3 className="text-base font-semibold text-white">
                    Comparativo mensal
                  </h3>
                  <p className="mt-1 text-xs text-cp-subtle">
                    Entradas vs compromissos vs valor em objetivos
                  </p>
                  <div className="mt-4">
                    {graficoBarra &&
                    (graficoBarra.rendas?.length > 0 ||
                      graficoBarra.dividas?.length > 0 ||
                      graficoBarra.metas?.length > 0) ? (
                      <ChartGrafic
                        data={graficoBarra}
                        anos={anosText}
                        meses={mesesText}
                      />
                    ) : (
                      <NotFound />
                    )}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-card backdrop-blur-sm sm:p-6">
                  <h3 className="text-base font-semibold text-white">
                    Evolução no tempo
                  </h3>
                  <p className="mt-1 text-xs text-cp-subtle">
                    Tendência das mesmas métricas ao longo dos meses
                  </p>
                  <div className="mt-4">
                    {graficoBarra &&
                    (graficoBarra.rendas?.length > 0 ||
                      graficoBarra.dividas?.length > 0 ||
                      graficoBarra.metas?.length > 0) ? (
                      <ChartGraficLine
                        data={graficoBarra}
                        anos={anosText}
                        meses={mesesText}
                      />
                    ) : (
                      <NotFound />
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-card backdrop-blur-sm sm:p-6">
                <h3 className="text-base font-semibold text-white">
                  Saldo acumulado no período
                </h3>
                <p className="mt-1 text-xs text-cp-subtle">
                  Evolução diária do saldo (entradas - saídas)
                </p>
                <div className="mt-4">
                  {cumulativeBalance.length > 0 ? (
                    <CumulativeBalanceLine items={cumulativeBalance} />
                  ) : (
                    <NotFound />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-card backdrop-blur-sm sm:p-6">
                  <h3 className="text-base font-semibold text-white">
                    Gastos por tipo
                  </h3>
                  <p className="mt-1 text-xs text-cp-subtle">
                    Distribuição das saídas por categoria no período
                  </p>
                  <div className="mt-4">
                    {filteredByType.length > 0 ? (
                      <DebtByTypeDoughnut items={filteredByType} />
                    ) : (
                      <NotFound />
                    )}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4 shadow-card backdrop-blur-sm sm:p-6">
                  <h3 className="text-base font-semibold text-white">
                    Pago x em aberto
                  </h3>
                  <p className="mt-1 text-xs text-cp-subtle">
                    Valor pago e pendente por tipo de dívida
                  </p>
                  <div className="mt-4">
                    {filteredPaidVsOpen.length > 0 ? (
                      <PaidOpenByTypeBar items={filteredPaidVsOpen} />
                    ) : (
                      <NotFound />
                    )}
                  </div>
                </div>
              </div>

              <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-card backdrop-blur-sm">
                <div className="flex flex-col gap-1 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex items-center gap-2">
                    <FaTableList className="text-cp-subtle" />
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Lançamentos recentes
                      </h3>
                      <p className="text-xs text-cp-subtle">
                        Últimos registros no período selecionado
                      </p>
                    </div>
                  </div>
                  {summary?.quantidadeLancamentos != null && (
                    <span className="text-xs text-cp-subtle">
                      {summary.quantidadeLancamentos} lançamento
                      {summary.quantidadeLancamentos !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/[0.08] bg-cp-base/40 text-xs uppercase tracking-wide text-cp-subtle">
                        <th className="px-4 py-3 font-medium sm:px-6">Data</th>
                        <th className="px-4 py-3 font-medium sm:px-6">
                          Descrição
                        </th>
                        <th className="px-4 py-3 font-medium sm:px-6">Natureza</th>
                        <th className="px-4 py-3 text-right font-medium sm:px-6">
                          Valor
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      {transactions.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-10 text-center text-cp-subtle"
                          >
                            Nenhum lançamento neste período. Cadastre entradas em{" "}
                            <strong className="text-cp-muted">Movimentações</strong>{" "}
                            (aba Entradas ou Saídas).
                          </td>
                        </tr>
                      ) : (
                        transactions.map((row) => (
                          <tr
                            key={`${row.type}-${row.id}`}
                            className="hover:bg-white/5"
                          >
                            <td className="whitespace-nowrap px-4 py-3 text-cp-muted sm:px-6">
                              {row.date
                                ? new Date(row.date + "T12:00:00").toLocaleDateString(
                                    "pt-BR",
                                  )
                                : "—"}
                            </td>
                            <td className="max-w-[220px] px-4 py-3 text-white sm:max-w-md sm:px-6">
                              <div className="truncate font-medium">{row.description}</div>
                              {row.type === "meta" && row.categoria ? (
                                <div className="mt-0.5 truncate text-xs text-cp-subtle">
                                  Categoria: {row.categoria}
                                </div>
                              ) : null}
                              {row.type === "meta" && row.descontaEntrada === false ? (
                                <div className="mt-0.5 text-xs text-amber-200/90">
                                  Não desconta do saldo
                                </div>
                              ) : null}
                            </td>
                            <td className="px-4 py-3 sm:px-6">
                              <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                  row.type === "renda"
                                    ? "bg-income/20 text-income"
                                    : row.type === "divida"
                                      ? "bg-red-500/20 text-red-300"
                                      : "bg-sky-500/20 text-sky-300"
                                }`}
                              >
                                {TYPE_LABEL[row.type]}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right font-medium tabular-nums text-white sm:px-6">
                              {formatCurrency(row.value)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const { start, end } = presetRange("3m");

  try {
    const dashboarddata = await apiClient.post(
      `/dashboard?initial=${start}&final=${end}`,
    );
    const user = await apiClient.get("/user/get");

    return {
      props: {
        dashboarddata: dashboarddata.data,
        usuario: user.data,
      },
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "erro";
    console.error("Erro ao carregar dashboard:", msg);
    return {
      redirect: {
        destination: "/movimentacoes",
        permanent: false,
      },
    };
  }
});
