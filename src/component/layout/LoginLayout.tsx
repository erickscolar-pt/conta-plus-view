import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  MdAutoAwesome,
  MdBarChart,
  MdLogin,
  MdSecurity,
  MdShield,
  MdTrendingUp,
} from "react-icons/md";
import BrandLogo from "@/component/brand/BrandLogo";

type LoginLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

const BENEFITS = [
  { icon: MdBarChart, label: "Dashboard em tempo real", color: "text-dash" },
  { icon: MdAutoAwesome, label: "Coach IA financeiro", color: "text-ai" },
  { icon: MdTrendingUp, label: "Metas e projeções", color: "text-goals" },
];

export default function LoginLayout({ title, description, children }: LoginLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cp-base text-slate-100">
      <Head>
        <title>{title} | Conta+</title>
      </Head>

      <div
        className="pointer-events-none fixed -left-40 top-0 h-[520px] w-[520px] rounded-full bg-dash/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-32 top-32 h-96 w-96 rounded-full bg-ai/15 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/3 h-64 w-64 rounded-full bg-planning/10 blur-[80px]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-screen flex-col lg:flex-row">
        <aside className="relative hidden w-full flex-col justify-between border-r border-white/[0.06] bg-gradient-to-br from-cp-card via-cp-base to-[#140E12] px-10 py-10 lg:flex lg:max-w-[46%] xl:max-w-[42%]">
          <div>
            <BrandLogo size="hero" href="/" />

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-14"
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-dash/30 bg-dash/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-dash">
                <MdLogin size={14} />
                Bem-vindo de volta
              </p>
              <h1 className="mt-6 text-balance text-3xl font-bold leading-tight tracking-tight text-white xl:text-4xl">
                Suas finanças te esperam.
              </h1>
              <p className="mt-4 max-w-md text-pretty text-base leading-relaxed text-cp-muted">
                Entre com seu e-mail ou usuário e continue de onde parou — dashboard, metas e
                consultor IA.
              </p>
            </motion.div>

            <ul className="mt-10 space-y-3">
              {BENEFITS.map(({ icon: Icon, label, color }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] ${color}`}
                  >
                    <Icon size={20} />
                  </span>
                  <span className="text-sm font-medium text-slate-200">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 text-xs text-cp-subtle">
            <span className="flex items-center gap-1.5">
              <MdShield className="text-primary" size={16} />
              Dados criptografados
            </span>
            <span className="flex items-center gap-1.5">
              <MdSecurity className="text-dash" size={16} />
              LGPD
            </span>
            <Link href="/" className="font-medium text-cp-muted transition hover:text-white">
              ← Voltar ao site
            </Link>
          </div>
        </aside>

        <div className="flex flex-1 flex-col bg-cp-base">
          <header className="flex h-14 items-center justify-between gap-2 border-b border-white/[0.06] bg-cp-base/90 px-3 backdrop-blur-xl sm:px-8 lg:hidden">
            <BrandLogo size="compact" href="/" />
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="rounded-full px-2.5 py-2 text-xs font-medium text-cp-muted transition hover:bg-white/5 hover:text-white sm:px-3 sm:text-sm"
              >
                Início
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary/15 px-2.5 py-2 text-xs font-semibold text-brand-300 transition hover:bg-primary/25 sm:px-3 sm:text-sm"
              >
                Criar conta
              </Link>
            </div>
          </header>

          <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-3 py-5 pb-28 sm:px-8 sm:py-10 sm:pb-12 lg:justify-center">
            <div className="mb-5 rounded-2xl border border-white/[0.08] bg-cp-card/60 p-4 lg:hidden">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-dash">
                Bem-vindo de volta
              </p>
              <h1 className="mt-1.5 text-lg font-bold leading-snug text-white">
                Suas finanças te esperam.
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-cp-muted">
                Entre e continue organizando receitas, despesas e metas.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <div className="mb-5 lg:mb-8">
                <h2 className="text-xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
                {description ? (
                  <p className="mt-2 text-sm leading-relaxed text-cp-muted sm:text-base">
                    {description}
                  </p>
                ) : null}
              </div>

              <div className="rounded-2xl border border-white/[0.08] bg-cp-card/90 p-5 shadow-card backdrop-blur-xl sm:p-8">
                {children}
              </div>
            </motion.div>

            <p className="mt-6 text-center text-sm text-cp-subtle sm:mt-8">
              Não tem conta?{" "}
              <Link
                href="/signup"
                className="font-semibold text-primary transition hover:text-primary-hover"
              >
                Criar conta grátis
              </Link>
            </p>

            <p className="mt-4 text-center lg:hidden">
              <Link
                href="/"
                className="text-sm font-medium text-cp-subtle transition hover:text-white"
              >
                ← Voltar para a página inicial
              </Link>
            </p>
          </main>
        </div>
      </div>
    </div>
  );
}
