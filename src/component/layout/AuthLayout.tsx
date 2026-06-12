import Head from "next/head";
import Link from "next/link";
import { ReactNode } from "react";
import BrandLogo from "@/component/brand/BrandLogo";

type AuthLayoutProps = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthLayout({
  title,
  description,
  children,
  footer,
}: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-cp-base text-white">
      <Head>
        <title>{title}</title>
      </Head>
      <div
        className="pointer-events-none fixed -left-32 top-20 h-80 w-80 rounded-full bg-primary/20 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-24 top-24 h-72 w-72 rounded-full bg-ai/15 blur-[80px]"
        aria-hidden
      />

      <header className="relative z-10 border-b border-white/[0.06] bg-cp-base/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-3 sm:h-16 sm:px-6">
          <BrandLogo size="compact" className="sm:hidden" />
          <BrandLogo size="default" className="hidden sm:inline-flex" />
          <Link
            href="/signup"
            className="rounded-full px-3 py-2 text-xs font-medium text-cp-muted transition hover:bg-white/5 hover:text-primary sm:text-sm"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-lg flex-col px-3 py-6 pb-28 sm:justify-center sm:px-6 sm:py-10 sm:pb-10 sm:min-h-[calc(100vh-4rem)]">
        <div className="mb-5 text-center sm:mb-6">
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm leading-relaxed text-cp-muted sm:text-base">{description}</p>
          ) : null}
        </div>

        <div className="cp-card p-5 sm:p-8">{children}</div>

        {footer ?? (
          <p className="mt-6 text-center text-sm text-cp-subtle">
            Não tem conta?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary transition hover:text-primary-hover"
            >
              Criar conta grátis
            </Link>
          </p>
        )}
      </main>
    </div>
  );
}
