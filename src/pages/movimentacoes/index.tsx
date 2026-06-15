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
import MetricCard from "@/component/metriccard";
import {
  FaArrowTrendDown,
  FaArrowTrendUp,
  FaScaleBalanced,
} from "react-icons/fa6";

type TabId = "entradas" | "saidas";

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

export default function Movimentacoes({
  rendas: initialRendas,
  dividas: initialDividas,
  usuario,
  tipodivida,
}: PageProps) {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("entradas");
  const [kpiRendas, setKpiRendas] = useState(initialRendas);
  const [kpiDividas, setKpiDividas] = useState(initialDividas);

  useEffect(() => {
    const q = router.query.tab as string | undefined;
    if (q === "saidas" || q === "gastos") setTab("saidas");
    else if (q === "entradas" || q === "ganhos") setTab("entradas");
  }, [router.query.tab]);

  const refreshKpis = useCallback(async () => {
    const api = setupAPIClient();
    try {
      const [r, d] = await Promise.all([
        api.get("/rendas"),
        api.get("/dividas"),
      ]);
      setKpiRendas(r.data);
      setKpiDividas(d.data);
    } catch {
      /* ignore */
    }
  }, []);

  const totalEntradas = useMemo(
    () => sumEntradas(kpiRendas),
    [kpiRendas],
  );
  const totalSaidas = useMemo(
    () => sumSaidas(kpiDividas),
    [kpiDividas],
  );
  const saldo = totalEntradas - totalSaidas;

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
                  Entradas e saídas no mesmo lugar: veja o saldo e alterne entre
                  abas para lançar ou revisar cada lado.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
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
                  title="Saldo"
                  subtitle="Entradas − saídas"
                  value={formatCurrency(saldo)}
                  icon={FaScaleBalanced}
                  variant={saldo >= 0 ? "income" : "expense"}
                />
              </div>

              <div
                className="inline-flex rounded-2xl border border-white/[0.08] bg-cp-card p-1 shadow-card"
                role="tablist"
                aria-label="Alternar entre entradas e saídas"
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
              </div>

              {tab === "entradas" && (
                <GanhosPanel
                  rendas={initialRendas}
                  usuario={usuario}
                  embedded
                  onDataMutated={refreshKpis}
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
