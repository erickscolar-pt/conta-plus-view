import { useEffect, useState, type ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdCheckCircle, MdPerson, MdPieChart } from "react-icons/md";
import { setupAPIClient } from "@/services/api";

function queryParam(
  q: string | string[] | undefined,
): string | undefined {
  if (typeof q === "string") return q;
  if (Array.isArray(q) && q[0]) return q[0];
  return undefined;
}

function Shell({
  children,
  title,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <Head>
        <title>{title}</title>
      </Head>
      <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-10 md:py-16">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400/90">
            Conta+
          </p>
          <p className="mt-1 text-sm text-slate-500">Gestão financeira compartilhada</p>
        </header>
        {children}
      </div>
    </div>
  );
}

export default function CodigoPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [vinculado, setVinculado] = useState(false);
  const [who, setWho] = useState("");
  const [semCodigo, setSemCodigo] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;

    const codigo = queryParam(router.query.c);
    if (!codigo) {
      setSemCodigo(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const apiClient = setupAPIClient();
        const response = await apiClient.post(`/user/invite/${codigo}`);
        const data = response.data;
        if (!cancelled && data.inviteAccept) {
          setVinculado(true);
          setWho(data.inviteAccept[0].with);
        }
      } catch (error) {
        console.error("Erro ao vincular usuário:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router.isReady, router.query.c]);

  if (loading) {
    return (
      <Shell title="Conta+ | Confirmando vínculo">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/10">
            <AiOutlineLoading3Quarters
              className="h-8 w-8 animate-spin text-emerald-400"
              aria-hidden
            />
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-100">Confirmando convite…</p>
            <p className="mt-2 max-w-sm text-sm text-slate-400">
              Estamos criando o vínculo entre as contas. Isso leva só um instante.
            </p>
          </div>
        </div>
      </Shell>
    );
  }

  if (semCodigo) {
    return (
      <Shell title="Conta+ | Link incompleto">
        <div className="rounded-2xl border border-amber-500/25 bg-amber-500/5 p-6 shadow-xl ring-1 ring-white/5 backdrop-blur-sm md:p-8">
          <div className="flex flex-col items-center text-center">
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/40 bg-amber-500/15 text-2xl text-amber-200"
              aria-hidden
            >
              ?
            </span>
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
              Link incompleto
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Este endereço precisa incluir o código do convite{" "}
              <code className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-xs text-emerald-300">
                ?c=...
              </code>
              . Peça à pessoa que convidou para enviar o link novamente, ou abra o convite
              direto da notificação no app.
            </p>
            <Link
              href="/perfil"
              className="mt-8 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
            >
              <MdPerson size={20} aria-hidden />
              Ir ao perfil
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (vinculado) {
    const nomeParceiro = who.trim() || "seu parceiro";

    return (
      <Shell title="Conta+ | Vínculo aceito">
        <div className="flex flex-1 flex-col">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-emerald-950/20 ring-1 ring-white/5 backdrop-blur-md md:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-full bg-emerald-400/20 blur-xl" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-emerald-400/40 bg-gradient-to-br from-emerald-500/30 to-emerald-600/10">
                  <MdCheckCircle className="h-11 w-11 text-emerald-400" aria-hidden />
                </div>
              </div>

              <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
                Vínculo aceito
              </h1>
              <p className="mt-2 text-base text-slate-400">
                Você e{" "}
                <span className="font-semibold text-emerald-300">{nomeParceiro}</span>{" "}
                agora compartilham contas no Conta+.
              </p>
            </div>

            <ul className="mt-8 space-y-3 rounded-xl border border-white/5 bg-slate-950/50 px-4 py-4 text-left text-sm text-slate-300">
              <li className="flex gap-3">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>
                  Movimentações, metas e dívidas podem passar a considerar esse vínculo,
                  conforme as regras de cada tela.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 text-emerald-500" aria-hidden>
                  ✓
                </span>
                <span>
                  Em <strong className="font-medium text-slate-200">Perfil</strong>, você
                  vê quem está vinculado e pode gerenciar o compartilhamento.
                </span>
              </li>
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/dashboard"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 sm:flex-none sm:min-w-[200px]"
              >
                <MdPieChart size={20} aria-hidden />
                Ir para o painel
              </Link>
              <Link
                href="/perfil"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-center text-sm font-semibold text-slate-100 transition hover:bg-white/10 sm:flex-none sm:min-w-[200px]"
              >
                <MdPerson size={20} aria-hidden />
                Ver perfil e vínculos
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-slate-600">
            Dúvidas sobre o que é compartilhado? Consulte o manual ou o aviso em cada
            tela do app.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell title="Conta+ | Não foi possível vincular">
      <div className="rounded-2xl border border-red-500/25 bg-red-500/5 p-6 shadow-xl ring-1 ring-white/5 backdrop-blur-sm md:p-8">
        <div className="flex flex-col items-center text-center">
          <span
            className="flex h-14 w-14 items-center justify-center rounded-full border border-red-400/35 bg-red-500/15 text-2xl text-red-200"
            aria-hidden
          >
            !
          </span>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
            Não foi possível concluir
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
            O código pode estar incorreto, expirado ou o vínculo já existir. Confira o link
            recebido ou peça um novo convite em{" "}
            <strong className="font-medium text-slate-300">Perfil → Convidar por link</strong>
            .
          </p>
          <Link
            href="/perfil"
            className="mt-8 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
          >
            <MdPerson size={20} aria-hidden />
            Ir ao perfil
          </Link>
        </div>
      </div>
    </Shell>
  );
}
