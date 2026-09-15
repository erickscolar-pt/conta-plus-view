import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { formatCurrency } from "@/helper";
import {
  Dividas,
  ITipoDivida,
  Rendas,
  Usuario,
} from "@/model/type";
import GanhosPanel from "@/component/movimentacoes/GanhosPanel";
import GastosPanel from "@/component/movimentacoes/GastosPanel";
import TransferenciasPanel from "@/component/movimentacoes/TransferenciasPanel";
import MetricCard from "@/component/metriccard";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaScaleBalanced,
} from "react-icons/fa6";
import { MdSwapHoriz } from "react-icons/md";
import { listarTransferencias } from "@/services/transferencias";

type TabId = "entradas" | "saidas" | "transferencias";

interface PageProps {
  rendas: Rendas[];
  dividas: Dividas[];
  usuario: Usuario;
  tipodivida: ITipoDivida[];
}

function sumEntradas(list: Rendas[]) {
  return list.reduce((a, r) => a + (r.valor || 0), 0);
}

function sumSaidas(list: Dividas[]) {
  return list.reduce((a, d) => a + (d.quantoVouPagar || 0), 0);
}

function parseTab(value: string | string[] | undefined): TabId | null {
  const q = Array.isArray(value) ? value[0] : value;
  if (q === "saidas" || q === "gastos") return "saidas";
  if (q === "entradas" || q === "ganhos") return "entradas";
  if (q === "transferencias") return "transferencias";
  return null;
}

