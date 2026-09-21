import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {
  MdAdd,
  MdInfoOutline,
  MdSwapHoriz,
} from "react-icons/md";
import { Table } from "@/component/ui/table";
import Modal from "@/component/ui/modal";
import Button from "@/component/ui/Button";
import Calendar from "@/component/ui/calendar";
import NotFound from "@/component/notfound";
import {
  modalInfo,
  modalInset,
  modalMuted,
  modalSecondaryBtn,
  modalTitle,
} from "@/component/ui/modal/modalClasses";
import MovimentacoesListControls from "@/component/movimentacoes/MovimentacoesListControls";
import TransferenciaModal from "@/component/movimentacoes/TransferenciaModal";
import TransferenciasMobileCards from "@/component/movimentacoes/TransferenciasMobileCards";
import BulkActionBar, {
  SelectionCheckbox,
} from "@/component/movimentacoes/BulkActionBar";
import { TruncatedCell } from "@/component/ui/TruncatedCell";
import { formatCurrency } from "@/helper";
import { getErrorMessage, setupAPIClient } from "@/services/api";
import {
  cancelarTransferencia,
  listarTransferencias,
} from "@/services/transferencias";
import type { Transferencia, TransferenciasTotais } from "@/model/type";

const filterSelectClass =
  "min-w-[9rem] rounded-lg border border-white/10 bg-cp-base/80 px-2 py-1.5 text-sm text-white focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20";

