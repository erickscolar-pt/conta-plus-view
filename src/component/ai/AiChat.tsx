import { FormEvent, useEffect, useRef, useState } from "react";
import { confirmAiChatActions, sendAiChat } from "@/services/ai";
import { getErrorMessage } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import type { PendingActionView } from "@/types/ai";

type Message = { role: "user" | "assistant"; content: string };

type PeriodPreset = "30d" | "3m" | "6m" | "12m" | "ytd";

function periodRange(preset: PeriodPreset): { periodStart: string; periodEnd: string } {
  const end = new Date();
  const start = new Date();
  end.setHours(23, 59, 59, 999);
  start.setHours(0, 0, 0, 0);

  if (preset === "30d") start.setDate(start.getDate() - 30);
  else if (preset === "3m") start.setMonth(start.getMonth() - 3);
  else if (preset === "6m") start.setMonth(start.getMonth() - 6);
  else if (preset === "12m") start.setMonth(start.getMonth() - 12);
  else if (preset === "ytd") start.setMonth(0, 1);

  return {
    periodStart: start.toISOString().slice(0, 10),
    periodEnd: end.toISOString().slice(0, 10),
  };
}

const PERIOD_LABELS: Record<PeriodPreset, string> = {
  "30d": "30 dias",
  "3m": "3 meses",
  "6m": "6 meses",
  "12m": "12 meses",
  ytd: "Ano atual",
};

type Props = {
  seedMessage?: string;
  onMessageSent?: () => void;
  disabled?: boolean;
  disabledReason?: string;
};

const actionTypeLabel: Record<PendingActionView["type"], string> = {
  create_renda: "Nova entrada",
  create_divida: "Nova saída",
  create_objetivo: "Nova meta",
  update_renda: "Atualizar entrada",
  update_divida: "Atualizar saída",
  update_objetivo: "Atualizar meta",
  delete_renda: "Excluir entrada",
  delete_divida: "Excluir saída",
  delete_objetivo: "Excluir meta",
  mark_divida_paid: "Marcar saída",
  create_expense_category: "Nova categoria",
};

function actionConfirmHint(type: PendingActionView["type"]): string {
  if (type.startsWith("delete_")) return "confirme para excluir";
  if (type === "mark_divida_paid") return "confirme para marcar";
  if (type === "create_expense_category") return "confirme para criar categoria";
  if (type.startsWith("update_")) return "confirme para atualizar";
  return "confirme para cadastrar";
}

function isDeleteAction(type: PendingActionView["type"]): boolean {
  return type.startsWith("delete_");
}

function needsVinculoSelection(action: PendingActionView): boolean {
  return action.requiredInput?.field === "vinculoId";
}

