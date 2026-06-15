import { FormEvent, useContext, useState } from "react";
import Head from "next/head";
import { Dialog } from "@headlessui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaPix, FaWandMagicSparkles } from "react-icons/fa6";
import Link from "next/link";
import { toast } from "react-toastify";
import { AuthContexts } from "@/contexts/AuthContexts";
import PublicMarketingHeader from "@/component/layout/PublicMarketingHeader";
import BrandLogo from "@/component/brand/BrandLogo";
import {
  MdArrowForward,
  MdBarChart,
  MdCheckCircle,
  MdClose,
  MdSavings,
  MdTrackChanges,
  MdUploadFile,
  MdAccountBalanceWallet,
  MdShield,
} from "react-icons/md";

const FREE_FEATURES = [
  "Dashboard com saldo, receitas e despesas",
  "Metas financeiras e controle de dívidas",
  "Relatórios e gráficos por período",
  "Importação de Excel, CSV, OFX e PDF",
  "App web completo — sem limite de tempo",
];

const PREMIUM_FEATURES = [
  "Consultor financeiro online 24h com IA",
  "Chat ilimitado sobre suas contas reais",
  "Análises profundas: score, projeções e dívidas",
  "Descubra quanto pode economizar por mês",
  "Pagamento via PIX — sem cartão de crédito",
];

const COMPARISON_ROWS = [
  { feature: "Dashboard e relatórios", free: true as const, premium: true as const },
  { feature: "Metas, dívidas e importação", free: true as const, premium: true as const },
  { feature: "Consultor IA online (chat)", free: false as const, premium: true as const },
  { feature: "Análises profundas ilimitadas", free: false as const, premium: true as const },
  { feature: "Score, projeções e plano de dívidas", free: false as const, premium: true as const },
  { feature: "Custo", free: "R$ 0" as const, premium: "R$ 19,90/mês" as const },
];

