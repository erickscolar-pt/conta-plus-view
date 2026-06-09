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

function formatToday() {
  return new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default function Header({ usuario }: { usuario?: Usuario }) {
  const greeting = firstName(usuario?.nome);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.08] bg-cp-base/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-sm text-cp-muted capitalize"
          >
            {formatToday()}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-0.5 truncate text-xl font-semibold tracking-tight text-white sm:text-2xl"
          >
            Olá, {greeting} 👋
          </motion.h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => Router.push("/movimentacoes")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
          >
            <FaPlus className="text-xs" />
            <span className="hidden sm:inline">Nova movimentação</span>
            <span className="sm:hidden">Nova</span>
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
            className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-cp-card p-1 pr-3 transition hover:border-dash/30 hover:shadow-glow"
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
