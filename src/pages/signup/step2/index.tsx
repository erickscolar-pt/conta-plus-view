import React, { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLock, MdVerifiedUser } from "react-icons/md";
import Router from "next/router";
import { toast } from "react-toastify";
import SignupLayout from "@/component/layout/SignupLayout";
import SignupField, { signupInputClass } from "@/component/signup/SignupField";
import PasswordStrength, { isPasswordValid } from "@/component/signup/PasswordStrength";

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

function userInitial(nome: string) {
  const t = nome.trim();
  return t ? t.charAt(0).toUpperCase() : "?";
}

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

  useEffect(() => {
    if (!userData.username?.trim()) {
      void Router.replace("/signup");
    }
  }, [userData.username]);

  const handleFinish = async () => {
    if (!isPasswordValid(password)) {
      toast.warning(
        "Complete todos os requisitos de senha antes de continuar.",
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

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  return (
    <SignupLayout
      title="Proteja sua conta"
      description="Confira seu usuário e defina uma senha forte. É a última etapa antes de entrar."
      step={2}
      totalSteps={3}
    >
      <div className="space-y-6">
        <div className="flex items-center gap-4 rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 to-transparent p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-dash to-brand-600 text-lg font-bold text-white shadow-glow">
            {userInitial(userData.nome)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{userData.nome}</p>
            <p className="mt-0.5 flex items-center gap-1.5 font-mono text-sm text-primary">
              <MdVerifiedUser size={14} />
              @{userData.username}
            </p>
            <p className="mt-0.5 truncate text-xs text-cp-subtle">{userData.email}</p>
          </div>
        </div>

        <SignupField label="Crie sua senha" icon={<MdLock size={16} />}>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha segura"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className={`${signupInputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-cp-subtle transition hover:text-white"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </SignupField>

        <PasswordStrength password={password} />

        <SignupField label="Confirme a senha" icon={<MdLock size={16} />}>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Repita a senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className={`${signupInputClass} pr-12 ${
                confirmPassword && !passwordsMatch
                  ? "border-red-500/40 focus:border-red-500/50 focus:ring-red-500/20"
                  : confirmPassword && passwordsMatch
                    ? "border-primary/40"
                    : ""
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-cp-subtle transition hover:text-white"
              aria-label={
                showConfirmPassword ? "Ocultar confirmação" : "Mostrar confirmação"
              }
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch ? (
            <p className="mt-1.5 text-xs text-red-400">As senhas não coincidem.</p>
          ) : null}
        </SignupField>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-cp-subtle transition hover:text-white disabled:opacity-50"
          >
            <FaArrowLeft /> Voltar
          </button>
          <button
            type="button"
            onClick={handleFinish}
            disabled={loading || !isPasswordValid(password) || !passwordsMatch}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              "Criando sua conta..."
            ) : (
              <>
                Criar conta grátis <FaArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </SignupLayout>
  );
}
