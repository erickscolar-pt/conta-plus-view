import Head from "next/head";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import GastosPanel from "@/component/movimentacoes/GastosPanel";
import DebtCard from "@/component/dividas/DebtCard";
import PremiumCard from "@/component/ui/PremiumCard";
import { Dividas, ITipoDivida, Rendas, Usuario } from "@/model/type";
import { formatCurrency } from "@/helper";
import { motion } from "framer-motion";

interface Props {
  dividas: Dividas[];
  rendas: Rendas[];
  usuario: Usuario;
  tipodivida: ITipoDivida[];
}

export default function DividasPage({ dividas, rendas, usuario, tipodivida }: Props) {
  const total = dividas.reduce((a, d) => a + d.valor, 0);
  const paid = dividas.filter((d) => d.payment).length;
  const pending = dividas.length - paid;

  return (
    <>
      <Head>
        <title>Dívidas | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-medium uppercase tracking-wider text-expense">Dívidas</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Controle de compromissos</h2>
              <p className="mt-1 text-sm text-cp-muted">
                Acompanhe parcelas, status e valores em aberto.
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-3">
              <PremiumCard className="p-4">
                <p className="text-xs text-cp-subtle">Total</p>
                <p className="mt-1 text-xl font-bold text-white">{formatCurrency(total)}</p>
              </PremiumCard>
              <PremiumCard className="p-4">
                <p className="text-xs text-cp-subtle">Pagas</p>
                <p className="mt-1 text-xl font-bold text-income">{paid}</p>
              </PremiumCard>
              <PremiumCard className="p-4">
                <p className="text-xs text-cp-subtle">Pendentes</p>
                <p className="mt-1 text-xl font-bold text-amber-300">{pending}</p>
              </PremiumCard>
            </div>

            {dividas.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {dividas.slice(0, 6).map((d) => (
                  <DebtCard key={d.id} debt={d} />
                ))}
              </div>
            )}

            <PremiumCard className="p-4 sm:p-6">
              <GastosPanel
                dividas={dividas}
                rendas={rendas}
                usuario={usuario}
                tipodivida={tipodivida}
              />
            </PremiumCard>
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
    const dividas = await apiClient.get("/dividas");
    const tipodivida = await apiClient.get("/dividas/types");
    const rendas = await apiClient.get("/rendas");
    return {
      props: {
        dividas: dividas.data,
        rendas: rendas.data,
        usuario: user.data,
        tipodivida: tipodivida.data,
      },
    };
  } catch {
    return { redirect: { destination: "/movimentacoes", permanent: false } };
  }
});
