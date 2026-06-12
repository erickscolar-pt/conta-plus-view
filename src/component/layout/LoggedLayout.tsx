import { ReactNode } from "react";
import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { Usuario } from "@/model/type";

type LoggedLayoutProps = {
  usuario: Usuario;
  children: ReactNode;
};

export default function LoggedLayout({ usuario, children }: LoggedLayoutProps) {
  return (
    <div className="relative flex min-h-screen bg-cp-base text-white">
      <div
        className="pointer-events-none fixed -left-32 top-0 h-[420px] w-[420px] rounded-full bg-dash/10 blur-[120px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-32 top-1/4 h-[360px] w-[360px] rounded-full bg-ai/10 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/2 h-48 w-full max-w-4xl -translate-x-1/2 bg-gradient-to-t from-cp-base to-transparent"
        aria-hidden
      />

      <MenuLateral />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:ml-64 lg:pb-0">
        <Header usuario={usuario} />
        {children}
      </div>
    </div>
  );
}
