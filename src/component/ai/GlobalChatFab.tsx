import { useRouter } from "next/router";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { useChatShell } from "@/contexts/ChatShellContext";

export default function GlobalChatFab() {
  const router = useRouter();
  const { openChat, open } = useChatShell();

  if (router.pathname === "/ai" || open) return null;

  return (
    <button
      type="button"
      onClick={() => openChat()}
      className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom,0px))] right-4 z-[70] inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-ai to-dash px-4 py-3 text-sm font-semibold text-white shadow-glow-ai transition hover:brightness-110 lg:bottom-6 lg:right-6"
      aria-label="Abrir chat com IA"
    >
      <FaWandMagicSparkles className="text-base" />
      <span className="hidden sm:inline">Chat IA</span>
    </button>
  );
}
