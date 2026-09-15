import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  MdArrowBack,
  MdCheckCircle,
  MdPersonAddAlt,
  MdSearch,
  MdSwapHoriz,
} from "react-icons/md";
import Modal from "@/component/ui/modal";
import {
  modalInfo,
  modalInput,
  modalInset,
  modalLabel,
  modalMuted,
  modalScrollArea,
  modalSecondaryBtn,
  modalTitle,
} from "@/component/ui/modal/modalClasses";
import Button from "@/component/ui/Button";
import InputMoney from "@/component/ui/inputMoney";
import { formatCurrency } from "@/helper";
import type { PessoaConectada, Transferencia } from "@/model/type";
import {
  criarTransferencia,
  listarPessoasConectadas,
} from "@/services/transferencias";
import { getErrorMessage } from "@/services/api";

type Step = "form" | "confirm" | "success";

export type TransferenciaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  /** Chamado após criar, para as listas e KPIs recarregarem sem refresh manual. */
  onCreated?: (transferencia: Transferencia) => void;
};

function todayInputValue(): string {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function formatDateBr(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split("-");
  if (!y || !m || !d) return yyyyMmDd;
  return `${d}/${m}/${y}`;
}

export default function TransferenciaModal({
  isOpen,
  onClose,
  onCreated,
}: TransferenciaModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [pessoas, setPessoas] = useState<PessoaConectada[]>([]);
  const [loadingPessoas, setLoadingPessoas] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [destinatarioId, setDestinatarioId] = useState<number | null>(null);
  const [valor, setValor] = useState(0);
  const [data, setData] = useState(todayInputValue);
  const [descricao, setDescricao] = useState("");
  const [criada, setCriada] = useState<Transferencia | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    setStep("form");
    setSearch("");
    setDestinatarioId(null);
    setValor(0);
    setData(todayInputValue());
    setDescricao("");
    setCriada(null);

    let active = true;
    setLoadingPessoas(true);
    listarPessoasConectadas()
      .then((items) => {
        if (active) setPessoas(items);
      })
      .catch(() => {
        if (active) setPessoas([]);
      })
      .finally(() => {
        if (active) setLoadingPessoas(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  const pessoasFiltradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return pessoas;
    return pessoas.filter(
      (p) =>
        p.nome.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q),
    );
  }, [pessoas, search]);

  const destinatario = useMemo(
    () => pessoas.find((p) => p.id === destinatarioId) ?? null,
    [pessoas, destinatarioId],
  );

  function goToConfirm() {
    if (!destinatario) {
      toast.warning("Escolha para quem enviar.");
      return;
    }
    if (!valor || valor <= 0) {
      toast.warning("Informe um valor maior que zero.");
      return;
    }
    if (!data) {
      toast.warning("Informe a data da transferência.");
      return;
    }
    setStep("confirm");
  }

  async function handleConfirm() {
    if (!destinatario) return;
    setSaving(true);
    try {
      const transferencia = await criarTransferencia({
        destinatarioId: destinatario.id,
        valor,
        data,
        descricao: descricao.trim() || undefined,
      });
      setCriada(transferencia);
      setStep("success");
      toast.success(
        `Transferência realizada! ${formatCurrency(valor)} enviados para ${destinatario.nome}.`,
      );
      onCreated?.(transferencia);
    } catch (e: unknown) {
      const msg =
        e instanceof AxiosError
          ? getErrorMessage(e.response?.data)
          : "Não foi possível enviar a transferência.";
      toast.error(msg);
      setStep("form");
    } finally {
      setSaving(false);
    }
  }

  const semPessoas = !loadingPessoas && pessoas.length === 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className={`flex flex-col gap-4 ${modalScrollArea}`}>
        <header className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
            <MdSwapHoriz size={22} />
          </span>
          <div>
            <h2 className={modalTitle}>
              {step === "success"
                ? "Transferência enviada!"
                : step === "confirm"
                  ? "Enviar transferência?"
                  : "Transferência entre pessoas"}
            </h2>
            <p className={modalMuted}>
              {step === "form"
                ? "Envie dinheiro para alguém que também usa o Conta+. A transferência será registrada automaticamente nas duas contas."
                : step === "confirm"
                  ? "Confira os dados antes de confirmar."
                  : "A operação já aparece nas duas contas."}
            </p>
          </div>
        </header>

        {step === "form" && (
          <>
            {semPessoas ? (
              <div className={modalInset}>
                <p className="text-sm font-medium text-white">
                  Você ainda não possui pessoas conectadas.
                </p>
                <p className={modalMuted}>
                  Conecte uma pessoa ao Conta+ para enviar ou receber
                  transferências automaticamente.
                </p>
                <Link
                  href="/perfil"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
                >
                  <MdPersonAddAlt size={18} />
                  Convidar pessoa
                </Link>
              </div>
            ) : (
              <>
                <div className={modalInset}>
                  <span className={modalLabel}>Para quem?</span>

                  <div className="relative">
                    <MdSearch
                      size={18}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cp-subtle"
                    />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar por nome ou @usuário…"
                      className={`${modalInput} !mt-0 pl-9`}
                      aria-label="Buscar pessoa conectada"
                    />
                  </div>

                  {loadingPessoas ? (
                    <p className={modalMuted}>Carregando pessoas conectadas…</p>
                  ) : pessoasFiltradas.length === 0 ? (
                    <p className={modalMuted}>
                      Nenhuma pessoa conectada corresponde à busca.
                    </p>
                  ) : (
                    <ul
                      className="max-h-52 space-y-2 overflow-y-auto"
                      role="radiogroup"
                      aria-label="Pessoas conectadas"
                    >
                      {pessoasFiltradas.map((p) => {
                        const selected = p.id === destinatarioId;
                        return (
                          <li key={p.id}>
                            <button
                              type="button"
                              role="radio"
                              aria-checked={selected}
                              onClick={() => setDestinatarioId(p.id)}
                              className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                                selected
                                  ? "border-primary/40 bg-primary/10"
                                  : "border-white/[0.08] bg-cp-card hover:bg-white/[0.04]"
                              }`}
                            >
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium text-white">
                                  {p.nome}
                                </span>
                                <span className="block truncate text-xs text-cp-subtle">
                                  @{p.username}
                                </span>
                              </span>
                              <span className="shrink-0 rounded-full bg-income/15 px-2 py-0.5 text-[11px] font-semibold text-income ring-1 ring-income/25">
                                ✓ Vinculada
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <label className="block">
                  <span className={modalLabel}>Valor</span>
                  <InputMoney value={valor} onChange={setValor} />
                </label>

                <label className="block">
                  <span className={modalLabel}>Data</span>
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className={modalInput}
                  />
                </label>

                <label className="block">
                  <span className={modalLabel}>Descrição (opcional)</span>
                  <input
                    type="text"
                    value={descricao}
                    maxLength={100}
                    onChange={(e) => setDescricao(e.target.value)}
                    placeholder="Ex.: Divisão da conta do mês"
                    className={modalInput}
                  />
                  <span className={`mt-1 block ${modalMuted}`}>
                    {descricao.length}/100
                  </span>
                </label>

                <p className={modalInfo}>
                  A transferência será registrada automaticamente nas duas
                  contas e não conta como receita nem despesa.
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button type="button" className={modalSecondaryBtn} onClick={onClose}>
                    Cancelar
                  </button>
                  <Button variant="primary" onClick={goToConfirm}>
                    {valor > 0
                      ? `Enviar ${formatCurrency(valor)}`
                      : "Enviar transferência"}
                  </Button>
                </div>
              </>
            )}
          </>
        )}

        {step === "confirm" && destinatario && (
          <>
            <dl className={modalInset}>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>Para</dt>
                <dd className="text-right text-sm font-medium text-white">
                  {destinatario.nome}
                  <span className="block text-xs text-cp-subtle">
                    @{destinatario.username}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>Valor</dt>
                <dd className="text-right text-base font-semibold tabular-nums text-white">
                  {formatCurrency(valor)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>Data</dt>
                <dd className="text-right text-sm text-white">
                  {formatDateBr(data)}
                </dd>
              </div>
              {descricao.trim() && (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className={modalMuted}>Descrição</dt>
                  <dd className="text-right text-sm text-white">
                    {descricao.trim()}
                  </dd>
                </div>
              )}
            </dl>

            <p className={modalInfo}>
              A operação será registrada automaticamente nas duas contas.
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className={modalSecondaryBtn}
                onClick={() => setStep("form")}
                disabled={saving}
              >
                <MdArrowBack size={16} className="mr-1" />
                Voltar
              </button>
              <button type="button" className={modalSecondaryBtn} onClick={onClose} disabled={saving}>
                Cancelar
              </button>
              <Button variant="primary" loading={saving} onClick={() => void handleConfirm()}>
                Confirmar transferência
              </Button>
            </div>
          </>
        )}

        {step === "success" && criada && (
          <>
            <div className="flex flex-col items-center gap-2 py-2">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-income/15 text-income ring-1 ring-income/25">
                <MdCheckCircle size={30} />
              </span>
              <p className="text-2xl font-bold tabular-nums text-white">
                - {formatCurrency(criada.valor)}
              </p>
              <p className={modalMuted}>
                Enviados para {criada.contraparte.nome}
              </p>
            </div>

            <dl className={modalInset}>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>Data</dt>
                <dd className="text-sm text-white">{formatDateBr(criada.data)}</dd>
              </div>
              {criada.descricao && (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className={modalMuted}>Descrição</dt>
                  <dd className="text-right text-sm text-white">
                    {criada.descricao}
                  </dd>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>Status</dt>
                <dd className="text-sm font-medium text-income">Concluída</dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>ID da operação</dt>
                <dd className="font-mono text-sm text-white">
                  {criada.operationId}
                </dd>
              </div>
            </dl>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className={modalSecondaryBtn}
                onClick={() => setStep("form")}
              >
                Nova transferência
              </button>
              <Button variant="primary" onClick={onClose}>
                Ver no extrato
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
