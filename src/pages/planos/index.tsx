import Head from "next/head";
import LoggedLayout from "@/component/layout/LoggedLayout";
import SubscriptionPlanPanel from "@/component/billing/SubscriptionPlanPanel";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { Usuario } from "@/model/type";
import { motion } from "framer-motion";

type Props = { usuario: Usuario };

export default function PlanosPage({ usuario }: Props) {
  return (
    <>
      <Head>
        <title>Planos | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-medium uppercase tracking-wider text-ai">
                Premium
              </p>
              <h1 className="mt-1 text-2xl font-bold text-white md:text-3xl">
                Escolha seu plano
              </h1>
              <p className="mt-2 text-sm text-cp-muted">
                Assine ou altere o ciclo (mensal/anual) via PIX. Para voltar ao gratuito, aguarde o
                vencimento do Premium.
              </p>
            </motion.div>
            <SubscriptionPlanPanel usuario={usuario} variant="full" showTitle={false} />
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const { data: usuario } = await apiClient.get<Usuario>("/user/get");
  return { props: { usuario } };
});
