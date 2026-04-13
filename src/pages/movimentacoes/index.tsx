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
        <main className="relative flex-1 overflow-y-auto px-3 py-4 sm:px-6 md:px-10 md:py-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
                  Movimentações
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-400 md:text-base">
                  Entradas e saídas no mesmo lugar: veja o saldo e alterne entre
                  abas para lançar ou revisar cada lado.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <FaArrowTrendUp className="opacity-90" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Entradas (tudo)
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-semibold tabular-nums text-emerald-100">
                    {formatCurrency(totalEntradas)}
                  </p>
                </div>
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-red-300">
                    <FaArrowTrendDown className="opacity-90" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Saídas (compromissos)
                    </span>
                  </div>
                  <p className="mt-2 text-xl font-semibold tabular-nums text-red-100">
                    {formatCurrency(totalSaidas)}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <FaScaleBalanced className="opacity-90" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      Saldo (entradas − saídas)
                    </span>
                  </div>
                  <p
                    className={`mt-2 text-xl font-semibold tabular-nums ${
                      saldo >= 0 ? "text-emerald-300" : "text-red-300"
                    }`}
                  >
                    {formatCurrency(saldo)}
                  </p>
                </div>
              </div>

              <div
                className="inline-flex rounded-2xl border border-white/10 bg-white/5 p-1 shadow-sm backdrop-blur-sm"
                role="tablist"
                aria-label="Tipo de movimentação"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === "entradas"}
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition sm:px-6 ${
                    tab === "entradas"
                      ? "bg-emerald-500/25 text-emerald-100 shadow-inner shadow-emerald-500/10"
                      : "text-slate-400 hover:text-white"
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
                      ? "bg-red-500/25 text-red-100 shadow-inner shadow-red-500/10"
                      : "text-slate-400 hover:text-white"
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
      redirect: { destination: "/", permanent: false },
    };
  }
});
