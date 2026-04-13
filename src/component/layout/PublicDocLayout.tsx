import Head from "next/head";
import { ReactNode } from "react";
import HeaderAviso from "@/component/headeraviso";

type PublicDocLayoutProps = {
  title: string;
  children: ReactNode;
};

export default function PublicDocLayout({ title, children }: PublicDocLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div
        className="pointer-events-none fixed -left-32 top-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-24 top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[80px]"
        aria-hidden
      />
      <Head>
        <title>{title}</title>
      </Head>
      <HeaderAviso />
      <main className="relative z-10 mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="mb-4">
          <span className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200 shadow-sm shadow-emerald-500/20">
            Documento oficial
          </span>
        </section>
        <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-md transition-colors duration-300 sm:p-8">
          {children}
        </section>
      </main>
    </div>
  );
}

