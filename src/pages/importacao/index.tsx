import Head from "next/head";
import { useRouter } from "next/router";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { Usuario } from "@/model/type";
import PremiumCard from "@/component/ui/PremiumCard";
import { motion } from "framer-motion";
import {
  MdCloudUpload,
  MdAutoFixHigh,
  MdFactCheck,
  MdCheckCircle,
} from "react-icons/md";
import Link from "next/link";

const STEPS = [
  { icon: MdCloudUpload, title: "Upload", desc: "Arraste seu extrato ou planilha" },
  { icon: MdAutoFixHigh, title: "Processamento", desc: "IA lê e categoriza lançamentos" },
  { icon: MdFactCheck, title: "Validação", desc: "Revise antes de confirmar" },
  { icon: MdCheckCircle, title: "Importação", desc: "Dados entram no seu painel" },
];

export default function ImportacaoPage({ usuario }: { usuario: Usuario }) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Importar Extrato | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-8">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-sm font-medium uppercase tracking-wider text-dash">Importação</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Importe em segundos</h2>
              <p className="mt-2 text-sm text-cp-muted">
                Excel, CSV, OFX ou PDF bancário — fluxo visual e seguro.
              </p>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2">
              {STEPS.map(({ icon: Icon, title, desc }, i) => (
                <PremiumCard key={title} className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-dash/15 text-dash">
                      <Icon size={22} />
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-cp-subtle">Passo {i + 1}</p>
                      <p className="font-semibold text-white">{title}</p>
                      <p className="mt-0.5 text-xs text-cp-muted">{desc}</p>
                    </div>
                  </div>
                </PremiumCard>
              ))}
            </div>

            <PremiumCard glow="green" className="p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-dash/15 text-dash">
                <MdCloudUpload size={32} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-white">
                Arraste seu arquivo aqui
              </h3>
              <p className="mt-2 text-sm text-cp-muted">
                .xlsx · .xls · .csv · .ofx · .pdf
              </p>
              <button
                type="button"
                onClick={() => void router.push("/importacao?open=1")}
                className="mt-6 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
              >
                Selecionar arquivo
              </button>
              <p className="mt-4 text-xs text-cp-subtle">
                <Link href="/importreport" className="text-dash hover:underline">
                  Ver guia de importação
                </Link>
              </p>
            </PremiumCard>
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const user = await apiClient.get("/user/get");
  return { props: { usuario: user.data } };
});
