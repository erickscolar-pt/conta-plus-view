import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import imgLogo from "../../../public/logo_login.png";

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
    <div className="relative min-h-screen overflow-hidden bg-cp-base text-white">
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

      <header className="relative z-10 border-b border-white/[0.06] bg-cp-base/80 backdrop-blur-xl">
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
          <Link
            href="/signup"
            className="text-xs font-medium text-cp-muted transition hover:text-primary"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-2 text-sm text-cp-muted sm:text-base">{description}</p>
          ) : null}
        </div>

        <div className="cp-card p-6 sm:p-8">{children}</div>

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
