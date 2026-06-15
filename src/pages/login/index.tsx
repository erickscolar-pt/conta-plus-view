import { FormEvent, useContext, useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { AuthContexts } from "@/contexts/AuthContexts";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { toast } from "react-toastify";
import { FaArrowRight, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdEmail, MdLock } from "react-icons/md";
import LoginLayout from "@/component/layout/LoginLayout";
import SignupField, { signupInputClass } from "@/component/signup/SignupField";

export default function Login() {
  const { signIn } = useContext(AuthContexts);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (username === "" || password === "") {
      toast.warning("Preencha todos os campos!");
      return;
    }

    setLoading(true);
    await signIn({ username, password });
    setLoading(false);
  }

  return (
    <LoginLayout
      title="Entrar na sua conta"
      description="Use seu e-mail ou nome de usuário cadastrado."
    >
      <form onSubmit={handleLogin} className="space-y-6">
        <SignupField
          label="E-mail ou nome de usuário"
          hint="O mesmo que você usou ao criar a conta."
          icon={<MdEmail size={16} />}
        >
          <input
            type="text"
            placeholder="ex: seu@email.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className={signupInputClass}
          />
        </SignupField>

        <SignupField
          label="Senha"
          icon={<MdLock size={16} />}
        >
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className={`${signupInputClass} pr-12`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cp-muted transition hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <p className="mt-2 text-right">
            <Link href="/esqueci-senha" className="text-xs font-medium text-primary hover:underline">
              Esqueci minha senha
            </Link>
          </p>
        </SignupField>

        <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => void Router.push("/")}
            className="text-sm font-medium text-cp-subtle transition hover:text-white"
          >
            ← Voltar ao início
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? "Entrando…" : "Entrar"}
            {!loading ? <FaArrowRight className="text-sm" /> : null}
          </button>
        </div>
      </form>

      <p className="mt-6 border-t border-white/[0.06] pt-5 text-center text-xs text-cp-subtle">
        Precisa confirmar o e-mail?{" "}
        <Link href="/verificar-email" className="font-medium text-primary hover:underline">
          Reenviar confirmação
        </Link>
      </p>
    </LoginLayout>
  );
}

export const getServerSideProps = canSSRGuest(async () => {
  return { props: {} };
});
