import { FormEvent, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { MdWarningAmber } from "react-icons/md";
import { setupAPIClient, getErrorMessage } from "@/services/api";

export const FINANCIAL_RESET_PHRASE = "RECOMECAR DO ZERO";

type ResetResult = {
  ok: boolean;
  deleted?: {
    rendas: number;
    dividas: number;
    objetivos: number;
    transferenciasCanceladas: number;
  };
};

export default function ResetFinancialPanel() {
  const [phrase, setPhrase] = useState("");
  const [understood, setUnderstood] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!understood) {
      toast.warning("Confirme que entendeu as consequências.");
      return;
    }
    if (phrase.trim() !== FINANCIAL_RESET_PHRASE) {
      toast.warning(`Digite exatamente: ${FINANCIAL_RESET_PHRASE}`);
      return;
    }
    if (
      !window.confirm(
        "ÚLTIMA CONFIRMAÇÃO\n\nIsso apaga entradas, saídas, metas, listas de mercado e cancela transferências em que você participa.\n\nParceiros vinculados e assinatura NÃO são removidos, mas dívidas espelhadas e transferências afetam a outra conta.\n\nDeseja continuar?",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const { data } = await setupAPIClient().post<ResetResult>(
        "/user/reset-financial-data",
        { confirmation: FINANCIAL_RESET_PHRASE },
      );
      const d = data.deleted;
      toast.success(
        d
          ? `Base reiniciada: ${d.rendas} entradas, ${d.dividas} saídas, ${d.objetivos} metas, ${d.transferenciasCanceladas} transferências canceladas.`
          : "Base financeira reiniciada.",
      );
      setPhrase("");
      setUnderstood(false);
      window.setTimeout(() => window.location.reload(), 800);
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Não foi possível reiniciar a base.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-red-500/35 bg-red-500/10 p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/20 text-red-200 ring-1 ring-red-500/30">
          <MdWarningAmber size={22} />
        </span>
        <div className="min-w-0 space-y-2">
          <h3 className="text-sm font-semibold text-red-100">
            Recomeçar do zero
          </h3>
          <p className="text-xs leading-relaxed text-cp-muted">
            Apaga <strong className="text-white/90">todas as entradas, saídas,
            metas e listas de mercado</strong>, e{" "}
            <strong className="text-white/90">cancela transferências</strong> em
            que você participa. O histórico de IA também é limpo.
          </p>
          <p className="text-xs leading-relaxed text-amber-100/90">
            Mantém: perfil, vínculos, notificações push e assinatura. Dívidas
            compartilhadas e transferências podem sumir/ser canceladas na conta
            do parceiro.
          </p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-4 space-y-3">
        <label className="flex items-start gap-2 text-xs text-cp-muted">
          <input
            type="checkbox"
            checked={understood}
            onChange={(e) => setUnderstood(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-cp-base text-red-500 focus:ring-red-500/40"
          />
          <span>
            Entendo que a ação é irreversível e que pode afetar o extrato de
            pessoas vinculadas.
          </span>
        </label>

        <label className="block space-y-1">
          <span className="text-xs font-medium text-cp-muted">
            Digite{" "}
            <code className="rounded bg-cp-base/80 px-1.5 py-0.5 font-mono text-[11px] text-red-100">
              {FINANCIAL_RESET_PHRASE}
            </code>{" "}
            para confirmar
          </span>
          <input
            type="text"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value.toUpperCase())}
            autoComplete="off"
            spellCheck={false}
            placeholder={FINANCIAL_RESET_PHRASE}
            className="w-full rounded-xl border border-red-500/30 bg-cp-base/80 px-3 py-2.5 font-mono text-sm text-white placeholder:text-cp-subtle focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
          />
        </label>

        <button
          type="submit"
          disabled={
            loading ||
            !understood ||
            phrase.trim() !== FINANCIAL_RESET_PHRASE
          }
          className="inline-flex w-full items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        >
          {loading ? "Apagando…" : "Apagar tudo e recomeçar"}
        </button>
      </form>
    </div>
  );
}
