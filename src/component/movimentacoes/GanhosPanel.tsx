import { Table } from "@/component/ui/table";
import { getErrorMessage, setupAPIClient } from "@/services/api";
import { AxiosError } from "axios";
import { formatCurrency, formatDate } from "@/helper";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/component/ui/modal";
import {
  modalInput,
  modalLabel,
  modalMuted,
  modalTitle,
} from "@/component/ui/modal/modalClasses";
import { ButtonPages } from "@/component/ui/buttonPages";
import Calendar from "@/component/ui/calendar";
import { toast } from "react-toastify";
import InputMoney from "@/component/ui/inputMoney";
import NotFound from "@/component/notfound";
import { Rendas, Usuario } from "@/model/type";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import MovimentacoesListControls from "@/component/movimentacoes/MovimentacoesListControls";
import { TruncatedCell } from "@/component/ui/TruncatedCell";
import GanhosMobileCards from "@/component/movimentacoes/GanhosMobileCards";

/** Valor para input type=date (yyyy-mm-dd) a partir da data salva na API */
function dateToInputValue(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Alinha à criação: +1 dia antes de enviar (createRenda muta a data igual) */
function buildDataInclusaoFromInput(yyyyMmDd: string): Date {
  const d = new Date(`${yyyyMmDd}T12:00:00`);
  d.setDate(d.getDate() + 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export type GanhosPanelProps = {
  rendas: Rendas[];
  usuario: Usuario;
  embedded?: boolean;
  onDataMutated?: () => void;
};

interface RequestData {
  nome_renda: string;
  valor: number;
  valor_pagamento_vinculo?: number;
  data_inclusao?: Date;
  vinculo_id?: number;
}

export default function GanhosPanel({
  rendas: initialRendas,
  usuario: _usuario,
  embedded = false,
  onDataMutated,
}: GanhosPanelProps) {
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [valor, setValor] = useState(0);
  const [nomeRenda, setNomeRenda] = useState("");
  const [createValor, setCreateValor] = useState(0);
  const [createNomeRenda, setCreateNomeRenda] = useState("");
  const [modalRendas, setModalRendas] = useState<Rendas>();
  const [editDataInclusao, setEditDataInclusao] = useState("");
  const [loading, setLoading] = useState(false);
  const [rendas, setRendas] = useState<Rendas[]>(initialRendas);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState<"day" | "month">("day");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);

  const filteredRendas = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rendas;
    return rendas.filter((r) => {
      const nome = (r.nome_renda || "").toLowerCase();
      const valorStr = String(r.valor ?? "");
      const dataStr = formatDate(r.data_inclusao).toLowerCase();
      return (
        nome.includes(q) ||
        valorStr.includes(q) ||
        dataStr.includes(q)
      );
    });
  }, [rendas, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredRendas.length / pageSize) || 1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, pageSize, rendas]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedRendas = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredRendas.slice(start, start + pageSize);
  }, [filteredRendas, safePage, pageSize]);

  const total = rendas.reduce(
    (acc: number, renda: Rendas) => acc + (renda.valor || 0),
    0,
  );
  const totalvinculo = rendas.reduce(
    (acc: number, renda: Rendas) =>
      acc + (renda.valor_pagamento_vinculo || 0),
    0,
  );

  const columns = [
    { title: "Valor", key: "valor", formatter: formatCurrency },
    {
      title: "Recebido de",
      key: "nome_renda",
      headerClassName: "min-w-0 max-w-[10rem] sm:max-w-[14rem] md:max-w-[18rem]",
      cellClassName: "min-w-0 max-w-[10rem] sm:max-w-[14rem] md:max-w-[18rem]",
      render: (r: Rendas) => (
        <TruncatedCell text={r.nome_renda} className="max-w-full" />
      ),
    },
    { title: "Pago dia", key: "data_inclusao", formatter: formatDate },
    {
      title: "Ações",
      key: "actions",
      render: (renda: Rendas) => (
        <div className="flex item-center justify-center space-x-4">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 hover:bg-sky-500/30"
            onClick={() => handleEdit(renda)}
          >
            <MdEdit size={20} />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30"
            onClick={() => handleDelete(renda)}
          >
            <MdDelete size={20} />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (renda: Rendas) => {
    setModalRendas(renda);
    setNomeRenda(renda.nome_renda);
    setValor(renda.valor);
    setEditDataInclusao(dateToInputValue(renda.data_inclusao));
    setIsModalEdit(true);
  };

  async function handleDelete(renda: Rendas) {
    setLoading(true);
    const apiClient = setupAPIClient();
    setIsModalEdit(false);
    const response = await apiClient.delete(`/rendas/${renda.id}`);
    if (response) {
      setLoading(false);
      toast.warning("Renda excluída!");
      await fetchRendas();
      onDataMutated?.();
    } else {
      toast.warning("Erro ao deletar renda");
    }
  }

  async function saveEdit(id: number | undefined) {
    if (id == null) return;
    if (!editDataInclusao) {
      toast.warning("Selecione a data do lançamento.");
      return;
    }
    setLoading(true);
    const apiClient = setupAPIClient();
    const requestData: RequestData = {
      nome_renda: nomeRenda,
      valor: valor,
      data_inclusao: buildDataInclusaoFromInput(editDataInclusao),
    };
    try {
      await apiClient.patch(`/rendas/${id}`, requestData);
      setIsModalEdit(false);
      toast.success("Renda atualizada com sucesso!");
      await fetchRendas();
      onDataMutated?.();
    } catch (e: unknown) {
      const msg =
        e instanceof AxiosError
          ? getErrorMessage(e.response?.data)
          : "Erro ao editar renda.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function createRenda(date: Date) {
    setLoading(true);
    if (!createNomeRenda || !createValor || !date) {
      toast.warning("Preencha todos os campos!");
      setLoading(false);
      return;
    }
    const apiClient = setupAPIClient();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    const requestData: RequestData = {
      nome_renda: createNomeRenda,
      valor: createValor,
      data_inclusao: date,
    };
    try {
      await apiClient.post(`/rendas`, requestData);
      setCreateNomeRenda("");
      setCreateValor(0);
      toast.success("Entrada criada com sucesso!");
      await fetchRendas();
      setIsModalCreate(false);
      onDataMutated?.();
    } catch (e: unknown) {
      const msg =
        e instanceof AxiosError
          ? getErrorMessage(e.response?.data)
          : "Não foi possível criar a entrada.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleCloseEdit = () => {
    setIsModalEdit(false);
    setEditDataInclusao("");
  };
  const handleCloseCreate = () => setIsModalCreate(false);

  const fetchRendas = async () => {
    const apiClient = setupAPIClient();
    try {
      if (filterDate !== "") {
        const response = await apiClient.get(
          `/rendas/${filterDate}/${filterType}`,
        );
        setRendas(response.data);
      } else {
        const response = await apiClient.get("/rendas");
        setRendas(response.data);
      }
    } catch {
      setRendas([]);
    }
  };

  const filterRendasByDate = async (date: Date, type: "day" | "month") => {
    const apiClient = setupAPIClient();
    try {
      if (date && type) {
        const formattedDate = date.toISOString().split("T")[0] + "T03:00:00Z";
        setFilterDate(formattedDate);
        setFilterType(type);
        const response = await apiClient.get(
          `/rendas/${formattedDate}/${type}`,
        );
        setRendas(response.data);
      } else {
        setRendas(initialRendas);
      }
    } catch {
      setRendas([]);
    }
  };

  useEffect(() => {
    fetchRendas();
  }, []);

  const btnClass = embedded
    ? "inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400"
    : "flex w-full items-center space-x-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 sm:w-auto";

  return (
    <>
      <div
        className={
          embedded ? "space-y-4" : "flex-1 space-y-6 p-2 sm:p-4 md:p-8"
        }
      >
        <header
          className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${embedded ? "mb-2" : "mb-8"}`}
        >
          <div>
            {!embedded && (
              <>
                <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">
                  Meus Ganhos
                </h1>
                <p className="text-slate-400">
                  Acompanhe suas rendas e salários.
                </p>
              </>
            )}
            {embedded && (
              <>
                <h2 className="text-lg font-semibold text-slate-100">
                  Entradas
                </h2>
                <p className="text-sm text-slate-400">
                  Salários, freelas e outros recebimentos.
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            className={btnClass}
            onClick={() => setIsModalCreate(true)}
          >
            <MdAdd size={20} />
            <span>Adicionar entrada</span>
          </button>
        </header>

        <div
          className={`min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-md backdrop-blur-sm ${embedded ? "p-4 sm:p-6" : "p-2 sm:p-4 md:p-6"}`}
        >
          <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <Calendar
              type={filterType}
              onDateSelect={filterRendasByDate}
              textButton="Filtrar"
            />
          </div>
          <MovimentacoesListControls
            searchPlaceholder="Buscar por descrição, valor ou data…"
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            pageSize={pageSize}
            onPageSizeChange={setPageSize}
            page={safePage}
            onPageChange={setPage}
            totalItems={filteredRendas.length}
            itemLabel="entradas"
          />
          {searchQuery.trim() && filteredRendas.length < rendas.length ? (
            <p className="mb-3 text-xs text-slate-500">
              Os totais no rodapé consideram todas as entradas do período, não só o resultado da busca.
            </p>
          ) : null}
          <div className="w-full min-w-0">
            {filteredRendas.length > 0 ? (
              <>
                <GanhosMobileCards
                  items={paginatedRendas}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                <div className="hidden md:block overflow-x-auto">
                  <Table
                    columns={columns}
                    data={paginatedRendas}
                    rowKey={(r) => r.id}
                  />
                </div>
              </>
            ) : rendas.length > 0 ? (
              <p className="py-10 text-center text-sm text-slate-400">
                Nenhuma entrada corresponde à pesquisa.
              </p>
            ) : (
              <NotFound />
            )}
          </div>
          <div className="mt-6 flex flex-col gap-4 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-slate-400">Total no filtro:</span>
              <span className="rounded-lg bg-emerald-500/20 px-4 py-2 font-bold text-emerald-200">
                {formatCurrency(total)}
              </span>
              {totalvinculo > 0 && (
                <>
                  <span className="font-medium text-slate-400">
                    Do vínculo:
                  </span>
                  <span className="rounded-lg bg-emerald-500/20 px-4 py-2 font-bold text-emerald-200">
                    {formatCurrency(totalvinculo)}
                  </span>
                  <span className="font-medium text-slate-400">Geral:</span>
                  <span className="rounded-lg bg-emerald-500/20 px-4 py-2 font-bold text-emerald-200">
                    {formatCurrency(totalvinculo + total)}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalEdit} onClose={handleCloseEdit} size="md">
        <div className="flex flex-col gap-4">
          <h2 className={modalTitle}>Editar entrada</h2>
          <label className="block">
            <span className={modalLabel}>Recebido de</span>
            <input
              type="text"
              value={nomeRenda}
              onChange={(e) => setNomeRenda(e.target.value)}
              className={modalInput}
            />
          </label>
          <label className="block">
            <span className={modalLabel}>Valor</span>
            <InputMoney value={valor} onChange={(v) => setValor(v)} />
          </label>
          <label className="block">
            <span className={modalLabel}>Data do lançamento</span>
            <input
              type="date"
              value={editDataInclusao}
              onChange={(e) => setEditDataInclusao(e.target.value)}
              className={modalInput}
            />
            <span className={`mt-1 block ${modalMuted}`}>
              Mesma regra da criação: o dia enviado à API é ajustado para o fluxo do sistema.
            </span>
          </label>
          <ButtonPages
            loading={loading}
            onClick={() => saveEdit(modalRendas?.id)}
          >
            Salvar
          </ButtonPages>
        </div>
      </Modal>
      <Modal isOpen={isModalCreate} onClose={handleCloseCreate} size="md">
        <div className="flex flex-col gap-4">
          <h2 className={modalTitle}>Nova entrada</h2>
          <label className="block">
            <span className={modalLabel}>Recebido de</span>
            <input
              onChange={(e) => setCreateNomeRenda(e.target.value)}
              type="text"
              value={createNomeRenda}
              className={modalInput}
            />
          </label>
          <label className="block">
            <span className={modalLabel}>Valor</span>
            <InputMoney
              value={createValor}
              onChange={(v) => setCreateValor(v)}
            />
          </label>
          <Calendar
            textButton="Salvar"
            hideType={true}
            type={"day"}
            onDateSelect={(date) => createRenda(date)}
          />
        </div>
      </Modal>
    </>
  );
}
