import type { ReactNode } from "react";
import { MdChevronLeft, MdChevronRight, MdSearch } from "react-icons/md";

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

type MovimentacoesListControlsProps = {
  searchPlaceholder: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  page: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  /** Rótulo plural para o resumo (ex.: entradas, saídas) */
  itemLabel?: string;
  /** Filtros extras (categoria, pago, etc.) — renderizados à direita da busca em telas grandes */
  extraFilters?: ReactNode;
};

export default function MovimentacoesListControls({
  searchPlaceholder,
  searchQuery,
  onSearchChange,
  pageSize,
  onPageSizeChange,
  page,
  onPageChange,
  totalItems,
  itemLabel = "registros",
  extraFilters,
}: MovimentacoesListControlsProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, totalItems);

  return (
    <div className="mb-4 flex flex-col gap-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="relative min-w-0 flex-1 lg:max-w-md">
          <MdSearch
            className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
            aria-hidden
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-2.5 pl-10 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            autoComplete="off"
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {extraFilters}
          <label className="flex items-center gap-2 text-sm text-slate-400">
            <span className="whitespace-nowrap">Itens por página</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1.5 text-sm text-slate-100 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {totalItems > 0 ? (
        <div className="flex flex-col gap-2 border-t border-white/5 pt-3 text-sm text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p className="tabular-nums">
            Mostrando{" "}
            <span className="font-medium text-slate-200">
              {start}–{end}
            </span>{" "}
            de{" "}
            <span className="font-medium text-slate-200">{totalItems}</span>{" "}
            {itemLabel}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => onPageChange(safePage - 1)}
              className="inline-flex items-center rounded-lg border border-white/10 bg-slate-900/80 px-2 py-1.5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Página anterior"
            >
              <MdChevronLeft className="h-5 w-5" />
            </button>
            <span className="min-w-[5rem] px-2 text-center tabular-nums text-slate-300">
              {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => onPageChange(safePage + 1)}
              className="inline-flex items-center rounded-lg border border-white/10 bg-slate-900/80 px-2 py-1.5 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Próxima página"
            >
              <MdChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
