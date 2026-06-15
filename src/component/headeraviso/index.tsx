import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/router";
import BrandLogo from "@/component/brand/BrandLogo";

export default function HeaderAviso() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const links = [
    { href: "/politicadeprivacidade", label: "Privacidade" },
    { href: "/termosdeuso", label: "Termos de Uso" },
    { href: "/politicadecookies", label: "Cookies" },
  ];

  const getLinkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 ${
      router.pathname === href
        ? "bg-primary/20 text-brand-300 shadow-inner shadow-brand-500/20"
        : "text-slate-200 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <header className="sticky top-2 z-40 mx-2 mt-2 rounded-2xl border border-white/10 bg-cp-card/90 p-2.5 text-white shadow-xl shadow-black/25 backdrop-blur-xl sm:top-3 sm:mx-4 sm:mt-3 sm:p-3">
      <div className="flex items-center justify-between gap-2">
        <BrandLogo size="compact" href="/" className="min-w-0" />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className={getLinkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-lg text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/70 md:hidden"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isMenuOpen ? (
        <div className="mt-2 border-t border-white/10 pt-2 md:hidden">
          <nav className="grid gap-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getLinkClass(item.href)}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 hover:bg-white/10"
              onClick={() => setIsMenuOpen(false)}
            >
              Página inicial
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
