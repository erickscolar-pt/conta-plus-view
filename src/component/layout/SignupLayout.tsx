import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import imgLogo from "../../../public/logo_login.png";

type SignupLayoutProps = {
  title: string;
  description?: string;
  step: number;
  totalSteps: number;
  children: ReactNode;
  /** Oculta o rodapé "Já tem conta?" (ex.: tela de sucesso) */
  hideFooter?: boolean;
};

export default function SignupLayout({
  title,
  description,
  step,
  totalSteps,
  children,
  hideFooter = false,
}: SignupLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <Head>
        <title>{title}</title>
      </Head>
      <div
        className="pointer-events-none fixed -left-32 top-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-24 top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-[80px]"
        aria-hidden
      />

      <header className="relative z-10 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-lg items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={imgLogo}
              alt="Conta+"
              width={140}
              height={40}
              className="h-9 w-auto sm:h-10"
              priority
            />
          </Link>
          <span className="text-xs font-medium text-slate-400">
            Etapa {step} de {totalSteps}
          </span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm text-slate-400 sm:text-base">{description}</p>
          ) : null}
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur-md sm:p-8">
          {children}
        </div>

        {!hideFooter ? (
          <p className="mt-6 text-center text-sm text-slate-500">
            Já tem conta?{" "}
            <Link
              href="/"
              className="font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              Entrar
            </Link>
          </p>
        ) : null}
      </main>
    </div>
  );
}
