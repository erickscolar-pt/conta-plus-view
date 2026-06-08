import { FormEvent, useEffect, useRef, useState } from "react";
import { sendAiChat } from "@/services/ai";
import { getErrorMessage } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

type Message = { role: "user" | "assistant"; content: string };

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await sendAiChat(text, sessionId);
      setSessionId(res.sessionId);
      setMessages((m) => [...m, { role: "assistant", content: res.reply }]);
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Não foi possível enviar a mensagem.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[420px] flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="border-b border-white/10 px-4 py-3">
        <h3 className="text-sm font-medium text-slate-200">Chat Financeiro IA</h3>
        <p className="text-xs text-slate-500">
          Pergunte sobre gastos, metas, dívidas e decisões financeiras.
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500">
            Ex.: &quot;Quanto posso gastar este mês?&quot; ou &quot;Como quitar minhas dívidas?&quot;
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={`${msg.role}-${i}`}
            className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm ${
              msg.role === "user"
                ? "ml-auto bg-emerald-500/20 text-emerald-50"
                : "bg-slate-800/80 text-slate-200"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-sm text-slate-500">Conta+ AI está pensando...</div>
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta..."
            className="flex-1 rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none focus:border-emerald-500/50"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-400 disabled:opacity-50"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
