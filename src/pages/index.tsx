import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import { Dialog } from "@headlessui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import { AuthContexts } from "@/contexts/AuthContexts";
import Image from "next/image";
import imgLogo from "../../public/logo_login.png";
import {
  MdArrowForward,
  MdBarChart,
  MdCheckCircle,
  MdGroups,
  MdRocketLaunch,
  MdSecurity,
  MdSavings,
  MdTrackChanges,
  MdUploadFile,
} from "react-icons/md";

export default function Home() {
  const { signIn } = useContext(AuthContexts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    <>
      <Head>
        <title>Conta+ | Sua vida financeira organizada</title>
        <meta
          name="description"
          content="Controle entradas, saídas e metas em um só lugar. Visão clara do seu dinheiro — grátis para começar."
        />
      </Head>

      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Nav */}
        <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={imgLogo}
                alt="Conta+"
                width={140}
                height={40}
                className="h-9 w-auto sm:h-10"
                priority
              />
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                Entrar
              </button>
              <Link
                href="/signup"
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 sm:px-5"
              >
                Criar conta grátis
              </Link>
            </div>
          </div>
        </header>

        <main>
          {/* Hero */}
          <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-24 lg:pb-32">
            <div
              className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-emerald-500/25 blur-[100px]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-[90px]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[120%] -translate-x-1/2 bg-gradient-to-t from-slate-950 via-transparent to-transparent"
              aria-hidden
            />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300 sm:text-sm">
                  <MdRocketLaunch className="text-emerald-400" aria-hidden />
                  Gestão financeira pensada para o dia a dia
                </p>
                <h1 className="text-balance bg-gradient-to-br from-white via-slate-100 to-slate-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl sm:leading-[1.1] lg:text-6xl">
                  O controle do seu dinheiro, simples como deve ser
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-400 sm:text-lg">
                  Entradas e saídas no mesmo lugar, metas que você acompanha e
                  um painel que mostra onde está cada real — sem planilhas
                  complicadas.
                </p>
                <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-xl shadow-emerald-500/30 transition hover:bg-emerald-400"
                  >
                    Começar agora — é grátis
                    <MdArrowForward className="text-xl" aria-hidden />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    Já tenho conta
                  </button>
                </div>
                <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
                  <li className="flex items-center gap-2">
                    <MdCheckCircle
                      className="text-emerald-500"
                      aria-hidden
                    />
                    Sem cartão para testar
                  </li>
                  <li className="flex items-center gap-2">
                    <MdCheckCircle
                      className="text-emerald-500"
                      aria-hidden
                    />
                    Cadastro em minutos
                  </li>
                  <li className="flex items-center gap-2">
                    <MdCheckCircle
                      className="text-emerald-500"
                      aria-hidden
                    />
                    Acesso web completo
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="border-t border-white/10 bg-slate-900/50 py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Tudo o que você precisa para decidir melhor
                </h2>
                <p className="mt-4 text-slate-400">
                  Ferramentas pensadas para quem quer clareza, não buzzwords.
                </p>
              </div>

              <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    icon: MdSavings,
                    title: "Entradas e saídas juntas",
                    text: "Veja saldo e movimentações em uma única tela — sem alternar abas o tempo todo.",
                  },
                  {
                    icon: MdBarChart,
                    title: "Painéis que fazem sentido",
                    text: "Gráficos e totais por período para entender tendências, não só números soltos.",
                  },
                  {
                    icon: MdGroups,
                    title: "Compartilhamento com quem importa",
                    text: "Vínculos para alinhar dívidas e objetivos com família ou parceiro(a).",
                  },
                  {
                    icon: MdTrackChanges,
                    title: "Metas financeiras",
                    text: "Defina objetivos e acompanhe o quanto já está reservado para cada um.",
                  },
                  {
                    icon: MdUploadFile,
                    title: "Importação por planilha",
                    text: "Traga dados de Excel quando precisar migrar ou conferir histórico.",
                  },
                  {
                    icon: MdSecurity,
                    title: "Seus dados, seu controle",
                    text: "Acesso por login seguro; a organização começa com você no comando.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-white/10 bg-slate-900/80 p-6 transition hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 transition group-hover:bg-emerald-500/25">
                      <item.icon className="text-2xl" aria-hidden />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Steps */}
          <section className="py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Três passos para começar
              </h2>
              <div className="mt-14 grid gap-8 md:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Crie sua conta",
                    desc: "Nome, e-mail e senha — sem burocracia.",
                  },
                  {
                    step: "02",
                    title: "Registre o essencial",
                    desc: "Lance suas entradas e o que precisa pagar neste mês.",
                  },
                  {
                    step: "03",
                    title: "Acompanhe o painel",
                    desc: "Veja saldo, gráficos e metas atualizando conforme você usa.",
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-8 text-center"
                  >
                    <span className="text-5xl font-black text-emerald-500/20">
                      {s.step}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm text-slate-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-white/10 py-20 sm:py-24">
            <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
              <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-950 p-10 sm:p-14">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Pronto para organizar suas finanças?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-slate-300">
                  Nesta fase o Conta+ está sem cobrança para você testar com
                  calma. Crie sua conta e use ganhos, gastos, metas e
                  relatórios.
                </p>
                <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:justify-center">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-xl transition hover:bg-slate-100"
                  >
                    Criar minha conta grátis
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center justify-center rounded-2xl border border-white/20 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                  >
                    Entrar
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/10 py-12">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 px-4 sm:flex-row sm:px-6">
              <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
                <Link
                  href="/termosdeuso"
                  className="transition hover:text-emerald-400"
                >
                  Termos de uso
                </Link>
                <Link
                  href="/politicadeprivacidade"
                  className="transition hover:text-emerald-400"
                >
                  Privacidade
                </Link>
                <Link href="/manual" className="transition hover:text-emerald-400">
                  Ajuda
                </Link>
              </div>
              <p className="text-center text-sm text-slate-600">
                © {new Date().getFullYear()} Conta+. Todos os direitos reservados.
              </p>
            </div>
          </footer>
        </main>
      </div>

      {/* Login modal */}
      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" aria-hidden />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
            <Dialog.Title className="text-xl font-bold text-white">
              Entrar na sua conta
            </Dialog.Title>
            <p className="mt-1 text-sm text-slate-400">
              Use seu e-mail ou nome de usuário cadastrado.
            </p>

            <form onSubmit={handleLogin} className="mt-6 flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  E-mail ou usuário
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="ex: seu@email.com"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">
                  Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 pl-4 pr-12 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full rounded-xl bg-emerald-500 py-3.5 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:opacity-60"
              >
                {loading ? "Entrando…" : "Entrar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Não tem conta?{" "}
              <Link
                href="/signup"
                className="font-semibold text-emerald-400 hover:text-emerald-300"
                onClick={() => setIsModalOpen(false)}
              >
                Criar conta grátis
              </Link>
            </p>
            <p className="mt-4 text-center text-xs text-slate-600">
              <Link href="/login" className="hover:text-slate-400">
                Abrir página de login completa
              </Link>
            </p>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
