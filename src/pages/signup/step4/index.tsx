import React from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import SignupLayout from "@/component/layout/SignupLayout";

interface PaymentsProps {
  userData?: Usuario;
}

type Usuario = {
  id: number;
  nome: string;
  username: string;
  email: string;
  senha?: string;
  codigoReferencia: string | null;
  codigoRecomendacao: string | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
};

export default function PaymentPage({ userData }: PaymentsProps) {
  const userName = userData?.nome || "Sua conta";

  return (
    <SignupLayout
      title="Conta criada"
      description="Tudo certo — já pode entrar e organizar suas finanças."
      step={3}
      totalSteps={3}
      hideFooter
    >
      <div className="text-center">
        <FaCheckCircle className="mx-auto mb-4 text-5xl text-emerald-400" />
        <p className="text-lg font-semibold text-white">
          {userName}, bem-vindo ao Conta+!
        </p>
        <p className="mt-2 text-sm text-slate-400">
          Seu usuário:{" "}
          <span className="font-mono font-medium text-emerald-300">
            {userData?.username ?? "—"}
          </span>
        </p>
        <p className="mt-4 text-sm text-slate-400">
          Use seu e-mail ou nome de usuário para fazer login.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 sm:w-auto"
        >
          Ir para o login
        </Link>
      </div>
    </SignupLayout>
  );
}
