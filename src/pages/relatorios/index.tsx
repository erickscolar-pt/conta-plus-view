import Head from "next/head";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { useMemo, useState } from "react";
import { formatCurrency } from "@/helper";
import { Usuario } from "@/model/type";
import PremiumCard from "@/component/ui/PremiumCard";
import MetricCard from "@/component/metriccard";
import ChartGraficLine from "@/component/chartgraficline";
import DebtByTypeDoughnut from "@/component/dashboard/DebtByTypeDoughnut";
import { FaArrowTrendDown, FaArrowTrendUp, FaScaleBalanced, FaFileExport } from "react-icons/fa6";
import { exportDashboardCsv, exportDashboardPdf } from "@/utils/exportReport";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import type { DashboardData } from "@/pages/dashboard/index";

function presetRange() {
  const end = new Date();
  const start = new Date();
  start.setMonth(end.getMonth() - 3);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export default function RelatoriosPage({
  dashboarddata,
  usuario,
}: {
  dashboarddata: DashboardData;
  usuario: Usuario;
}) {
  const [data] = useState(dashboarddata);
  const summary = data.summary;
  const totals = useMemo(() => {
    const tr = data.rendas?.reduce((a, i) => a + i.valortotal, 0) ?? 0;
    const td = data.dividas?.reduce((a, i) => a + i.valortotal, 0) ?? 0;
    return {
      entradas: summary?.totalEntradas ?? tr,
      saidas: summary?.totalSaidasDividas ?? td,
      saldo: summary?.saldoPeriodo ?? tr - td,
    };
  }, [data, summary]);

  const periodLabel = summary
    ? `${summary.periodoInicio} — ${summary.periodoFim}`
    : "Últimos 3 meses";

  function handleExportExcel() {
    try {
      exportDashboardCsv(data, periodLabel);
      toast.success("Relatório CSV exportado.");
    } catch {
      toast.error("Não foi possível exportar o relatório.");
    }
  }

  function handleExportPdf() {
    try {
      exportDashboardPdf(data, periodLabel);
    } catch {
      toast.error("Não foi possível abrir o PDF.");
    }
  }

  return (
    <>
      <Head>
        <title>Relatórios | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-medium uppercase tracking-wider text-planning">Relatórios</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Analytics financeiro</h2>
              <p className="mt-1 text-sm text-cp-muted">KPIs, gráficos e exportação.</p>
            </motion.div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleExportExcel}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-cp-card px-4 py-2 text-sm text-cp-muted transition hover:text-white"
              >
                <FaFileExport /> Exportar Excel (CSV)
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-cp-card px-4 py-2 text-sm text-cp-muted transition hover:text-white"
              >
                <FaFileExport /> Exportar PDF
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <MetricCard
                title="Receitas"
                value={formatCurrency(totals.entradas)}
                icon={FaArrowTrendUp}
                variant="income"
              />
              <MetricCard
                title="Despesas"
                value={formatCurrency(totals.saidas)}
                icon={FaArrowTrendDown}
                variant="expense"
              />
              <MetricCard
                title="Saldo"
                value={formatCurrency(totals.saldo)}
                icon={FaScaleBalanced}
                variant="balance"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <PremiumCard className="p-4 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold text-white">Evolução financeira</h3>
                <ChartGraficLine data={data} anos={0} meses={0} />
              </PremiumCard>
              <PremiumCard className="p-4 sm:p-6">
                <h3 className="mb-4 text-sm font-semibold text-white">Despesas por categoria</h3>
                <DebtByTypeDoughnut items={data.insights?.byType ?? []} />
              </PremiumCard>
            </div>
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const { start, end } = presetRange();
  try {
    const dashboarddata = await apiClient.post(`/dashboard?initial=${start}&final=${end}`);
    const user = await apiClient.get("/user/get");
    return {
      props: { dashboarddata: dashboarddata.data, usuario: user.data },
    };
  } catch {
    return { redirect: { destination: "/dashboard", permanent: false } };
  }
});
