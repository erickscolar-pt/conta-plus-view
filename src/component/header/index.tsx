import Image from "next/image";
import Link from "next/link";
import Router from "next/router";
import NotificationBell from "@/component/notifications/NotificationBell";
import { Usuario } from "@/model/type";
import avatar from "../../../public/Avatar.png";
import { FaPlus } from "react-icons/fa6";
import { motion } from "framer-motion";

function firstName(nome?: string) {
  if (!nome?.trim()) return "Usuário";
  return nome.trim().split(/\s+/)[0];
}

function formatToday(compact = false) {
  if (compact) {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function Header({ usuario }: { usuario?: Usuario }) {
  const greeting = firstName(usuario?.nome);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-cp-base/80 px-3 py-3 backdrop-blur-xl sm:px-6 sm:py-4 lg:px-8">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="truncate text-xs capitalize text-cp-muted sm:text-sm"
          >
            <span className="sm:hidden">{formatToday(true)}</span>
            <span className="hidden sm:inline">{formatToday()}</span>
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="truncate text-lg font-semibold tracking-tight text-white sm:text-2xl"
          >
            Olá, {greeting} 👋
          </motion.h1>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <button
            type="button"
            onClick={() => Router.push("/movimentacoes")}
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 sm:inline-flex"
          >
            <FaPlus className="text-xs" />
            Nova movimentação
          </button>

          <Link
            href="/manual"
            className="hidden rounded-xl border border-white/[0.08] bg-cp-card px-3 py-2 text-sm text-cp-muted transition hover:text-white md:inline"
          >
            Ajuda
          </Link>

          <NotificationBell />

          <button
            type="button"
            className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-cp-card p-1 transition hover:border-dash/30 hover:shadow-glow sm:pr-3"
            onClick={() => Router.push("/perfil")}
            title="Perfil"
          >
            <Image
              src={avatar}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full"
            />
            <span className="hidden text-sm text-cp-muted lg:inline">Perfil</span>
          </button>
        </div>
      </div>
    </header>
  );
}
