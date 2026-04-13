import React, { useState } from "react";
import { FaArrowRight, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";
import Router from "next/router";
import { validateEmail } from "@/helper";
import { setupAPIClient } from "@/services/api";
import SignupLayout from "@/component/layout/SignupLayout";
import { reserveUniqueUsername } from "@/utils/generateUsername";

interface Step1Props {
  userData: {
    nome: string;
    email: string;
    username: string;
    acceptTerms: boolean;
  };
  setUserData: (
    nome: string,
    email: string,
    username: string,
    acceptTerms: boolean,
  ) => void;
  nextStep: () => void;
}

export default function Step1({
  userData = { nome: "", email: "", username: "", acceptTerms: false },
  setUserData,
  nextStep,
}: Step1Props) {
  const [email, setEmail] = useState(userData.email || "");
  const [nome, setNome] = useState(userData.nome || "");
  const [acceptTerms, setAcceptTerms] = useState(userData.acceptTerms || false);
  const [busy, setBusy] = useState(false);

  const isUsernameAvailable = async (value: string): Promise<boolean> => {
    const apiClient = setupAPIClient();
    const { data } = await apiClient.post<boolean>("user/verify-username", {
      username: value,
    });
    return data === true;
  };

  const handleNext = async () => {
    if (nome.trim() === "" || email.trim() === "") {
      toast.warning("Preencha seu nome e e-mail para prosseguir.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    if (!validateEmail(email.trim())) {
      toast.error("Insira um e-mail válido.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    if (!acceptTerms) {
      toast.error("Você deve aceitar os termos de uso para prosseguir.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    setBusy(true);
    try {
      const emailFree = await isUsernameAvailable(email.trim());
      if (!emailFree) {
        toast.error("Este e-mail já está cadastrado.", {
          position: toast.POSITION.TOP_CENTER,
        });
        return;
      }

      const username = await reserveUniqueUsername(
        nome.trim(),
        email.trim(),
        isUsernameAvailable,
      );

      setUserData(nome.trim(), email.trim(), username, acceptTerms);
      nextStep();
    } catch {
      toast.error(
        "Não foi possível validar seus dados ou gerar um usuário. Tente novamente.",
        { position: toast.POSITION.TOP_CENTER },
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <SignupLayout
      title="Criar conta"
      description="Informe seu nome e e-mail. Geraremos um nome de usuário automaticamente."
      step={1}
      totalSteps={3}
    >
      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Seu nome
          </label>
          <input
            type="text"
            placeholder="Como devemos te chamar"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            E-mail
          </label>
          <input
            type="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Você usará e-mail ou nome de usuário para entrar.
          </p>
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100/95">
          <strong className="text-emerald-200">Nome de usuário automático</strong>
          <p className="mt-1 text-emerald-100/80">
            Geramos um login único a partir do seu nome (e conferimos se está
            disponível). Você verá o usuário na próxima etapa antes de criar a
            senha.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-slate-950/40 p-4 transition hover:border-white/15">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-900 text-emerald-500 focus:ring-emerald-500/40"
          />
          <span className="text-sm text-slate-300">
            Eu aceito os{" "}
            <a
              href="/termosdeuso"
              className="font-medium text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              termos de uso
            </a>{" "}
            e a{" "}
            <a
              href="/politicadeprivacidade"
              className="font-medium text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              política de privacidade
            </a>
            .
          </span>
        </label>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => Router.push("/")}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white"
          >
            <FaUser className="text-emerald-400" /> Voltar ao início
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Validando..." : "Continuar"}
            {!busy ? <FaArrowRight className="text-base" /> : null}
          </button>
        </div>
      </div>
    </SignupLayout>
  );
}
