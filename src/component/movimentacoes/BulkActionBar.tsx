import { MdClose, MdDelete } from "react-icons/md";

type BulkActionBarProps = {
  selectedCount: number;
  itemLabel: string;
  actionLabel?: string;
  busy?: boolean;
  onClear: () => void;
  onConfirmAction: () => void;
};

export default function BulkActionBar({
  selectedCount,
  itemLabel,
  actionLabel = "Excluir selecionados",
  busy = false,
  onClear,
  onConfirmAction,
}: BulkActionBarProps) {
  if (selectedCount <= 0) return null;

  return (
    <div className="sticky top-0 z-20 mb-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-expense/40 bg-expense/15 px-3 py-2.5 shadow-card backdrop-blur-sm">
      <p className="text-sm font-medium text-white">
        {selectedCount} {itemLabel} selecionado{selectedCount === 1 ? "" : "s"}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          disabled={busy}
          className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-cp-muted hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
        >
          <MdClose size={16} />
          Limpar seleção
        </button>
        <button
          type="button"
          onClick={onConfirmAction}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-400 disabled:opacity-60"
        >
          <MdDelete size={16} />
          {busy ? "Processando…" : actionLabel}
        </button>
      </div>
    </div>
  );
}

export function SelectionCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-cp-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-white/20 bg-cp-base text-primary focus:ring-primary/40"
        aria-label={label}
      />
      <span className="sr-only sm:not-sr-only">{label}</span>
    </label>
  );
}
