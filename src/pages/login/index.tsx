import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import { AuthContexts } from "@/contexts/AuthContexts";
import { canSSRGuest } from "@/utils/canSSRGuest";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import imgLogo from "../../../public/logo_login.png";
import Image from "next/image";

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

    let data = {
      username,
      password,
    };

    await signIn(data);
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Conta Plus - Login</title>
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-dashboard px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-2">
              <Image width={100} src={imgLogo} alt="" />
            </div>
            <p className="text-gray-500 mt-1">
              Entre para gerenciar suas finanças
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Nome de usuário ou E-mail
              </label>
              <input
                type="text"
                placeholder="Digite seu usuário ou e-mail"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary outline-none pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <Link
                href="/forgotpassword"
                className="text-primary hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-lg font-bold hover:opacity-90 transition"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-sm">ou</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Cadastro */}
          <p className="text-center text-gray-600 text-sm">
            Não tem conta?{" "}
            <Link
              href="/signup"
              className="text-primary font-bold hover:underline"
            >
              Criar Conta
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
