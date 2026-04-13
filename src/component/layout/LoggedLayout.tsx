import { ReactNode } from "react";
import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { Usuario } from "@/model/type";

type LoggedLayoutProps = {
  usuario: Usuario;
  children: ReactNode;
};

/**
 * Shell das telas autenticadas — alinhado à landing (fundo escuro, brilhos, vidro).
 */
export default function LoggedLayout({ usuario, children }: LoggedLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-950 text-slate-100 md:flex-row">
      <div
        className="pointer-events-none fixed -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/20 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-20 top-40 h-80 w-80 rounded-full bg-cyan-500/15 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-gradient-to-t from-slate-950 via-transparent to-transparent md:left-24 md:w-full md:translate-x-0"
        aria-hidden
      />

      <MenuLateral />
      <div className="relative z-10 flex flex-1 flex-col pb-20 md:ml-20 md:pb-8">
        <Header usuario={usuario} />
        {children}
      </div>
    </div>
  );
}
