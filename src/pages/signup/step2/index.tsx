import React, { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import Router from "next/router";
import { toast } from "react-toastify";
import SignupLayout from "@/component/layout/SignupLayout";

interface Step2Props {
  userData?: {
    nome: string;
    email: string;
    username: string;
  };
  handleSignUp?: (senha: string) => Promise<void>;
  loading?: boolean;
  prevStep?: () => void;
}

const emptyUser = { nome: "", email: "", username: "" };

export default function Step2({
  userData = emptyUser,
  handleSignUp = async () => {},
  loading = false,
  prevStep = () => {},
}: Step2Props) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /** Rota /signup/step2 sem fluxo: volta para o cadastro (evita crash no SSG e visita direta) */
  useEffect(() => {
    if (!userData.username?.trim()) {
      void Router.replace("/signup");
    }
  }, [userData.username]);

  const isPasswordValid = (pwd: string): boolean => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(pwd);
  };

  const handleFinish = async () => {
    if (!isPasswordValid(password)) {
      toast.warning(
        "A senha deve ter no mínimo 8 caracteres, incluindo pelo menos 1 letra maiúscula, 1 número e 1 caractere especial.",
        { position: toast.POSITION.TOP_CENTER },
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.warning("As senhas não coincidem.", {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }
    await handleSignUp?.(password);
  };

  return (
    <SignupLayout
      title="Segurança da conta"
      description="Confira seu usuário gerado e crie uma senha forte."
      step={2}
      totalSteps={3}
    >
      <div className="space-y-5">
        <div className="rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Seu nome de usuário
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-emerald-300">
            {userData.username}
          </p>
          <p className="mt-1 text-xs text-slate-500">{userData.email}</p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Senha
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 pr-12 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-white"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            Confirmar senha
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 pr-12 text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 transition hover:text-white"
              aria-label={
                showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        <p className="rounded-xl border border-white/5 bg-slate-950/30 px-4 py-3 text-xs leading-relaxed text-slate-400">
          <strong className="text-slate-300">Dica:</strong> use no mínimo 8
          caracteres, com 1 letra maiúscula, 1 número e 1 caractere especial
          (!@#$%^&*).
        </p>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-400 transition hover:text-white disabled:opacity-50"
          >
            <FaArrowLeft /> Voltar
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              "Criando conta..."
            ) : (
              <>
                Criar conta <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </SignupLayout>
  );
}