const FREE_BENEFITS = [
  { icon: MdAccountBalanceWallet, title: "Suas contas em um só lugar", desc: "Receitas, gastos, metas e dívidas organizados sem pagar nada." },
  { icon: MdUploadFile, title: "Importação automática", desc: "Traga extratos e planilhas — pare de digitar tudo na mão." },
  { icon: MdBarChart, title: "Relatórios claros", desc: "Veja para onde vai seu dinheiro com gráficos e filtros." },
  { icon: MdTrackChanges, title: "Metas e dívidas", desc: "Acompanhe objetivos e parcelas com lembretes inteligentes." },
];

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
        <title>Conta+ | Organize suas contas grátis — Consultor IA Premium</title>
        <meta
          name="description"
          content="Conta+ é grátis para organizar receitas, despesas, metas e dívidas. Planos pagos incluem consultor financeiro com IA que analisa suas contas e responde em tempo real."
        />
      </Head>

      <div className="min-h-screen overflow-x-hidden bg-cp-base text-white">
        <PublicMarketingHeader onLoginClick={() => setIsModalOpen(true)} />

        <main className="pb-24 sm:pb-0">
          {/* Hero */}
          <section className="relative scroll-mt-20 overflow-hidden pt-20 pb-12 sm:pt-28 sm:pb-24 lg:pb-32">
            <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-dash/20 blur-[120px]" aria-hidden />
            <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-ai/15 blur-[100px]" aria-hidden />

            <div className="relative mx-auto max-w-6xl px-3 sm:px-6">
              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="min-w-0">
                  <BrandLogo size="compact" href="/" className="mr-5 mb-6 sm:mb-8" />
                  <p className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary sm:mb-4 sm:text-sm">
                    <MdSavings aria-hidden className="shrink-0" />
                    100% grátis para organizar suas contas
                  </p>
                  <h1 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.08]">
                    Suas finanças organizadas.{" "}
                    <span className="bg-gradient-to-r from-brand-300 via-brand-200 to-logo-peach bg-clip-text text-transparent">
                      De graça.
                    </span>
                  </h1>
                  <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-cp-muted sm:mt-6 sm:text-lg">
                    Cadastre receitas, despesas, metas e dívidas sem pagar nada. Quando quiser ir
                    além, o <strong className="font-semibold text-white">Conta+ AI Premium</strong>{" "}
                    coloca um consultor financeiro online para analisar suas contas e responder
                    perguntas com base nos seus dados reais.
                  </p>
                  <div className="mt-6 flex flex-col gap-2.5 sm:mt-10 sm:flex-row sm:gap-3">
                    <Link
                      href="/signup"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-dash to-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                    >
                      <span className="sm:hidden">Começar grátis</span>
                      <span className="hidden sm:inline">Organizar minhas contas grátis</span>
                      <MdArrowForward aria-hidden />
                    </Link>
                    <a
                      href="#consultor-ia"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-ai/30 bg-ai/10 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-ai/20 sm:w-auto sm:px-8 sm:py-4 sm:text-base"
                    >
                      <FaWandMagicSparkles className="shrink-0 text-ai" />
                      Consultor IA
                    </a>
                    <Link
                      href="/instalar-app"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/[0.08] bg-cp-card px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-white/[0.04] sm:hidden"
                    >
                      📲 Instalar app no celular
                    </Link>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
                    {[
                      "Sem cartão de crédito",
                      "Plano grátis permanente",
                      "PIX para Premium",
                      "Seus dados protegidos",
                    ].map((label) => (
                      <span
                        key={label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-cp-card px-3 py-1.5 text-xs text-cp-muted"
                      >
                        <MdCheckCircle className="text-primary" size={14} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-dash/20 to-ai/20 blur-2xl" aria-hidden />
                  <div className="relative rounded-2xl border border-white/[0.08] bg-cp-card p-4 shadow-glow backdrop-blur-xl">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full bg-expense/80" />
                        <span className="h-3 w-3 rounded-full bg-amber-400/80" />
                        <span className="h-3 w-3 rounded-full bg-income/80" />
                      </div>
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        Plano grátis
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Receitas", val: "R$ 12.450", color: "text-income" },
                        { label: "Despesas", val: "R$ 8.320", color: "text-expense" },
                        { label: "Saldo", val: "R$ 4.130", color: "text-white" },
                        { label: "Meta do mês", val: "78%", color: "text-planning" },
                      ].map((m) => (
                        <div key={m.label} className="rounded-xl bg-cp-card-secondary p-3">
                          <p className="text-[10px] text-cp-subtle">{m.label}</p>
                          <p className={`text-sm font-bold ${m.color}`}>{m.val}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 h-20 rounded-xl bg-gradient-to-t from-dash/10 to-transparent ring-1 ring-white/[0.06]" />
                    <div className="mt-3 rounded-xl border border-ai/25 bg-ai/10 p-3">
                      <div className="flex items-center gap-2 text-ai">
                        <FaWandMagicSparkles size={14} />
                        <p className="text-[10px] font-bold uppercase tracking-wider">AI Premium</p>
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-cp-muted">
                        &quot;Quanto posso gastar este mês?&quot; — o consultor IA responde com
                        base nos seus lançamentos reais.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Free forever */}
          <section id="gratis" className="scroll-mt-20 border-t border-white/[0.08] bg-cp-card/30 py-12 sm:py-20">
            <div className="mx-auto max-w-6xl px-3 sm:px-6">
              <div className="mx-auto max-w-3xl text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                  Sempre grátis
                </p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-4xl">
                  Organize suas contas sem pagar nada
                </h2>
                <p className="mt-4 text-cp-muted">
                  O Conta+ nasceu para quem quer clareza financeira. Dashboard, metas, dívidas,
                  relatórios e importação ficam disponíveis no plano gratuito — para sempre.
                </p>
              </div>
              <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {FREE_BENEFITS.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/[0.08] bg-cp-card p-5 transition hover:border-primary/30 hover:shadow-glow"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <item.icon size={22} />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-white">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-cp-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
              <ul className="mx-auto mt-10 grid max-w-2xl gap-2 sm:grid-cols-2">
                {FREE_FEATURES.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-cp-muted">
                    <MdCheckCircle className="mt-0.5 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 text-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-sm font-semibold text-white transition hover:brightness-110"
                >
                  Começar grátis agora
                  <MdArrowForward />
                </Link>
              </div>
            </div>
          </section>

          {/* AI Consultant */}
          <section id="consultor-ia" className="scroll-mt-20 border-t border-white/[0.08] py-12 sm:py-24">
            <div className="mx-auto max-w-6xl px-3 sm:px-6">
              <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                <div className="order-2 lg:order-1">
                  <div className="rounded-3xl border border-ai/25 bg-gradient-to-br from-ai/15 via-cp-card to-planning/10 p-6 sm:p-8">
                    <div className="space-y-3">
                      <div className="ml-auto max-w-[85%] rounded-2xl bg-ai/20 px-4 py-3 text-sm text-white ring-1 ring-ai/25">
                        Estou gastando demais em delivery?
                      </div>
                      <div className="max-w-[90%] rounded-2xl bg-cp-card-secondary px-4 py-3 text-sm leading-relaxed text-cp-muted">
                        Nos últimos 3 meses, alimentação fora de casa representou 18% da sua renda —
                        acima do ideal de 10–12%. Reduzir 2 pedidos/semana pode liberar cerca de
                        R$ 280/mês para suas metas.
                      </div>
                      <div className="ml-auto max-w-[85%] rounded-2xl bg-ai/20 px-4 py-3 text-sm text-white ring-1 ring-ai/25">
                        Quanto posso investir com segurança?
                      </div>
                      <div className="max-w-[90%] rounded-2xl bg-cp-card-secondary px-4 py-3 text-sm leading-relaxed text-cp-muted">
                        Com seu saldo positivo e reserva atual, sugiro aportar até R$ 600/mês
                        mantendo 3 meses de despesas em reserva de emergência.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-ai">
                    <FaWandMagicSparkles />
                    Plano pago · Conta+ AI Premium
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-white sm:text-4xl">
                    Consultor financeiro online que conhece suas contas
                  </h2>
                  <p className="mt-4 text-cp-muted leading-relaxed">
                    Diferente de um chat genérico, o consultor IA do Conta+ lê seus lançamentos,
                    categorias, metas e dívidas para dar respostas personalizadas — como um
                    assessor disponível 24 horas, direto no navegador.
                  </p>
                  <ul className="mt-6 space-y-3">
                    {PREMIUM_FEATURES.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-cp-muted">
                        <MdCheckCircle className="mt-0.5 shrink-0 text-ai" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 rounded-xl border border-white/[0.08] bg-cp-card px-4 py-3 text-xs text-cp-subtle">
                    <MdShield className="mb-1 inline text-primary" size={16} />{" "}
                    Seus dados financeiros são usados apenas para gerar análises quando você
                    solicita. Saiba mais na{" "}
                    <Link href="/politicadeprivacidade" className="text-brand-300 underline underline-offset-2 hover:text-brand-200">
                      Política de Privacidade
                    </Link>
                    .
                  </p>
                  <Link
                    href="/signup"
                    className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-ai to-planning px-8 py-3.5 text-sm font-semibold text-white shadow-glow-ai transition hover:brightness-110"
                  >
                    Criar conta e testar IA
                    <MdArrowForward />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison */}
          <section className="border-t border-white/[0.08] bg-cp-card/20 py-12 sm:py-16">
            <div className="mx-auto max-w-4xl px-3 sm:px-6">
              <h2 className="text-center text-xl font-bold text-white sm:text-3xl">
                Grátis para organizar. Premium para decidir melhor.
              </h2>
              <div className="mt-6 space-y-3 sm:hidden">
                {COMPARISON_ROWS.map((row) => (
                  <div
                    key={row.feature}
                    className="rounded-2xl border border-white/[0.08] bg-cp-card/50 p-4"
                  >
                    <p className="font-medium text-white">{row.feature}</p>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">Grátis</p>
                        <div className="mt-1 text-cp-muted">
                          {row.free === true ? (
                            <MdCheckCircle className="text-primary" size={20} />
                          ) : row.free === false ? (
                            <MdClose className="text-cp-subtle" size={20} />
                          ) : (
                            <span className="font-semibold text-white">{row.free}</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-ai">AI Premium</p>
                        <div className="mt-1 text-cp-muted">
                          {row.premium === true ? (
                            <MdCheckCircle className="text-ai" size={20} />
                          ) : (
                            <span className="font-semibold text-white">{row.premium}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-10 hidden overflow-x-auto rounded-2xl border border-white/[0.08] sm:block">
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-cp-card">
                      <th className="p-4 font-medium text-cp-subtle">Recurso</th>
                      <th className="p-4 font-medium text-primary">Grátis</th>
                      <th className="p-4 font-medium text-ai">AI Premium</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06] bg-cp-card/50">
                    {COMPARISON_ROWS.map((row) => (
                      <tr key={row.feature}>
                        <td className="p-4 text-cp-muted">{row.feature}</td>
                        <td className="p-4">
                          {row.free === true ? (
                            <MdCheckCircle className="text-primary" size={20} />
                          ) : row.free === false ? (
                            <MdClose className="text-cp-subtle" size={20} />
                          ) : (
                            <span className="font-semibold text-white">{row.free}</span>
                          )}
                        </td>
                        <td className="p-4">
                          {row.premium === true ? (
                            <MdCheckCircle className="text-ai" size={20} />
                          ) : (
                            <span className="font-semibold text-white">{row.premium}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section id="planos" className="scroll-mt-20 border-t border-white/[0.08] py-12 sm:py-24">
            <div className="mx-auto max-w-6xl px-3 sm:px-6">
              <div className="text-center">
                <p className="text-sm font-semibold uppercase tracking-wider text-ai">Planos</p>
                <h2 className="mt-2 text-2xl font-bold text-white sm:text-4xl">
                  Comece grátis hoje. Evolua quando fizer sentido.
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-cp-muted">
                  Não precisa escolher agora: crie sua conta gratuita, organize suas finanças e
                  assine o Premium depois, direto pelo app, via PIX.
                </p>
              </div>
              <div className="mt-8 grid gap-5 sm:mt-12 sm:gap-6 md:grid-cols-2 lg:mx-auto lg:max-w-4xl">
                <div className="rounded-3xl border border-primary/20 bg-cp-card p-5 sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                    Grátis · Para sempre
                  </p>
                  <p className="mt-3 text-4xl font-bold text-white">
                    R$ 0
                    <span className="text-base font-normal text-cp-subtle">/mês</span>
                  </p>
                  <p className="mt-2 text-sm text-cp-muted">
                    Ideal para quem quer organizar contas, metas e dívidas sem compromisso.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-cp-muted">
                    {FREE_FEATURES.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <MdCheckCircle className="mt-0.5 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="mt-8 flex w-full items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 py-3.5 text-sm font-semibold text-white transition hover:bg-primary/20"
                  >
                    Criar conta grátis
                  </Link>
                </div>
                <div className="relative rounded-3xl border border-ai/30 bg-gradient-to-b from-ai/15 to-cp-card p-5 shadow-glow-ai sm:p-8">
                  <span className="absolute -top-3 right-4 rounded-full bg-ai px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white sm:right-6 sm:text-xs">
                    Consultor IA
                  </span>
                  <p className="text-sm font-semibold uppercase tracking-wider text-ai">
                    AI Premium
                  </p>
                  <p className="mt-3 text-4xl font-bold text-white">
                    R$ 19,90
                    <span className="text-base font-normal text-cp-subtle">/mês</span>
                  </p>
                  <p className="mt-1 text-sm text-cp-subtle">
                    ou <span className="font-semibold text-white">R$ 199/ano</span> (economize 2 meses)
                  </p>
                  <p className="mt-2 text-sm text-cp-muted">
                    Consultor financeiro online que avalia suas contas e responde em tempo real.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-cp-muted">
                    {PREMIUM_FEATURES.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <MdCheckCircle className="mt-0.5 shrink-0 text-ai" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/signup"
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-ai to-planning py-3.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110"
                  >
                    <FaPix />
                    Criar conta e assinar depois
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Steps */}
          <section className="py-12 sm:py-24">
            <div className="mx-auto max-w-6xl px-3 sm:px-6">
              <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-4xl">
                Três passos para sair do caos financeiro
              </h2>
              <div className="mt-14 grid gap-8 md:grid-cols-3">
                {[
                  {
                    step: "01",
                    title: "Crie sua conta grátis",
                    desc: "Nome, e-mail e senha. Sem cartão, sem pegadinha.",
                  },
                  {
                    step: "02",
                    title: "Organize suas contas",
                    desc: "Lance movimentações ou importe extratos. Veja saldo e gráficos.",
                  },
                  {
                    step: "03",
                    title: "Decida com a IA (opcional)",
                    desc: "Assine o Premium quando quiser um consultor online analisando seus números.",
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-5 text-center sm:p-8"
                  >
                    <span className="text-5xl font-black text-brand-500/20">{s.step}</span>
                    <h3 className="mt-2 text-xl font-semibold text-white">{s.title}</h3>
                    <p className="mt-3 text-sm text-slate-400">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="border-t border-white/10 py-12 sm:py-24">
            <div className="mx-auto max-w-4xl px-3 text-center sm:px-6">
              <div className="rounded-3xl border border-brand-500/30 bg-gradient-to-br from-brand-500/20 via-cp-card to-cp-base p-6 sm:p-14">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl">
                  Suas contas organizadas começam aqui — de graça
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-slate-300">
                  Milhares de pessoas já usam o Conta+ para enxergar para onde vai o dinheiro.
                  O consultor IA Premium é o próximo passo quando você quiser decisões mais
                  inteligentes, sem planilha complicada.
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
                    Já tenho conta — Entrar
                  </button>
                </div>
              </div>
            </div>
          </section>

          <footer className="border-t border-white/10 py-10 sm:py-12">
            <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-3 sm:px-6">
              <BrandLogo size="default" href="/" />
              <div className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row sm:gap-8">
              <div className="grid w-full grid-cols-2 gap-x-4 gap-y-3 text-sm text-slate-500 sm:flex sm:w-auto sm:flex-wrap sm:justify-center sm:gap-6">
                <Link href="/termosdeuso" className="transition hover:text-brand-400">
                  Termos de uso
                </Link>
                <Link href="/politicadeprivacidade" className="transition hover:text-brand-400">
                  Privacidade
                </Link>
                <Link href="/politicadecookies" className="transition hover:text-brand-400">
                  Cookies
                </Link>
                <Link href="/manual" className="transition hover:text-brand-400">
                  Ajuda
                </Link>
              </div>
              <p className="text-center text-sm text-slate-600">
                © {new Date().getFullYear()} Conta+. Organize grátis · Consultor IA Premium.
              </p>
              </div>
            </div>
          </footer>
        </main>
      </div>

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-cp-base/70 backdrop-blur-sm" aria-hidden />
        <div className="fixed inset-0 flex items-end justify-center p-3 sm:items-center sm:p-4">
          <Dialog.Panel className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-cp-card p-5 shadow-2xl sm:p-8">
            <div className="mb-4 flex justify-center sm:justify-start">
              <BrandLogo size="compact" href="/" />
            </div>
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
                  className="w-full rounded-xl border border-white/10 bg-cp-base/80 px-4 py-3 text-white placeholder:text-cp-subtle focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
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
                    className="w-full rounded-xl border border-white/10 bg-cp-base/80 py-3 pl-4 pr-12 text-white placeholder:text-cp-subtle focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
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
                className="mt-2 w-full rounded-xl bg-primary py-3.5 font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:bg-primary-hover disabled:opacity-60"
              >
                {loading ? "Entrando…" : "Entrar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Não tem conta?{" "}
              <Link
                href="/signup"
                className="font-semibold text-brand-400 hover:text-brand-300"
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
