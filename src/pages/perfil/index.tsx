import { useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Head from "next/head";
import { AxiosError } from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { getErrorMessage, setupAPIClient } from "@/services/api";
import { formatDate, isValidUsername } from "@/helper";
import { Usuario } from "@/model/type";
import { MdContentCopy, MdLink, MdPersonRemove, MdSave } from "react-icons/md";
import { copyTextToClipboard } from "@/utils/copyToClipboard";

export type PendingInviteSummary = {
  inviterUserId: number;
  inviteeUserId: number;
  inviterNome: string;
  inviterUsername: string;
  inviteeNome: string;
  inviteeUsername: string;
  inviteCode: string;
  createdAt?: string;
  expiresAt?: string;
  hrefPath: string;
  fullLink: string | null;
};

export type VinculoComoConvidadoSummary = {
  id: number;
  parceiroNome: string;
  parceiroUsername: string;
};

export type InvitesSummary = {
  pendingReceived: PendingInviteSummary[];
  pendingSent: PendingInviteSummary[];
  vinculosComoConvidado: VinculoComoConvidadoSummary[];
};

const emptyInvitesSummary: InvitesSummary = {
  pendingReceived: [],
  pendingSent: [],
  vinculosComoConvidado: [],
};

interface Usuarios {
  usuario: Usuario;
  invitesSummary: InvitesSummary;
}

export default function Perfil({ usuario, invitesSummary }: Usuarios) {
  const router = useRouter();
  const [nome, setNome] = useState(usuario.nome);
  const [username, setUsername] = useState(usuario.username);
  const [email, setEmail] = useState(usuario.email);
  const [inviteIdentifier, setInviteIdentifier] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [guestLabel, setGuestLabel] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async () => {
    try {
      if (!isValidUsername(username)) {
        toast.error(
          "O nome de usuário deve conter apenas letras, números e caracteres especiais permitidos.",
          { position: toast.POSITION.BOTTOM_RIGHT },
        );
        toast.warning("Exemplo: nome_de_usuario", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return;
      }
      const apiClient = setupAPIClient();
      await apiClient.put("/user/att", { nome, username, email });
      toast.success("Alterações salvas com sucesso!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      const msg =
        error instanceof AxiosError
          ? getErrorMessage(error.response?.data)
          : "Erro ao salvar as alterações. Tente novamente mais tarde.";
      toast.error(msg, { position: toast.POSITION.BOTTOM_RIGHT });
    }
  };

  async function handleDeleteVinculo(id: number) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.delete(`/vinculo/${id}`);
      toast.warning("Conta desvinculada!", { position: toast.POSITION.TOP_RIGHT });
      router.replace(router.asPath);
    } catch (error) {
      const msg =
        error instanceof AxiosError
          ? getErrorMessage(error.response?.data)
          : "Não foi possível remover o vínculo.";
      toast.error(msg, { position: toast.POSITION.TOP_CENTER });
    }
  }

  const handleGenerateInviteLink = async () => {
    const trimmed = inviteIdentifier.trim();
    if (!trimmed) {
      toast.error("Informe o e-mail ou nome de usuário da outra pessoa.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    try {
      setLoading(true);
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/user/invite-link", {
        identifier: trimmed,
      });
      const link = response.data.link as string;
      const guest = response.data.guest as string;
      setInviteLink(link);
      setGuestLabel(guest);
      const copied = await copyTextToClipboard(link);
      if (copied) {
        toast.success(
          `Link gerado para ${guest}. Já copiamos para a área de transferência — envie por WhatsApp ou onde preferir.`,
          { position: toast.POSITION.TOP_RIGHT },
        );
      } else {
        toast.success(`Link gerado para ${guest}. Use “Copiar link” abaixo.`, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      const msg =
        error instanceof AxiosError
          ? getErrorMessage(error.response?.data)
          : "Não foi possível gerar o link. Verifique os dados e tente de novo.";
      toast.error(msg, { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!inviteLink) return;
    const ok = await copyTextToClipboard(inviteLink);
    if (ok) {
      toast.success("Link copiado!", { position: toast.POSITION.TOP_RIGHT });
    } else {
      toast.error("Não foi possível copiar. Selecione o link e copie manualmente.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  const vinculos = usuario.contavinculo ?? [];
  const { pendingReceived, pendingSent, vinculosComoConvidado } =
    invitesSummary ?? emptyInvitesSummary;

  async function copyFullLink(link: string | null) {
    if (!link) {
      toast.error("Link indisponível. Gere o convite de novo em Convidar por link.", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
    const ok = await copyTextToClipboard(link);
    if (ok) {
      toast.success("Link copiado!", { position: toast.POSITION.TOP_RIGHT });
    } else {
      toast.error("Não foi possível copiar.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  }

  return (
    <>
      <Head>
        <title>Perfil | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-4 py-6 md:px-10 md:py-8">
          <div className="mx-auto max-w-4xl space-y-6">
            <header>
              <h1 className="text-2xl font-bold tracking-tight text-slate-50 md:text-3xl">
                Meu perfil
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Dados da conta e quem pode ver suas movimentações compartilhadas.
              </p>
            </header>

            <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-sm md:p-8">
              <h2 className="text-lg font-semibold text-slate-100">Dados pessoais</h2>
              <form
                className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2"
                onSubmit={(e) => e.preventDefault()}
              >
                <div>
                  <label
                    className="block text-sm font-medium text-slate-400"
                    htmlFor="name"
                  >
                    Nome
                  </label>
                  <input
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 shadow-sm transition placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    id="name"
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-slate-400"
                    htmlFor="username"
                  >
                    Nome de usuário
                  </label>
                  <input
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    className="block text-sm font-medium text-slate-400"
                    htmlFor="email"
                  >
                    E-mail
                  </label>
                  <input
                    className="mt-1 block w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 shadow-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </form>
              <div className="mt-8 flex justify-end border-t border-white/10 pt-6 max-md:justify-stretch">
                <button
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 max-md:w-full"
                  onClick={handleSaveChanges}
                  type="button"
                >
                  <MdSave size={18} />
                  Salvar alterações
                </button>
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm backdrop-blur-sm">
                <h2 className="text-lg font-semibold text-slate-100">
                  Pessoas com quem compartilho
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Convites pendentes, quem ainda não aceitou e vínculos já ativos — evita mandar o
                  mesmo convite sem precisar.
                </p>

                <h3 className="mt-5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Convites pendentes (para você)
                </h3>
                <ul className="mt-2 space-y-2">
                  {pendingReceived.length > 0 ? (
                    pendingReceived.map((row) => (
                      <li
                        key={`recv-${row.inviterUserId}-${row.inviteeUserId}`}
                        className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3"
                      >
                        <p className="text-sm font-medium text-slate-200">
                          {row.inviterNome}{" "}
                          <span className="text-slate-400">
                            (@{row.inviterUsername})
                          </span>
                        </p>
                        {row.expiresAt ? (
                          <p className="mt-1 text-xs text-slate-500">
                            Válido até {formatDate(row.expiresAt)}
                          </p>
                        ) : null}
                        {row.inviteCode ? (
                          <Link
                            href={row.hrefPath}
                            className="mt-2 inline-block text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                          >
                            Abrir convite →
                          </Link>
                        ) : (
                          <p className="mt-2 text-xs text-slate-500">
                            Este convite foi gerado antes da atualização do app. Peça um novo link
                            à pessoa que convidou.
                          </p>
                        )}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-500">
                      Nenhum convite aguardando sua aceitação.
                    </li>
                  )}
                </ul>

                <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Convites que você enviou (aguardando aceite)
                </h3>
                <ul className="mt-2 space-y-2">
                  {pendingSent.length > 0 ? (
                    pendingSent.map((row) => (
                      <li
                        key={`sent-${row.inviterUserId}-${row.inviteeUserId}`}
                        className="flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-slate-200">
                            {row.inviteeNome || row.inviteeUsername}{" "}
                            <span className="text-slate-400">
                              (@{row.inviteeUsername || "—"})
                            </span>
                          </p>
                          {row.expiresAt ? (
                            <p className="mt-0.5 text-xs text-slate-500">
                              Expira em {formatDate(row.expiresAt)}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white transition hover:bg-white/15"
                          onClick={() => void copyFullLink(row.fullLink)}
                        >
                          <MdContentCopy size={16} />
                          Copiar link
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-500">
                      Nenhum convite seu pendente de aceite.
                    </li>
                  )}
                </ul>

                <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Vínculos ativos — você convidou
                </h3>
                <ul className="mt-2 space-y-2">
                  {vinculos.length > 0 ? (
                    vinculos.map((v, idx) => (
                      <li
                        key={v.id ?? idx}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3"
                      >
                        <span className="truncate text-sm font-medium text-slate-200">
                          {v.username}
                        </span>
                        <button
                          className="shrink-0 rounded-lg bg-red-500/15 p-2 text-red-300 transition hover:bg-red-500/25"
                          onClick={() => handleDeleteVinculo(v.id)}
                          type="button"
                          title="Remover vínculo"
                        >
                          <MdPersonRemove size={20} />
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-500">
                      Ninguém aceitou seu convite ainda (ou você não convidou ninguém).
                    </li>
                  )}
                </ul>

                <h3 className="mt-6 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Vínculos ativos — você foi convidado
                </h3>
                <ul className="mt-2 space-y-2">
                  {vinculosComoConvidado.length > 0 ? (
                    vinculosComoConvidado.map((v) => (
                      <li
                        key={v.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/40 px-4 py-3"
                      >
                        <span className="truncate text-sm font-medium text-slate-200">
                          {v.parceiroNome}{" "}
                          <span className="text-slate-400">
                            (@{v.parceiroUsername})
                          </span>
                        </span>
                        <button
                          className="shrink-0 rounded-lg bg-red-500/15 p-2 text-red-300 transition hover:bg-red-500/25"
                          onClick={() => handleDeleteVinculo(v.id)}
                          type="button"
                          title="Remover vínculo"
                        >
                          <MdPersonRemove size={20} />
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="rounded-xl border border-dashed border-white/10 px-4 py-4 text-sm text-slate-500">
                      Você não está vinculado como convidado de nenhuma conta.
                    </li>
                  )}
                </ul>
              </section>

              <section className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-500/10 to-slate-900/40 p-6 shadow-sm ring-1 ring-emerald-500/20 backdrop-blur-sm">
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                    <MdLink size={22} aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-slate-100">
                      Convidar por link
                    </h2>
                    <p className="mt-1 text-sm text-slate-400">
                      Informe o e-mail ou o nome de usuário de quem{" "}
                      <strong className="font-semibold text-emerald-300">já tem cadastro</strong>.
                      Geramos um link único; você copia e envia como quiser (não enviamos e-mail
                      pelo app).
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                  <input
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/25"
                    placeholder="E-mail ou @usuário do convidado"
                    type="text"
                    value={inviteIdentifier}
                    onChange={(e) => setInviteIdentifier(e.target.value)}
                    autoComplete="off"
                  />
                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 disabled:opacity-60"
                    disabled={loading}
                    onClick={handleGenerateInviteLink}
                    type="button"
                  >
                    {loading ? (
                      <AiOutlineLoading3Quarters className="animate-spin" size={20} />
                    ) : null}
                    Gerar link e copiar
                  </button>
                </div>

                {inviteLink ? (
                  <div className="mt-5 rounded-xl border border-white/10 bg-slate-900/60 p-4">
                    {guestLabel ? (
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-300">
                        Convite para {guestLabel}
                      </p>
                    ) : null}
                    <p className="mt-2 break-all font-mono text-sm text-slate-200">{inviteLink}</p>
                    <button
                      className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/15"
                      onClick={handleCopyInviteLink}
                      type="button"
                    >
                      <MdContentCopy size={18} />
                      Copiar novamente
                    </button>
                  </div>
                ) : null}
              </section>
            </div>
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  try {
    const user = await apiClient.get("/user/get");
    let invitesSummary: InvitesSummary = emptyInvitesSummary;
    try {
      const summary = await apiClient.get<InvitesSummary>("/user/invites/summary");
      invitesSummary = summary.data;
    } catch {
      /* Mongo ou rota indisponível: página ainda carrega */
    }

    return {
      props: {
        usuario: user.data,
        invitesSummary,
      },
    };
  } catch {
    return {
      redirect: {
        destination: "/movimentacoes",
        permanent: false,
      },
    };
  }
});
