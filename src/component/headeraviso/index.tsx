import Link from "next/link";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/router";

export default function HeaderAviso() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const links = [
    { href: "/politicadeprivacidade", label: "Privacidade" },
    { href: "/termosdeuso", label: "Termos de Uso" },
    { href: "/politicadecookies", label: "Cookies" },
  ];

  const getLinkClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 ${
      router.pathname === href
        ? "bg-emerald-500/20 text-emerald-300 shadow-inner shadow-emerald-500/20"
        : "text-slate-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
    }`;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-3 z-40 mx-3 mt-3 rounded-2xl border border-white/10 bg-slate-900/85 p-3 text-white shadow-xl shadow-black/25 backdrop-blur-xl sm:mx-6 sm:mt-4">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
        >
          <FaHome className="text-emerald-300" />
          <span>Conta Plus</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className={getLinkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={toggleMenu}
          className="inline-flex items-center rounded-lg p-2 text-xl text-slate-200 transition-all duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 md:hidden"
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isMenuOpen ? (
        <div className="mt-3 border-t border-white/10 pt-3 md:hidden">
          <nav className="grid gap-2">
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
          </nav>
        </div>
      ) : null}
    </header>
  );
}
