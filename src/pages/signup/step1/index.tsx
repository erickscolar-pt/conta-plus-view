import React, { useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { MdEmail, MdPerson } from "react-icons/md";
import { toast } from "react-toastify";
import Router from "next/router";
import { validateEmail } from "@/helper";
import { setupAPIClient } from "@/services/api";
import SignupLayout from "@/component/layout/SignupLayout";
import SignupField, { signupInputClass } from "@/component/signup/SignupField";
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
      title="Crie sua conta"
      description="Leva menos de um minuto. Geramos seu usuário automaticamente — você só precisa de nome e e-mail."
      step={1}
      totalSteps={3}
    >
      <div className="space-y-6">
        <SignupField
          label="Como devemos te chamar?"
          hint="Seu nome aparece no dashboard e nas mensagens da IA."
          icon={<MdPerson size={16} />}
        >
          <input
            type="text"
            placeholder="Ex: Maria Silva"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            autoComplete="name"
            className={signupInputClass}
          />
        </SignupField>

        <SignupField
          label="Seu melhor e-mail"
          hint="Usado para login e recuperação. Também geramos um @usuário único para você."
          icon={<MdEmail size={16} />}
        >
          <input
            type="email"
            placeholder="voce@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className={signupInputClass}
          />
        </SignupField>

        <label className="group flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.08] bg-cp-base/40 p-4 transition hover:border-primary/25 hover:bg-primary/5">
          <input
            type="checkbox"
            checked={acceptTerms}
            onChange={() => setAcceptTerms(!acceptTerms)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-slate-900 text-primary focus:ring-primary/40"
          />
          <span className="text-sm leading-relaxed text-cp-muted group-hover:text-slate-300">
            Li e aceito os{" "}
            <Link
              href="/termosdeuso"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              termos de uso
            </Link>{" "}
            e a{" "}
            <Link
              href="/politicadeprivacidade"
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              política de privacidade
            </Link>
            .
          </span>
        </label>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => Router.push("/")}
            className="text-sm font-medium text-cp-subtle transition hover:text-white"
          >
            ← Voltar ao início
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={busy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Validando..." : "Continuar"}
            {!busy ? <FaArrowRight className="text-sm" /> : null}
          </button>
        </div>
      </div>
    </SignupLayout>
  );
}