function canCancelTransferencia(t: Transferencia) {
  return t.direcao === "enviada" && t.status === "concluida";
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function ymd(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function currentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { periodStart: ymd(start), periodEnd: ymd(end) };
}

function formatDateBr(yyyyMmDd: string): string {
  const [y, m, d] = yyyyMmDd.split("-");
  if (!y || !m || !d) return yyyyMmDd;
  return `${d}/${m}/${y}`;
}

type DirecaoFiltro = "todas" | "enviadas" | "recebidas";

export type TransferenciasPanelProps = {
  embedded?: boolean;
  openCreateSignal?: number;
  onDataMutated?: () => void;
};

export default function TransferenciasPanel({
  embedded = false,
  openCreateSignal = 0,
  onDataMutated,
}: TransferenciasPanelProps) {
  const initialRange = useMemo(() => currentMonthRange(), []);
  const [items, setItems] = useState<Transferencia[]>([]);
  const [internas, setInternas] = useState<
    Array<{
      id: number;
      valor: number;
      data: string;
      descricao: string | null;
      origemLabel: string;
      destinoLabel: string;
    }>
  >([]);
  const [totals, setTotals] = useState<TransferenciasTotais>({
    enviadas: 0,
    recebidas: 0,
    saldo: 0,
  });
  const [periodStart, setPeriodStart] = useState(initialRange.periodStart);
  const [periodEnd, setPeriodEnd] = useState(initialRange.periodEnd);
  const [direcao, setDirecao] = useState<DirecaoFiltro>("todas");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [detail, setDetail] = useState<Transferencia | null>(null);
  const [canceling, setCanceling] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [bulkBusy, setBulkBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const result = await listarTransferencias({
        periodStart,
        periodEnd,
        direcao,
        limit: 200,
      });
      setItems(result.items);
      setTotals(result.totals);
      try {
        const { data } = await setupAPIClient().get("/files/internal-transfers", {
          params: { start: periodStart, end: periodEnd },
        });
        setInternas(Array.isArray(data) ? data : []);
      } catch {
        setInternas([]);
      }
    } catch {
      setItems([]);
      setInternas([]);
      setTotals({ enviadas: 0, recebidas: 0, saldo: 0 });
    } finally {
      setLoading(false);
    }
  }, [periodStart, periodEnd, direcao]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (openCreateSignal && openCreateSignal > 0) {
      setCreateOpen(true);
    }
  }, [openCreateSignal]);

  const filterByDate = (date: Date, type: "day" | "month") => {
    if (type === "day") {
      const day = ymd(date);
      setPeriodStart(day);
      setPeriodEnd(day);
      return;
    }
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setPeriodStart(ymd(start));
    setPeriodEnd(ymd(end));
  };

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((t) => {
      const hay = [
        t.descricao ?? "",
        t.contraparte.nome,
        t.contraparte.username,
        t.operationId,
        t.direcao,
        formatCurrency(t.valor),
        formatDateBr(t.data),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [items, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const paginated = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const cancellableOnPage = paginated.filter(canCancelTransferencia);

  const pageAllSelected =
    cancellableOnPage.length > 0 &&
    cancellableOnPage.every((t) => selectedIds.has(t.id));

  function toggleSelect(id: number, next: boolean) {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      if (next) copy.add(id);
      else copy.delete(id);
      return copy;
    });
  }

  function toggleSelectPage(next: boolean) {
    setSelectedIds((prev) => {
      const copy = new Set(prev);
      for (const t of cancellableOnPage) {
        if (next) copy.add(t.id);
        else copy.delete(t.id);
      }
      return copy;
    });
  }

  useEffect(() => {
    setPage(1);
  }, [searchQuery, direcao, periodStart, periodEnd]);

  useEffect(() => {
    setSelectedIds(new Set());
  }, [items]);

  async function handleCancel(t: Transferencia) {
    if (!canCancelTransferencia(t)) return;
    if (
      !window.confirm(
        "Cancelar esta transferência? Os dois lados (enviada e recebida) serão desfeitos.",
      )
    ) {
      return;
    }
    setCanceling(true);
    try {
      await cancelarTransferencia(t.id);
      toast.success("Transferência cancelada nos dois lados.");
      setDetail(null);
      setSelectedIds((prev) => {
        const copy = new Set(prev);
        copy.delete(t.id);
        return copy;
      });
      await load();
      onDataMutated?.();
    } catch (e: unknown) {
      const msg =
        e instanceof AxiosError
          ? getErrorMessage(e.response?.data)
          : "Não foi possível cancelar.";
      toast.error(msg);
    } finally {
      setCanceling(false);
    }
  }

  async function handleBulkCancel() {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (
      !window.confirm(
        `Cancelar ${ids.length} transferência(s) selecionada(s)? Os dois lados de cada operação serão desfeitos.`,
      )
    ) {
      return;
    }
    setBulkBusy(true);
    try {
      const { data } = await setupAPIClient().post<{
        canceled: number;
        failed: number[];
      }>("/transferencias/bulk-cancel", { ids });
      toast.success(
        data.failed?.length
          ? `${data.canceled} cancelada(s); ${data.failed.length} falharam.`
          : `${data.canceled} transferência(s) cancelada(s).`,
      );
      setSelectedIds(new Set());
      await load();
      onDataMutated?.();
    } catch (e: unknown) {
      toast.error(
        e instanceof AxiosError
          ? getErrorMessage(e.response?.data)
          : "Não foi possível cancelar as transferências.",
      );
    } finally {
      setBulkBusy(false);
    }
  }

  const columns = [
    {
      title: "",
      key: "select",
      render: (t: Transferencia) =>
        canCancelTransferencia(t) ? (
          <input
            type="checkbox"
            checked={selectedIds.has(t.id)}
            onChange={(e) => toggleSelect(t.id, e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-cp-base text-primary focus:ring-primary/40"
            aria-label={`Selecionar transferência ${t.operationId}`}
          />
        ) : (
          <span className="inline-block w-4" aria-hidden />
        ),
    },
    {
      title: "Data",
      key: "data",
      render: (t: Transferencia) => formatDateBr(t.data),
    },
    {
      title: "Descrição",
      key: "descricao",
      render: (t: Transferencia) => (
        <TruncatedCell
          text={
            t.descricao ||
            (t.direcao === "enviada"
              ? `PIX para ${t.contraparte.nome}`
              : `PIX de ${t.contraparte.nome}`)
          }
        />
      ),
    },
    {
      title: "Tipo",
      key: "direcao",
      render: (t: Transferencia) => (
        <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-semibold text-primary ring-1 ring-primary/25">
          {t.direcao === "enviada"
            ? "Transferência enviada"
            : "Transferência recebida"}
        </span>
      ),
    },
    {
      title: "Pessoa",
      key: "contraparte.nome",
      render: (t: Transferencia) => (
        <div>
          <p className="text-sm text-white">{t.contraparte.nome}</p>
          <p className="text-xs text-cp-subtle">@{t.contraparte.username}</p>
        </div>
      ),
    },
    {
      title: "Valor",
      key: "valor",
      render: (t: Transferencia) => {
        const cancelada = t.status !== "concluida";
        return (
          <span
            className={`font-semibold tabular-nums ${
              cancelada
                ? "text-cp-subtle line-through"
                : t.direcao === "enviada"
                  ? "text-expense"
                  : "text-income"
            }`}
          >
            {t.direcao === "enviada" ? "- " : "+ "}
            {formatCurrency(t.valor)}
          </span>
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (t: Transferencia) =>
        t.status === "concluida" ? "Concluída" : "Cancelada",
    },
    {
      title: "Ações",
      key: "acoes",
      render: (t: Transferencia) => (
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg border border-white/[0.08] px-2.5 py-1.5 text-xs text-cp-muted transition hover:bg-white/[0.04] hover:text-white"
          onClick={() => setDetail(t)}
        >
          <MdInfoOutline size={14} />
          Detalhes
        </button>
      ),
    },
  ];

  const btnClass = embedded
    ? "inline-flex items-center gap-2 rounded-xl bg-primary/20 px-4 py-2.5 text-sm font-semibold text-primary ring-1 ring-primary/30 transition hover:bg-primary/30"
    : "flex w-full items-center space-x-2 rounded-xl bg-primary/20 px-4 py-2.5 text-primary ring-1 ring-primary/30 transition hover:bg-primary/30 sm:w-auto";

  return (
    <>
      <div
        className={
          embedded ? "space-y-4" : "flex-1 space-y-6 p-2 sm:p-4 md:p-8"
        }
      >
        <header className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-semibold text-white">Transferências</h2>
            <p className="text-sm text-cp-muted">
              Dinheiro entre pessoas conectadas. Não entra em receitas nem em
              despesas, mas altera o saldo.
            </p>
          </div>
          <button
            type="button"
            className={btnClass}
            onClick={() => setCreateOpen(true)}
          >
            <MdAdd size={20} />
            <span>Nova transferência</span>
          </button>
        </header>

        <div
          className={`min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-cp-card shadow-card ${embedded ? "p-4 sm:p-6" : "p-2 sm:p-4 md:p-6"}`}
        >
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Calendar
              type="month"
              onDateSelect={filterByDate}
              textButton="Filtrar"
            />
          </div>
          <MovimentacoesListControls
            searchPlaceholder="Buscar por pessoa, descrição ou ID…"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            page={safePage}
            onPageChange={setPage}
            totalItems={filtered.length}
            itemLabel="transferências"
            extraFilters={
              <>
                {cancellableOnPage.length > 0 ? (
                  <SelectionCheckbox
                    checked={pageAllSelected}
                    onChange={toggleSelectPage}
                    label="Selecionar página"
                  />
                ) : null}
                <label className="flex items-center gap-2 text-sm text-cp-muted">
                  Direção
                  <select
                    className={filterSelectClass}
                    value={direcao}
                    onChange={(e) =>
                      setDirecao(e.target.value as DirecaoFiltro)
                    }
                  >
                    <option value="todas">Todas</option>
                    <option value="enviadas">Enviadas</option>
                    <option value="recebidas">Recebidas</option>
                  </select>
                </label>
              </>
            }
          />
          <BulkActionBar
            selectedCount={selectedIds.size}
            itemLabel="transferência"
            actionLabel="Cancelar selecionadas"
            busy={bulkBusy}
            onClear={() => setSelectedIds(new Set())}
            onConfirmAction={() => void handleBulkCancel()}
          />

          {loading ? (
            <p className="py-10 text-center text-sm text-cp-muted">
              Carregando transferências…
            </p>
          ) : filtered.length > 0 ? (
            <>
              <TransferenciasMobileCards
                items={paginated}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onDetail={setDetail}
              />
              <div className="hidden overflow-x-auto md:block">
                <Table
                  columns={columns}
                  data={paginated}
                  rowKey={(t: Transferencia) => t.id}
                  minWidthClassName="min-w-[960px]"
                />
              </div>
            </>
          ) : items.length > 0 ? (
            <p className="py-10 text-center text-sm text-cp-muted">
              Nenhuma transferência corresponde à pesquisa.
            </p>
          ) : (
            <NotFound />
          )}

          {internas.length > 0 ? (
            <div className="mt-6 rounded-xl border border-white/10 bg-cp-card-secondary/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-dash">
                Entre minhas contas
              </p>
              <p className="mt-1 text-xs text-cp-muted">
                Pix da mesma titularidade — não conta como gasto nem como renda.
              </p>
              <ul className="mt-3 space-y-2">
                {internas.map((row) => (
                  <li
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm text-white/90"
                  >
                    <span>
                      {formatDateBr(row.data)} · {row.origemLabel} → {row.destinoLabel}
                    </span>
                    <span className="tabular-nums font-medium">
                      {formatCurrency(row.valor)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-cp-muted">Enviadas:</span>
              <span className="rounded-lg bg-expense/20 px-3 py-1.5 font-bold text-red-100">
                {formatCurrency(totals.enviadas)}
              </span>
              <span className="font-medium text-cp-muted">Recebidas:</span>
              <span className="rounded-lg bg-income/20 px-3 py-1.5 font-bold text-green-100">
                {formatCurrency(totals.recebidas)}
              </span>
              <span className="font-medium text-cp-muted">Saldo:</span>
              <span className="rounded-lg bg-primary/20 px-3 py-1.5 font-bold text-primary">
                {formatCurrency(totals.saldo)}
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-cp-subtle">
              <MdSwapHoriz size={14} />
              Transferências não entram no comprometimento da renda.
            </p>
          </div>
        </div>
      </div>

      <TransferenciaModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          void load();
          onDataMutated?.();
        }}
      />

      <Modal
        isOpen={Boolean(detail)}
        onClose={() => setDetail(null)}
        size="md"
      >
        {detail ? (
          <div className="flex flex-col gap-4">
            <h2 className={modalTitle}>
              {detail.direcao === "enviada"
                ? "Transferência enviada"
                : "Transferência recebida"}
            </h2>
            <p className={modalMuted}>
              Esta é uma transferência interna entre usuários Conta+. Os dois
              lados pertencem à mesma operação.
            </p>
            <dl className={modalInset}>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>
                  {detail.direcao === "enviada" ? "Para" : "De"}
                </dt>
                <dd className="text-right text-sm font-medium text-white">
                  {detail.contraparte.nome}
                  <span className="block text-xs text-cp-subtle">
                    @{detail.contraparte.username}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>Valor</dt>
                <dd
                  className={`text-right text-base font-semibold tabular-nums ${
                    detail.direcao === "enviada" ? "text-expense" : "text-income"
                  }`}
                >
                  {detail.direcao === "enviada" ? "- " : "+ "}
                  {formatCurrency(detail.valor)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>Data</dt>
                <dd className="text-sm text-white">
                  {formatDateBr(detail.data)}
                </dd>
              </div>
              {detail.descricao ? (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className={modalMuted}>Descrição</dt>
                  <dd className="text-right text-sm text-white">
                    {detail.descricao}
                  </dd>
                </div>
              ) : null}
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>Status</dt>
                <dd className="text-sm font-medium text-white">
                  {detail.status === "concluida" ? "Concluída" : "Cancelada"}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className={modalMuted}>ID</dt>
                <dd className="font-mono text-sm text-white">
                  {detail.operationId}
                </dd>
              </div>
            </dl>
            <p className={modalInfo}>
              Cancelar desfaz os dois lados de uma vez. Não é possível apagar
              só o seu lançamento.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                className={modalSecondaryBtn}
                onClick={() => setDetail(null)}
              >
                Fechar
              </button>
              {detail.direcao === "enviada" && detail.status === "concluida" ? (
                <Button
                  variant="expense"
                  loading={canceling}
                  onClick={() => void handleCancel(detail)}
                >
                  Cancelar transferência
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}
      </Modal>
    </>
  );
}
