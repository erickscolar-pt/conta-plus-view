import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { MdArrowBack, MdGavel } from "react-icons/md";
import BrandLogo from "@/component/brand/BrandLogo";
import { LEGAL_NAV } from "@/component/doc/legalNav";

type PublicDocLayoutProps = {
  title: string;
  heading: string;
  description: ReactNode;
  lastUpdated?: string;
  children: ReactNode;
};

export default function PublicDocLayout({
  title,
  heading,
  description,
  lastUpdated,
  children,
}: PublicDocLayoutProps) {
  const router = useRouter();
  const pathname = router.pathname;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cp-base text-slate-100">
      <Head>
        <title>{title}</title>
      </Head>

      <div
        className="pointer-events-none fixed -left-40 top-0 h-[480px] w-[480px] rounded-full bg-dash/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-32 top-32 h-96 w-96 rounded-full bg-ai/10 blur-[100px]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden w-full flex-col border-r border-white/[0.06] bg-gradient-to-br from-cp-card via-cp-base to-[#140E12] lg:flex lg:max-w-[320px] xl:max-w-[360px]">
          <div className="flex flex-1 flex-col px-6 py-8 xl:px-8">
            <BrandLogo size="hero" href="/" />

            <div className="mt-10">
              <p className="inline-flex items-center gap-2 rounded-full border border-dash/30 bg-dash/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-dash">
                <MdGavel size={14} />
                Documentos legais
              </p>
              <p className="mt-4 text-sm leading-relaxed text-cp-muted">
                Transparência sobre termos, privacidade, cookies e uso da plataforma Conta+.
              </p>
            </div>

            <nav className="mt-8 space-y-1" aria-label="Documentos legais">
              {LEGAL_NAV.map(({ href, label, description: desc, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-start gap-3 rounded-xl px-3 py-3 transition ${
                      active
                        ? "bg-sidebar-active text-dash ring-1 ring-dash/20"
                        : "text-cp-muted hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`mt-0.5 shrink-0 ${active ? "text-dash" : "text-cp-subtle"}`}
                    />
                    <span>
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="mt-0.5 block text-xs text-cp-subtle">{desc}</span>
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-cp-muted transition hover:text-white"
              >
                <MdArrowBack size={16} />
                Voltar ao site
              </Link>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-white/[0.06] bg-cp-base/90 px-3 backdrop-blur-xl sm:px-6 lg:hidden">
            <BrandLogo size="compact" href="/" />
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-xs font-medium text-cp-muted transition hover:bg-white/5 hover:text-white sm:text-sm"
            >
              Início
            </Link>
          </header>

          <main className="mx-auto w-full max-w-3xl flex-1 px-3 py-6 pb-28 sm:px-6 sm:py-10 sm:pb-12">
            <nav
              className="mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden [-webkit-overflow-scrolling:touch]"
              aria-label="Navegação entre documentos"
            >
              {LEGAL_NAV.map(({ href, label }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      active
                        ? "bg-dash/20 text-dash ring-1 ring-dash/25"
                        : "border border-white/[0.08] bg-cp-card/60 text-cp-muted hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <header className="mb-8 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-cp-card via-cp-card/80 to-dash/5 p-5 sm:p-8">
                <span className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary sm:text-xs">
                  Documento oficial
                </span>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-4xl">
                  {heading}
                </h1>
                <div className="mt-3 max-w-2xl text-sm leading-relaxed text-cp-muted sm:text-base">
                  {description}
                </div>
                {lastUpdated ? (
                  <p className="mt-4 text-xs text-cp-subtle">Última atualização: {lastUpdated}</p>
                ) : null}
              </header>

              <div className="space-y-4">{children}</div>

              <footer className="mt-10 flex flex-col gap-3 border-t border-white/[0.06] pt-8 sm:flex-row sm:items-center sm:justify-between">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-cp-muted transition hover:text-white"
                >
                  <MdArrowBack size={16} />
                  Voltar para a página inicial
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-dash to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
                >
                  Criar conta grátis
                </Link>
              </footer>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