export default function Movimentacoes({
  rendas: initialRendas,
  dividas: initialDividas,
  usuario,
  tipodivida,
}: PageProps) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>(
    () => parseTab(router.query.tab) ?? "entradas",
  );
  const [kpiRendas, setKpiRendas] = useState(initialRendas);
  const [kpiDividas, setKpiDividas] = useState(initialDividas);
  const [kpiTransferSaldo, setKpiTransferSaldo] = useState(0);
  const [entradaSignal, setEntradaSignal] = useState(0);
  const [saidaSignal, setSaidaSignal] = useState(0);
  const [transferSignal, setTransferSignal] = useState(0);
  const [listRefreshKey, setListRefreshKey] = useState(0);

  useEffect(() => {
    const nextTab = parseTab(router.query.tab);
    if (nextTab) setTab(nextTab);

    const nova = router.query.nova;
    if (nova !== "1") return;

    const kind = nextTab ?? tab;
    if (kind === "saidas") setSaidaSignal((n) => n + 1);
    else if (kind === "transferencias") setTransferSignal((n) => n + 1);
    else setEntradaSignal((n) => n + 1);

    const query = { ...router.query };
    delete query.nova;
    void router.replace(
      { pathname: "/movimentacoes", query },
      undefined,
      { shallow: true },
    );
  }, [router.query.tab, router.query.nova]);

  const refreshKpis = useCallback(async () => {
    const api = setupAPIClient();
    const now = new Date();
    const periodStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const periodEnd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(last).padStart(2, "0")}`;
    try {
      const [r, d, t] = await Promise.all([
        api.get("/rendas"),
        api.get("/dividas"),
        listarTransferencias({ periodStart, periodEnd, limit: 200 }),
      ]);
      setKpiRendas(r.data);
      setKpiDividas(d.data);
      setKpiTransferSaldo(t.totals.saldo);
      setListRefreshKey((n) => n + 1);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    void refreshKpis();
  }, [refreshKpis]);

  const totalEntradas = useMemo(
    () => sumEntradas(kpiRendas),
    [kpiRendas],
  );
  const totalSaidas = useMemo(
    () => sumSaidas(kpiDividas),
    [kpiDividas],
  );
  const saldo = totalEntradas - totalSaidas + kpiTransferSaldo;

  const setTabAndUrl = (t: TabId) => {
    setTab(t);
    router.replace(
      { pathname: "/movimentacoes", query: { tab: t } },
      undefined,
      { shallow: true },
    );
  };

  return (
    <>
      <Head>
        <title>Movimentações | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-4 sm:px-6 md:px-10 md:py-8">
            <div className="mx-auto max-w-7xl min-w-0 space-y-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-dash">
                  Fluxo de caixa
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight text-white md:text-3xl">
                  Movimentações
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-cp-muted md:text-base">
                  Entradas, saídas e transferências entre pessoas conectadas —
                  a transferência não conta como receita nem despesa.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  title="Entradas (tudo)"
                  value={formatCurrency(totalEntradas)}
                  icon={FaArrowTrendUp}
                  variant="income"
                />
                <MetricCard
                  title="Saídas (compromissos)"
                  value={formatCurrency(totalSaidas)}
                  icon={FaArrowTrendDown}
                  variant="expense"
                />
                <MetricCard
                  title="Transferências"
                  subtitle="Recebidas − enviadas"
                  value={formatCurrency(kpiTransferSaldo)}
                  icon={MdSwapHoriz}
                  variant="balance"
                />
                <MetricCard
                  title="Saldo"
                  subtitle="Entradas − saídas ± transferências"
                  value={formatCurrency(saldo)}
                  icon={FaScaleBalanced}
                  variant={saldo >= 0 ? "income" : "expense"}
                />
              </div>

              <div
                className="inline-flex max-w-full flex-wrap rounded-2xl border border-white/[0.08] bg-cp-card p-1 shadow-card"
                role="tablist"
                aria-label="Alternar entre entradas, saídas e transferências"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "entradas"}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-6 ${
                    tab === "entradas"
                      ? "bg-income/20 text-green-100 ring-1 ring-income/30"
                      : "text-cp-muted hover:text-white"
                  }`}
                  onClick={() => setTabAndUrl("entradas")}
                >
                  Entradas
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "saidas"}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-6 ${
                    tab === "saidas"
                      ? "bg-expense/20 text-red-100 ring-1 ring-expense/30"
                      : "text-cp-muted hover:text-white"
                  }`}
                  onClick={() => setTabAndUrl("saidas")}
                >
                  Saídas
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "transferencias"}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-6 ${
                    tab === "transferencias"
                      ? "bg-primary/20 text-primary ring-1 ring-primary/30"
                      : "text-cp-muted hover:text-white"
                  }`}
                  onClick={() => setTabAndUrl("transferencias")}
                >
                  Transferências
                </button>
              </div>

              {tab === "entradas" && (
                <GanhosPanel
                  rendas={initialRendas}
                  usuario={usuario}
                  embedded
                  onDataMutated={refreshKpis}
                  openCreateSignal={entradaSignal}
                />
              )}
              {tab === "saidas" && (
                <GastosPanel
                  dividas={initialDividas}
                  rendas={initialRendas}
                  usuario={usuario}
                  tipodivida={tipodivida}
                  embedded
                  onDataMutated={refreshKpis}
                  openCreateSignal={saidaSignal}
                  refreshKey={listRefreshKey}
                />
              )}
              {tab === "transferencias" && (
                <TransferenciasPanel
                  embedded
                  onDataMutated={refreshKpis}
                  openCreateSignal={transferSignal}
                />
              )}
            </div>
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  try {
    const user = await apiClient.get("/user/get");
    if (!user.data) {
      return {
        redirect: { destination: "/", permanent: false },
      };
    }
    const [rendas, dividas, tipodivida] = await Promise.all([
      apiClient.get("/rendas"),
      apiClient.get("/dividas"),
      apiClient.get("/dividas/types"),
    ]);
    return {
      props: {
        rendas: rendas.data,
        dividas: dividas.data,
        usuario: user.data,
        tipodivida: tipodivida.data,
      },
    };
  } catch (error) {
    console.error("movimentacoes:", error);
    return {
      redirect: { destination: "/login", permanent: false },
    };
  }
});
