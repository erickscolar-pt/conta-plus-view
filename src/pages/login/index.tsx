import { FormEvent, useContext, useState } from "react";
import { AuthContexts } from "@/contexts/AuthContexts";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import AuthLayout from "@/component/layout/AuthLayout";

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
    <AuthLayout
      title="Entrar na sua conta"
      description="Use seu e-mail ou nome de usuário cadastrado."
      footer={
        <p className="mt-6 text-center text-sm text-cp-subtle">
          Não tem conta?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary transition hover:text-primary-hover"
          >
            Criar conta grátis
          </Link>
        </p>
      }
    >
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-300">
            E-mail ou nome de usuário
          </label>
          <input
            type="text"
            placeholder="ex: seu@email.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            className="w-full rounded-xl border border-white/[0.08] bg-cp-base px-4 py-3 text-white placeholder:text-cp-subtle focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
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
              autoComplete="current-password"
              className="w-full rounded-xl border border-white/[0.08] bg-cp-base py-3 pl-4 pr-12 text-white placeholder:text-cp-subtle focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
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
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-cp-base shadow-lg shadow-primary/25 transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-cp-subtle">
        <Link href="/" className="transition hover:text-cp-muted">
          ← Voltar para a página inicial
        </Link>
      </p>
    </AuthLayout>
  );
}

export const getServerSideProps = canSSRGuest(async () => {
  return { props: {} };
});
