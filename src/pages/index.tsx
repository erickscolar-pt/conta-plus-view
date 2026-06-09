import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import { Dialog } from "@headlessui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";
import { AuthContexts } from "@/contexts/AuthContexts";
import BrandLogo from "@/component/brand/BrandLogo";
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

      <div className="min-h-screen bg-cp-base text-white">
        {/* Nav */}
        <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.08] bg-cp-base/80 backdrop-blur-xl">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <BrandLogo size="default" />
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
            <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-dash/20 blur-[120px]" aria-hidden />
            <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-ai/15 blur-[100px]" aria-hidden />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div>
                  <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-dash/30 bg-dash/10 px-3 py-1 text-xs font-medium text-dash sm:text-sm">
                    <MdRocketLaunch aria-hidden />
                    SaaS financeiro com IA
                  </p>
                  <h1 className="text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                    Controle seu dinheiro e{" "}
                    <span className="bg-gradient-to-r from-dash via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                      conquiste seus sonhos
                    </span>
                  </h1>
                  <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-cp-muted sm:text-lg">
                    Organize receitas, despesas, metas e dívidas em um único lugar.
                    Importação automática e IA financeira premium.
                  </p>
                  <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                    <Link
                      href="/signup"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-dash to-brand-600 px-8 py-4 text-base font-semibold text-white shadow-glow transition hover:brightness-110"
                    >
                      Criar conta grátis
                      <MdArrowForward aria-hidden />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="inline-flex items-center justify-center rounded-2xl border border-white/[0.08] bg-cp-card px-8 py-4 text-base font-semibold text-white transition hover:bg-cp-card-secondary"
                    >
                      Ver demonstração
                    </button>
                  </div>
                  <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[
                      ["+25.000", "usuários"],
                      ["+180M", "movimentados"],
                      ["98%", "satisfação"],
                      ["4.8", "estrelas"],
                    ].map(([val, label]) => (
                      <div key={label} className="rounded-xl border border-white/[0.08] bg-cp-card px-3 py-2">
                        <p className="text-lg font-bold text-white">{val}</p>
                        <p className="text-[10px] uppercase tracking-wider text-cp-subtle">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hero mockup */}
                <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-dash/20 to-ai/20 blur-2xl" aria-hidden />
                  <div className="relative rounded-2xl border border-white/[0.08] bg-cp-card p-4 shadow-glow backdrop-blur-xl">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-expense/80" />
                      <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                      <span className="h-3 w-3 rounded-full bg-income/80" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Receitas", val: "R$ 12.450", color: "text-income" },
                        { label: "Despesas", val: "R$ 8.320", color: "text-expense" },
                        { label: "Saldo", val: "R$ 4.130", color: "text-white" },
                        { label: "Economia", val: "R$ 1.890", color: "text-planning" },
                      ].map((m) => (
                        <div key={m.label} className="rounded-xl bg-cp-card-secondary p-3">
                          <p className="text-[10px] text-cp-subtle">{m.label}</p>
                          <p className={`text-sm font-bold ${m.color}`}>{m.val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 h-24 rounded-xl bg-gradient-to-t from-dash/10 to-transparent ring-1 ring-white/[0.06]" />
                    <div className="mt-3 flex items-center gap-2 rounded-xl border border-ai/25 bg-ai/10 px-3 py-2">
                      <MdBarChart className="text-ai" />
                      <p className="text-xs text-cp-muted">IA: você pode economizar R$ 500/mês</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="border-t border-white/[0.08] bg-cp-card/30 py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">
                Tudo para dominar suas finanças
              </h2>
              <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  { icon: MdSavings, title: "Controle financeiro completo" },
                  { icon: MdTrackChanges, title: "Metas inteligentes" },
                  { icon: MdUploadFile, title: "Importação automática" },
                  { icon: MdBarChart, title: "Relatórios avançados" },
                  { icon: MdRocketLaunch, title: "IA Financeira" },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/[0.08] bg-cp-card p-5 transition hover:border-dash/30 hover:shadow-glow"
                  >
                    <span className="text-xs font-bold text-dash">{String(i + 1).padStart(2, "0")}</span>
                    <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-xl bg-dash/15 text-dash">
                      <item.icon size={22} />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="border-t border-white/[0.08] py-20 sm:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-ai">
                  Planos
                </p>
                <h2 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
                  Comece grátis. Evolua com IA Premium.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-cp-muted">
                  O plano gratuito já inclui dashboard, metas e importação. O AI Premium
                  desbloqueia análises e chat ilimitados com seu coach financeiro.
                </p>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:mx-auto lg:max-w-4xl">
                <div className="rounded-3xl border border-white/[0.08] bg-cp-card p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cp-muted">
                    Grátis
                  </p>
                  <p className="mt-3 text-4xl font-bold text-white">
                    R$ 0
                    <span className="text-base font-normal text-cp-subtle">/mês</span>
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-cp-muted">
                    {[
                      "Dashboard e relatórios completos",
                      "Metas, dívidas e mercado",
                      "5 análises IA por mês",
                      "10 mensagens de chat IA",
                      "Importação Excel, CSV, OFX e PDF",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <MdCheckCircle className="mt-0.5 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="mt-8 flex w-full items-center justify-center rounded-2xl border border-white/[0.08] bg-cp-card-secondary py-3.5 text-sm font-semibold text-white transition hover:border-primary/30"
                  >
                    Criar conta grátis
                  </Link>
                </div>
                <div className="relative rounded-3xl border border-ai/30 bg-gradient-to-b from-ai/15 to-cp-card p-8 shadow-glow-ai">
                  <span className="absolute -top-3 right-6 rounded-full bg-ai px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Recomendado
                  </span>
                  <p className="text-sm font-semibold uppercase tracking-wider text-ai">
                    AI Premium
                  </p>
                  <p className="mt-3 text-4xl font-bold text-white">
                    R$ 19,90
                    <span className="text-base font-normal text-cp-subtle">/mês</span>
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-cp-muted">
                    {[
                      "Análises financeiras ilimitadas",
                      "Chat com coach IA ilimitado",
                      "Score, projeções e plano de dívidas",
                      "Notificações inteligentes",
                      "Pagamento via PIX — sem cartão",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <MdCheckCircle className="mt-0.5 shrink-0 text-ai" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="mt-8 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-ai to-planning py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
                  >
                    Começar com Premium
                  </Link>
                </div>
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
                  Plano gratuito completo para organizar suas finanças. Upgrade para AI
                  Premium quando quiser desbloquear análises e chat ilimitados.
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
