import Link from "next/link";
import { useEffect, useState } from "react";
import { MdClose, MdMenu } from "react-icons/md";
import BrandLogo from "@/component/brand/BrandLogo";

const NAV_LINKS = [
  { href: "#gratis", label: "Grátis" },
  { href: "#consultor-ia", label: "Consultor IA" },
  { href: "#planos", label: "Planos" },
] as const;

type Props = {
  onLoginClick?: () => void;
};

export default function PublicMarketingHeader({ onLoginClick }: Props) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, []);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileNavOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.08] bg-cp-base/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-6">
        <BrandLogo size="default" className="min-w-0 shrink" />

        <nav className="hidden items-center gap-6 text-sm text-cp-muted md:flex">
          {NAV_LINKS.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {onLoginClick ? (
            <button
              type="button"
              onClick={onLoginClick}
              className="rounded-full px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 sm:px-4 sm:text-sm"
            >
              Entrar
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full px-2.5 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 sm:px-4 sm:text-sm"
            >
              Entrar
            </Link>
          )}
          <Link
            href="/signup"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-primary-hover sm:inline-flex sm:px-5"
          >
            Criar conta grátis
          </Link>
          <button
            type="button"
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMobileNavOpen((open) => !open)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-slate-200 md:hidden"
          >
            {mobileNavOpen ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
        </div>
      </div>

      {mobileNavOpen && (
        <>
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 top-14 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileNavOpen(false)}
          />
          <nav className="relative z-50 border-t border-white/[0.08] bg-cp-base/98 px-3 py-3 md:hidden">
            <div className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-cp-muted transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              {onLoginClick ? (
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    onLoginClick();
                  }}
                  className="rounded-lg px-3 py-2.5 text-left text-sm text-cp-muted transition hover:bg-white/5 hover:text-white"
                >
                  Entrar
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-cp-muted transition hover:bg-white/5 hover:text-white"
                >
                  Entrar
                </Link>
              )}
              <Link
                href="/signup"
                onClick={() => setMobileNavOpen(false)}
                className="mt-1 rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-semibold text-white"
              >
                Criar conta grátis
              </Link>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
