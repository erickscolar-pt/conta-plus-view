import { IconType } from "react-icons";
import { FaWandMagicSparkles } from "react-icons/fa6";
import {
  MdAutoAwesome,
  MdSavings,
  MdTrendingDown,
  MdAccountBalance,
} from "react-icons/md";
import { useChatShellOptional } from "@/contexts/ChatShellContext";
import Link from "next/link";

const PROMPTS: { label: string; message: string; icon: IconType }[] = [
  {
    label: "Analisar meu mês",
    icon: MdAutoAwesome,
    message: "Analise minhas finanças deste mês e resuma os pontos principais.",
  },
  {
    label: "Como economizar?",
    icon: MdSavings,
    message: "Com base no meu perfil financeiro, como posso economizar mais?",
  },
  {
    label: "Gastando demais?",
    icon: MdTrendingDown,
    message: "Estou gastando demais? Compare com padrões saudáveis.",
  },
  {
    label: "Quanto investir?",
    icon: MdAccountBalance,
    message: "Quanto posso investir com segurança este mês?",
  },
];

type Props = {
  compact?: boolean;
};

export default function AiChatPrompts({ compact }: Props) {
  const chat = useChatShellOptional();

  return (
    <section className="rounded-2xl border border-ai/25 bg-gradient-to-br from-ai/10 via-cp-card to-cp-card p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-ai">
            <FaWandMagicSparkles />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Consultor IA
            </span>
          </div>
          <h3 className="mt-1 text-base font-bold text-white sm:text-lg">
            Pergunte sobre seu dinheiro
          </h3>
          {!compact ? (
            <p className="mt-1 text-sm text-cp-muted">
              Respostas com base nas suas entradas, saídas e metas — confirme antes de
              alterar dados.
            </p>
          ) : null}
        </div>
        <Link
          href="/ai"
          className="shrink-0 text-xs font-medium text-brand-300 hover:text-white"
        >
          Abrir IA completa →
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {PROMPTS.map(({ label, message, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => chat?.openChat(message)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-cp-base/60 px-3 py-2 text-left text-xs font-medium text-cp-muted transition hover:border-ai/30 hover:bg-ai/10 hover:text-white sm:text-sm"
          >
            <Icon className="shrink-0 text-ai" size={16} />
            {label}
          </button>
        ))}
        {chat ? (
          <button
            type="button"
            onClick={() => chat.openChat()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary/15 px-3 py-2 text-xs font-semibold text-brand-300 transition hover:bg-primary/25 sm:text-sm"
          >
            Outra pergunta…
          </button>
        ) : null}
      </div>
    </section>
  );
}
