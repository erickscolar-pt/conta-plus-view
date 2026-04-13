import Image from "next/image";
import Link from "next/link";
import avatar from "../../../public/Avatar.png";
import logo from "../../../public/logo_branco.png";
import Router from "next/router";
import NotificationBell from "@/component/notifications/NotificationBell";

export default function Header({ usuario }: { usuario?: unknown }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/10 bg-slate-950/80 px-3 backdrop-blur-xl sm:px-6 md:px-10">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/30 sm:h-11 sm:w-11">
          <Image
            src={logo}
            alt="Conta+"
            width={28}
            height={28}
            className="h-7 w-auto"
          />
        </div>
        <div className="hidden leading-tight sm:block">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Conta+
          </p>
          <p className="text-sm font-semibold text-slate-100">Gestão financeira</p>
        </div>
      </div>
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
