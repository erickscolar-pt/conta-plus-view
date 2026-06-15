import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { MdClose, MdOpenInNew } from "react-icons/md";
import { FaWandMagicSparkles } from "react-icons/fa6";
import AiChat from "@/component/ai/AiChat";
import { AiCreditsBadge } from "@/component/ai/AiScoreCard";
import { useChatShell } from "@/contexts/ChatShellContext";
import { fetchAiCredits } from "@/services/ai";
import type { AiCreditsStatus } from "@/types/ai";

export default function ChatDrawer() {
  const { open, seedMessage, closeChat } = useChatShell();
  const [credits, setCredits] = useState<AiCreditsStatus | null>(null);
  const [creditsLoading, setCreditsLoading] = useState(false);

  const refreshCredits = useCallback(async () => {
    setCreditsLoading(true);
    try {
      setCredits(await fetchAiCredits());
    } catch {
      setCredits(null);
    } finally {
      setCreditsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    void refreshCredits();
  }, [open, refreshCredits]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const chatLocked = creditsLoading || !credits?.canUseChat;
  const chatDisabledReason = chatLocked
    ? creditsLoading
      ? "Verificando seu plano…"
      : !credits?.aiReady
        ? "IA em configuração no servidor. Tente em instantes."
        : credits?.premium
          ? "Chat indisponível no momento."
          : (credits?.chat.remaining ?? 0) <= 0
            ? "Mensagens grátis esgotadas. Assine o Premium."
            : "Chat indisponível."
    : undefined;

  return (
    <>
      <button
        type="button"
        aria-label="Fechar chat"
        className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm"
        onClick={closeChat}
      />
      <aside
        className="fixed inset-y-0 right-0 z-[90] flex w-full max-w-lg flex-col border-l border-white/[0.08] bg-cp-base shadow-card sm:max-w-md"
        role="dialog"
        aria-label="Chat IA Conta+"
      >
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/[0.06] bg-cp-card/80 px-4 py-4 backdrop-blur-xl">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-ai">
              <FaWandMagicSparkles className="shrink-0" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Consultor IA
              </span>
            </div>
            <h2 className="mt-1 text-lg font-bold text-white">Conta+ AI</h2>
            <p className="text-xs text-cp-muted">Pergunte sobre suas finanças reais</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/ai"
              onClick={closeChat}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-cp-muted transition hover:bg-white/[0.06] hover:text-white"
              title="Abrir página completa"
            >
              <MdOpenInNew size={18} />
            </Link>
            <button
              type="button"
              onClick={closeChat}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-cp-muted transition hover:bg-white/[0.06] hover:text-white"
              aria-label="Fechar"
            >
              <MdClose size={22} />
            </button>
          </div>
        </header>

        <div className="shrink-0 border-b border-white/[0.06] px-4 py-2">
          <AiCreditsBadge credits={credits} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
          <AiChat
            key={seedMessage ?? "default"}
            seedMessage={seedMessage}
            onMessageSent={() => void refreshCredits()}
            disabled={chatLocked}
            disabledReason={chatDisabledReason}
          />
        </div>
      </aside>
    </>
  );
}
