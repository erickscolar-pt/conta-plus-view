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
import { TruncatedCell } from "@/component/ui/TruncatedCell";
import { formatCurrency } from "@/helper";
import { getErrorMessage } from "@/services/api";
import {
  cancelarTransferencia,
  listarTransferencias,
} from "@/services/transferencias";
import type { Transferencia, TransferenciasTotais } from "@/model/type";

const filterSelectClass =
  "min-w-[9rem] rounded-lg border border-white/10 bg-cp-base/80 px-2 py-1.5 text-sm text-white focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20";

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
    } catch {
      setItems([]);
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

  useEffect(() => {
    setPage(1);
  }, [searchQuery, direcao, periodStart, periodEnd]);

  async function handleCancel(t: Transferencia) {
    if (t.direcao !== "enviada" || t.status !== "concluida") return;
    setCanceling(true);
    try {
      await cancelarTransferencia(t.id);
      toast.success("Transferência cancelada nos dois lados.");
      setDetail(null);
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

  const columns = useMemo(
    () => [
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
    ],
    [],
  );

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
            }
          />

          {loading ? (
            <p className="py-10 text-center text-sm text-cp-muted">
              Carregando transferências…
            </p>
          ) : filtered.length > 0 ? (
            <>
              <TransferenciasMobileCards
                items={paginated}
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
