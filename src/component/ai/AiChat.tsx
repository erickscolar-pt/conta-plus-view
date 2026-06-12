import { FormEvent, useEffect, useRef, useState } from "react";
import { sendAiChat } from "@/services/ai";
import { getErrorMessage } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

type Message = { role: "user" | "assistant"; content: string };

type Props = {
  seedMessage?: string;
  onMessageSent?: () => void;
  disabled?: boolean;
  disabledReason?: string;
};

export default function AiChat({ seedMessage, onMessageSent, disabled, disabledReason }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastSeed = useRef<string | undefined>();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

    try {
      const res = await sendAiChat(text.trim(), sessionId);
      setSessionId(res.sessionId);
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await submitMessage(input);
  }

  return (
    <div className="flex h-full min-h-[380px] flex-col">
      <div className="border-b border-white/[0.08] pb-3">
        <h3 className="text-sm font-medium text-white">Chat Financeiro</h3>
        <p className="text-xs text-cp-subtle">
          Pergunte sobre gastos, metas, dívidas e decisões.
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {disabled && disabledReason && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-200/90">
            {disabledReason}
          </p>
        )}
        {messages.length === 0 && !disabled && (
          <p className="text-sm text-cp-subtle">
            Ex.: &quot;Quanto posso gastar este mês?&quot; ou use os atalhos acima.
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
        {loading && (
          <div className="text-sm text-ai animate-pulse">Conta+ AI está pensando...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-white/[0.08] pt-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={disabled ? "Assine o Premium para usar o chat" : "Digite sua pergunta..."}
            className="flex-1 rounded-xl border border-white/[0.08] bg-cp-base px-3 py-2.5 text-sm text-white outline-none focus:border-ai/40 focus:ring-2 focus:ring-ai/20 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading || disabled}
          />
          <button
            type="submit"
            disabled={loading || disabled || !input.trim()}
            className="rounded-xl bg-gradient-to-r from-ai to-planning px-4 py-2.5 text-sm font-medium text-white shadow-glow-ai transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