export default function AiChat({ seedMessage, onMessageSent, disabled, disabledReason }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmingAll, setConfirmingAll] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const [periodPreset, setPeriodPreset] = useState<PeriodPreset>("3m");
  const [pendingActions, setPendingActions] = useState<PendingActionView[]>([]);
  const [vinculoByAction, setVinculoByAction] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastSeed = useRef<string | undefined>();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingActions]);

  useEffect(() => {
    if (!seedMessage || seedMessage === lastSeed.current) return;
    lastSeed.current = seedMessage;
    setInput(seedMessage);
  }, [seedMessage]);

  async function submitMessage(text: string) {
    if (!text.trim() || loading || disabled) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: text.trim() }]);
    setLoading(true);
    setPendingActions([]);
    setVinculoByAction({});

    try {
      const res = await sendAiChat(text.trim(), sessionId, periodRange(periodPreset));
      setSessionId(res.sessionId);
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
      setPendingActions(res.pendingActions ?? []);
      onMessageSent?.();
    } catch (error) {
      const status = (error as AxiosError).response?.status;
      if (status === 402) {
        toast.error("Créditos esgotados. Assine o Premium para continuar.");
      } else if (status === 503) {
        toast.error("IA em configuração. Tente novamente em instantes.");
      } else {
        toast.error(
          getErrorMessage((error as AxiosError).response?.data) ||
            "Não foi possível enviar a mensagem.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  function buildOverrides(actionIds: string[]) {
    return actionIds
      .filter((id) => vinculoByAction[id] != null)
      .map((actionId) => ({ actionId, vinculoId: vinculoByAction[actionId] }));
  }

  function canConfirmAction(action: PendingActionView): boolean {
    if (!needsVinculoSelection(action)) return true;
    return vinculoByAction[action.id] != null;
  }

  async function handleConfirmActions(actionIds: string[]) {
    if (!sessionId || confirmingId || confirmingAll || actionIds.length === 0) return;

    const blocked = pendingActions.filter(
      (a) => actionIds.includes(a.id) && !canConfirmAction(a),
    );
    if (blocked.length > 0) {
      toast.warning("Selecione com quem dividir a conta antes de confirmar.");
      return;
    }

    const single = actionIds.length === 1 ? actionIds[0] : null;
    if (single) setConfirmingId(single);
    else setConfirmingAll(true);

    try {
      const res = await confirmAiChatActions(sessionId, actionIds, buildOverrides(actionIds));
      setPendingActions((prev) => prev.filter((a) => !actionIds.includes(a.id)));
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);

      const failures = res.results.filter((r) => !r.success);
      const successes = res.results.filter((r) => r.success);
      if (successes.length > 0) {
        toast.success(
          successes.length === 1
            ? successes[0].message
            : `${successes.length} ações concluídas com sucesso.`,
        );
        onMessageSent?.();
      }
      if (failures.length > 0) {
        toast.error(failures.map((f) => f.message).join(" "));
      }
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Não foi possível confirmar o lançamento.",
      );
    } finally {
      setConfirmingId(null);
      setConfirmingAll(false);
    }
  }

  function handleDismissAction(actionId: string) {
    setPendingActions((prev) => prev.filter((a) => a.id !== actionId));
    setVinculoByAction((prev) => {
      const next = { ...prev };
      delete next[actionId];
      return next;
    });
  }

  function handleDismissAll() {
    setPendingActions([]);
    setVinculoByAction({});
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await submitMessage(input);
  }

  const confirmableIds = pendingActions.filter(canConfirmAction).map((a) => a.id);
  const showConfirmAll = pendingActions.length > 1;

  return (
    <div className="flex h-full min-h-[280px] flex-col sm:min-h-[380px]">
      <div className="border-b border-white/[0.08] pb-3">
        <h3 className="text-sm font-medium text-white">Chat Financeiro</h3>
        <p className="text-xs text-cp-subtle">
          Registre, atualize, recategorize importações ou ajuste lançamentos no período selecionado.
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(Object.keys(PERIOD_LABELS) as PeriodPreset[]).map((key) => (
            <button
              key={key}
              type="button"
              disabled={loading || disabled}
              onClick={() => setPeriodPreset(key)}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                periodPreset === key
                  ? "bg-primary/20 text-brand-200 ring-1 ring-primary/40"
                  : "bg-white/[0.04] text-cp-muted hover:text-white"
              }`}
            >
              {PERIOD_LABELS[key]}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {disabled && disabledReason && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200/90">
            {disabledReason}
          </p>
        )}
        {messages.length === 0 && !disabled && (
          <p className="text-sm text-cp-subtle">
            Ex.: &quot;Recategorize as saídas do extrato importado&quot;, &quot;Tem contas duplicadas em maio?&quot; ou
            &quot;Marca a luz como paga&quot; ou
            &quot;Quais gastos foram maiores nos últimos {PERIOD_LABELS[periodPreset].toLowerCase()}?&quot;
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className={`max-w-[90%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed ${
              msg.role === "user"
                ? "ml-auto bg-ai/20 text-white ring-1 ring-ai/25"
                : "bg-cp-card-secondary text-cp-muted"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {pendingActions.length > 0 && (
          <div className="space-y-2">
            {showConfirmAll && (
              <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-cp-card-secondary/50 px-3 py-2">
                <button
                  type="button"
                  onClick={() => handleConfirmActions(confirmableIds)}
                  disabled={!!confirmingId || confirmingAll || confirmableIds.length === 0}
                  className="rounded-lg bg-gradient-to-r from-ai to-planning px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {confirmingAll ? "Processando..." : `Confirmar todas (${confirmableIds.length})`}
                </button>
                <button
                  type="button"
                  onClick={handleDismissAll}
                  disabled={!!confirmingId || confirmingAll}
                  className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-cp-muted hover:text-white disabled:opacity-50"
                >
                  Cancelar todas
                </button>
              </div>
            )}
            {pendingActions.map((action) => (
              <div
                key={action.id}
                className={`rounded-2xl border px-3 py-3 text-sm ${
                  isDeleteAction(action.type)
                    ? "border-red-500/40 bg-red-500/10"
                    : "border-ai/30 bg-ai/10"
                }`}
              >
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${
                    isDeleteAction(action.type) ? "text-red-300" : "text-ai"
                  }`}
                >
                  {actionTypeLabel[action.type]} — {actionConfirmHint(action.type)}
                </p>
                <p className="mt-1 text-white">{action.summary}</p>

                {needsVinculoSelection(action) && action.requiredInput && (
                  <div className="mt-3">
                    <label className="mb-1 block text-xs text-cp-subtle">
                      {action.requiredInput.label}
                    </label>
                    <select
                      value={vinculoByAction[action.id] ?? ""}
                      onChange={(e) =>
                        setVinculoByAction((prev) => ({
                          ...prev,
                          [action.id]: Number(e.target.value),
                        }))
                      }
                      className="w-full rounded-lg border border-white/15 bg-cp-base px-2.5 py-2 text-sm text-white outline-none focus:border-ai/40"
                    >
                      <option value="">Selecione o parceiro</option>
                      {action.requiredInput.options.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmActions([action.id])}
                    disabled={!!confirmingId || confirmingAll || !canConfirmAction(action)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50 ${
                      isDeleteAction(action.type)
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-gradient-to-r from-ai to-planning"
                    }`}
                  >
                    {confirmingId === action.id
                      ? "Processando..."
                      : isDeleteAction(action.type)
                        ? "Confirmar exclusão"
                        : "Confirmar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDismissAction(action.id)}
                    disabled={!!confirmingId || confirmingAll}
                    className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-cp-muted hover:text-white disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {loading && (
          <div className="text-sm text-ai animate-pulse">Conta+ AI está pensando...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-white/[0.08] pt-3">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? "Assine o Premium para usar o chat" : "Digite sua pergunta..."}
            className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-cp-base px-3 py-2.5 text-base text-white outline-none focus:border-ai/40 focus:ring-2 focus:ring-ai/20 disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
            disabled={loading || disabled}
          />
          <button
            type="submit"
            disabled={loading || disabled || !input.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-ai to-planning px-4 py-2.5 text-sm font-medium text-white shadow-glow-ai transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}

