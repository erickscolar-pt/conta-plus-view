import Image from "next/image";
import Link from "next/link";
import avatar from "../../../public/Avatar.png";
import logoBranco from "../../../public/logo_branco.png";
import Router from "next/router";
import NotificationBell from "@/component/notifications/NotificationBell";

/** Dimensões nativas do PNG (proporção ~2:1 — ícone + marca) */
const LOGO_WIDTH = 115;
const LOGO_HEIGHT = 56;

export default function Header({ usuario }: { usuario?: unknown }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-3 backdrop-blur-xl sm:px-6 md:px-10">
      <Link
        href="/dashboard"
        className="group flex min-w-0 items-center gap-2.5 rounded-xl py-1.5 pl-0.5 pr-2 transition hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 sm:gap-3"
      >
        <span className="relative flex shrink-0 items-center justify-center rounded-xl bg-white/[0.04] px-2 py-1 ring-1 ring-white/10 transition group-hover:bg-white/[0.06] group-hover:ring-white/15 sm:px-2.5 sm:py-1.5">
          <Image
            src={logoBranco}
            alt="Conta+"
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            sizes="(max-width: 640px) 90px, 115px"
            className="h-8 w-auto max-w-[calc(100vw-8rem)] object-contain object-left sm:h-9 md:h-10"
            priority
          />
        </span>
        {/* Só no mobile: texto reforça a marca; a partir de sm a arte do PNG já traz Conta+ */}
        <span className="flex min-w-0 flex-col sm:hidden">
          <span className="text-sm font-bold leading-tight tracking-tight text-slate-50">
            CONTA<span className="text-emerald-400">+</span>
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
            Gestão financeira
          </span>
        </span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-4">
        <Link
          href="/manual"
          className="hidden text-sm font-medium text-slate-400 transition hover:text-emerald-400 sm:inline"
        >
          Ajuda
        </Link>
        <NotificationBell />
        <button
          type="button"
          className="flex items-center rounded-full ring-2 ring-white/15 transition hover:ring-emerald-400/50"
          onClick={() => Router.push("/perfil")}
          title={usuario ? "Perfil" : "Perfil"}
        >
          <Image
            src={avatar}
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 rounded-full sm:h-10 sm:w-10"
          />
        </button>
      </div>
    </header>
  );
}
