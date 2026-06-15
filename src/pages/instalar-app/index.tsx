import Head from "next/head";
import Link from "next/link";
import PublicMarketingHeader from "@/component/layout/PublicMarketingHeader";
import { InstallAppContent } from "@/component/pwa/InstallAppContent";
import { MdArrowBack } from "react-icons/md";

export default function InstalarAppPage() {
  return (
    <>
      <Head>
        <title>Instalar app | Conta+</title>
        <meta
          name="description"
          content="Instale o Conta+ no celular: PWA pelo navegador ou APK para Android."
        />
      </Head>
      <div className="min-h-screen bg-cp-base text-white">
        <PublicMarketingHeader />
        <main className="mx-auto max-w-lg px-4 py-24 sm:py-28">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-1 text-sm text-cp-muted hover:text-white"
          >
            <MdArrowBack size={18} />
            Voltar
          </Link>
          <div className="rounded-2xl border border-white/[0.08] bg-cp-card p-6 shadow-card">
            <InstallAppContent variant="page" />
          </div>
          <p className="mt-6 text-center text-xs text-cp-subtle">
            Já instalou? Abra o ícone Conta+ na tela inicial e faça login.
          </p>
        </main>
      </div>
    </>
  );
}
