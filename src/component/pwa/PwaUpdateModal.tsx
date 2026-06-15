import { useCallback, useEffect, useState } from "react";
import { MdRefresh, MdSystemUpdate } from "react-icons/md";
import Modal from "@/component/ui/modal";
import { applyAppUpdate, subscribeToAppUpdates } from "@/utils/pwa";

export default function PwaUpdateModal() {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => subscribeToAppUpdates(() => setOpen(true)), []);

  const handleUpdate = useCallback(async () => {
    setUpdating(true);
    try {
      await applyAppUpdate();
    } catch {
      setUpdating(false);
    }
  }, []);

  return (
    <Modal isOpen={open} onClose={() => !updating && setOpen(false)} size="md" priority>
      <div className="space-y-5 text-center sm:text-left">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-dash/15 text-dash sm:mx-0">
          <MdSystemUpdate size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Nova versão disponível</h2>
          <p className="mt-2 text-sm leading-relaxed text-cp-muted">
            Há uma atualização do Conta+ pronta para instalar. Limpe o cache antigo e recarregue
            para ver as novidades — ícones, correções e melhorias.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={updating}
            className="rounded-xl border border-white/[0.08] px-4 py-2.5 text-sm font-medium text-cp-muted transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
          >
            Depois
          </button>
          <button
            type="button"
            onClick={() => void handleUpdate()}
            disabled={updating}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-70"
          >
            <MdRefresh size={18} className={updating ? "animate-spin" : ""} />
            {updating ? "Atualizando…" : "Limpar cache e atualizar"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
