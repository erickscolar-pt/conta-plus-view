import { Table } from "@/component/ui/table";
import { getErrorMessage, setupAPIClient } from "@/services/api";
import { AxiosError } from "axios";
import { formatCurrency, formatDate } from "@/helper";
import { useEffect, useMemo, useState } from "react";
import Modal from "@/component/ui/modal";
import {
  modalInfo,
  modalInput,
  modalInset,
  modalLabel,
  modalMuted,
  modalSelect,
  modalTitle,
} from "@/component/ui/modal/modalClasses";
import { ButtonPages } from "@/component/ui/buttonPages";
import Calendar from "@/component/ui/calendar";
import { toast } from "react-toastify";
import InputMoney from "@/component/ui/inputMoney";
import NotFound from "@/component/notfound";
import { Toggle } from "@/component/ui/toggle";
import { Dividas, ITipoDivida, Rendas, Usuario } from "@/model/type";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import MovimentacoesListControls from "@/component/movimentacoes/MovimentacoesListControls";
import { TruncatedCell } from "@/component/ui/TruncatedCell";
import GastosMobileCards from "@/component/movimentacoes/GastosMobileCards";

const filterSelectClass =
  "min-w-[9rem] rounded-lg border border-white/10 bg-slate-950/80 px-2 py-1.5 text-sm text-slate-100 focus:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/20";

export interface GastosPanelProps {
  dividas: Dividas[];
  rendas: Rendas[];
  usuario: Usuario;
  tipodivida: ITipoDivida[];
  embedded?: boolean;
  onDataMutated?: () => void;
}
interface RequestData {
  nome_divida: string;
  valor: number;
  valor_debito_vinculo?: number;
  data_inclusao?: Date;
  vinculo_id?: number;
  ref_debt?: number;
  installments?: number;
  tipoDividaId: number;
}
export default function GastosPanel({
  dividas: initialDividas,
  rendas: initialRendas,
  usuario,
  tipodivida,
  embedded = false,
  onDataMutated,
}: GastosPanelProps) {
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [valor, setValor] = useState(0);
  const [nomeDivida, setNomeDivida] = useState("");
  const [selectedValueEdit, setSelectedValueEdit] = useState("");
  const [createValorDebt, setCreateValorDebt] = useState(0);
  const [tipoDividaSelected, setTipoDividaSelected] = useState("");
  const [tipoDividaEditSelected, setTipoDividaEditSelected] = useState(0);
  const [createValor, setCreateValor] = useState(0);
  const [refDebt, setRefDebt] = useState(0);
  const [editValorDebt, setEditValorDebt] = useState(0);
  const [createNomeDivida, setCreateNomeDivida] = useState("");
  const [createVinculo, setCreateVinculo] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [modalDividas, setModalDividas] = useState<Dividas>();
  const [loading, setLoading] = useState(false);
  const [dividas, setDividas] = useState<Dividas[]>(initialDividas);
  const [rendas, setRendas] = useState<Rendas[]>(initialRendas);
  const [isInstallments, setIsInstallments] = useState(false);
  const [installments, setInstallments] = useState(1);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState<"day" | "month">("day");
  const [debtTypes, setDebtTypes] = useState<ITipoDivida[]>(tipodivida ?? []);
  const [newDebtTypeName, setNewDebtTypeName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "unpaid">(
    "all",
  );
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredDividas = useMemo(() => {
    let list = [...dividas];
    if (paymentFilter === "paid") {
      list = list.filter((d) => d.payment === true);
    } else if (paymentFilter === "unpaid") {
      list = list.filter((d) => !d.payment);
    }
    if (categoryFilter !== "all") {
      const cid = Number(categoryFilter);
      list = list.filter((d) => d.tipo_divida_id === cid);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter((d) => {
        const cat =
          debtTypes
            .find((t) => t.id === d.tipo_divida_id)
            ?.nome?.toLowerCase() ?? "";
        return (
          (d.nome_divida || "").toLowerCase().includes(q) ||
          (d.username || "").toLowerCase().includes(q) ||
          cat.includes(q) ||
          String(d.valor ?? "").includes(q) ||
          String(d.quantoVouPagar ?? "").includes(q) ||
          formatDate(d.data_inclusao).toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [
    dividas,
    searchQuery,
    paymentFilter,
    categoryFilter,
    debtTypes,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDividas.length / pageSize) || 1,
  );

  useEffect(() => {
    setPage(1);
  }, [searchQuery, pageSize, dividas, paymentFilter, categoryFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const safePage = Math.min(Math.max(1, page), totalPages);

  const paginatedDividas = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredDividas.slice(start, start + pageSize);
  }, [filteredDividas, safePage, pageSize]);

  const total = dividas.reduce(
    (acc: number, divida: Dividas) => acc + (divida.quantoVouPagar || 0),
    0
  );
  const totalPago = dividas.reduce(
    (acc: number, divida: Dividas) =>
      acc + ((divida.payment === true && divida.quantoVouPagar) || 0),
    0
  );
  const totalRendas = rendas.reduce(
    (acc: number, renda: Rendas) => acc + (renda.valor || 0),
    0
  );

  const getTipoDivida = (tipoDividaId: number) => {
    const tipoDivida = debtTypes.find((tipo) => tipo.id === tipoDividaId);
    return tipoDivida ? tipoDivida.nome : "Categoria não encontrada";
  };

  const columns = [
    {
      title: "Conta",
      key: "nome_divida",
      headerClassName: "min-w-0 max-w-[10rem] sm:max-w-[14rem] md:max-w-[18rem]",
      cellClassName: "min-w-0 max-w-[10rem] sm:max-w-[14rem] md:max-w-[18rem]",
      render: (d: Dividas) => (
        <TruncatedCell text={d.nome_divida} className="max-w-full" />
      ),
    },
    { title: "Valor do boleto", key: "valor", formatter: formatCurrency },
    {
      title: "Categoria",
      key: "tipo_divida_id",
      headerClassName: "w-[7.5rem] max-w-[9rem]",
      cellClassName: "w-[7.5rem] max-w-[9rem]",
      render: (d: Dividas) => (
        <TruncatedCell
          text={getTipoDivida(d.tipo_divida_id ?? 0)}
          className="max-w-full"
        />
      ),
    },
    {
      title: "Vou dividir com",
      key: "username",
      headerClassName: "max-w-[7rem]",
      cellClassName: "max-w-[7rem]",
      render: (d: Dividas) => (
        <TruncatedCell text={d.username} className="max-w-full" />
      ),
    },
    {
      title: "Quanto meu parceiro(a) paga",
      key: "valor_debito_vinculo",
      formatter: formatCurrency,
    },
    {
      title: "Quanto vou pagar",
      key: "quantoVouPagar",
      formatter: formatCurrency,
    },
    { title: "N° Parcela", key: "plot" },
    { title: "Vence dia", key: "data_inclusao", formatter: formatDate },
    {
      title: "Pago",
      key: "",
      render: (divida: Dividas) => (
        <Toggle
          key={divida.id}
          checked={divida.payment}
          onChange={(e) => handleTogglePaid(divida.id, e.target.checked)}
        />
      ),
    },
    {
      title: "",
      key: "edit",
      render: (divida: Dividas) =>
        divida.is_edit && (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/30 text-white hover:bg-sky-500/50"
            onClick={() => handleEdit(divida)}
            title="Editar"
          >
            <MdEdit size={24} className="text-white" />
          </button>
        ),
    },
    {
      title: "",
      key: "delete",
      render: (divida: Dividas) =>
        divida.is_edit && (
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/40 text-white hover:bg-red-500/60"
            onClick={() => handleDelete(divida)}
            title="Excluir"
          >
            <MdDelete size={24} className="text-white" />
          </button>
        ),
    },
  ];

  async function handleTogglePaid(id: number, check: boolean) {
    const apiClient = setupAPIClient();

    try {
      const response = await apiClient.patch(`/dividas/payment/${id}/${check}`);
      if (response.status === 200) {
        setDividas((prevDividas) =>
          prevDividas.map((divida) => {
            if (divida.id === id) {
              return { ...divida, payment: check };
            } else {
              return divida;
            }
          })
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar pagamento:", error);
    }
  }

  const handleEdit = (divida: Dividas) => {
    if (divida.vinculo) {
      setSelectedValueEdit(JSON.stringify(divida.vinculo.id));
    }
    setTipoDividaEditSelected(divida.tipo_divida_id);
    setRefDebt(divida.ref_debt);
    setModalDividas(divida);
    setEditValorDebt(divida.valor_debito_vinculo);
    setNomeDivida(divida.nome_divida);
    setValor(divida.valor);
    setIsModalEdit(true);
  };

  async function handleDelete(Divida: Dividas) {
    setLoading(true);
    const apiClient = setupAPIClient();

    setIsModalEdit(false);
    const response = await apiClient.delete(`/dividas/${Divida.id}`);
    if (response) {
      setLoading(false);
      toast.warning("Divida excluida!");
      fetchDividas();
      onDataMutated?.();
    } else {
      toast.warning("Erro ao deletar Divida");
    }
  }

  async function saveEdit(id: number) {
    setLoading(true);
    const apiClient = setupAPIClient();

    setIsModalEdit(false);
    if (+tipoDividaEditSelected === 0) {
      toast.warning("Selecione a categoria.");
      setLoading(false);
      return;
    }
    const requestData: RequestData = {
      nome_divida: nomeDivida,
      valor: valor,
      tipoDividaId: +tipoDividaEditSelected,
    };

    if (
      selectedValueEdit !== null &&
      selectedValueEdit !== "" &&
      +selectedValueEdit !== 0
    ) {
      requestData.vinculo_id = +selectedValueEdit;
      requestData.valor_debito_vinculo = editValorDebt;
      requestData.ref_debt = refDebt;
    } else {
      requestData.vinculo_id = null;
      requestData.valor_debito_vinculo = null;
      requestData.ref_debt = null;
    }

    const response = await apiClient.patch(`/dividas/${id}`, requestData);
    if (response) {
      setLoading(false);
      toast.success("Divida atualizada com sucesso!");
      fetchDividas();
      onDataMutated?.();
    } else {
      toast.warning("Erro ao editar Divida");
    }
  }

  async function createDivida(date: Date) {
    setLoading(true);
    if (
      !createNomeDivida ||
      !createValor ||
      !date ||
      (!isInstallments && installments < 1)
    ) {
      toast.warning("Preencha todos os campos!");
      setLoading(false);
      return;
    }
    if (debtTypes.length === 0) {
      toast.warning(
        "Não há categorias de saída cadastradas. Cadastre ao menos uma categoria para lançar gastos.",
      );
      setLoading(false);
      return;
    }
    if (!tipoDividaSelected || +tipoDividaSelected === 0) {
      toast.warning("Selecione a categoria.");
      setLoading(false);
      return;
    }

    const apiClient = setupAPIClient();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);

    const requestData: RequestData = {
      nome_divida: createNomeDivida,
      valor: createValor,
      data_inclusao: date,
      tipoDividaId: +tipoDividaSelected,
    };

    if (selectedValue !== null && selectedValue !== "") {
      requestData.vinculo_id = +selectedValue;
      requestData.valor_debito_vinculo = createValorDebt;
    }

    if (isInstallments && installments > 1) {
      requestData.installments = installments;
    } else {
      requestData.installments = 1;
    }

    try {
      await apiClient.post(`/dividas`, requestData);
      setSelectedValue("");
      setCreateNomeDivida("");
      setCreateValor(0);
      setCreateVinculo("");
      setTipoDividaSelected("");
      setCreateValorDebt(0);
      setInstallments(1);
      toast.success("Dívida criada com sucesso!");
      await fetchDividas();
      setIsModalCreate(false);
      onDataMutated?.();
    } catch (e: unknown) {
      const msg =
        e instanceof AxiosError
          ? getErrorMessage(e.response?.data)
          : "Não foi possível criar a dívida.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handleCloseEdit = () => {
    setIsModalEdit(false);
  };
  const handleCloseCreate = () => {
    setIsModalCreate(false);
  };

  const fetchDividas = async () => {
    const apiClient = setupAPIClient();
    try {
      if (filterDate !== "") {
        const response = await apiClient.get(
          `/dividas/${filterDate}/${filterType}`
        );
        const responseRendas = await apiClient.get(
          `/rendas/${filterDate}/month`
        );

        setDividas(response.data);
        setRendas(responseRendas.data);
      } else {
        const response = await apiClient.get("/dividas");
        const responserendas = await apiClient.get("/rendas");
        setRendas(responserendas.data);
        setDividas(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar as Dividas:", error.message);
      setDividas([]);
      setRendas([]);
    }
  };

  const filterDividasByDate = async (date: Date, type: "day" | "month") => {
    const apiClient = setupAPIClient();
    try {
      if (date && type) {
        const formattedDate = date.toISOString().split("T")[0] + "T03:00:00Z";

        setFilterDate(formattedDate);
        setFilterType(type);

        const response = await apiClient.get(
          `/dividas/${formattedDate}/${type}`
        );
        const responseRendas = await apiClient.get(
          `/rendas/${formattedDate}/month`
        );

        setDividas(response.data);
        setRendas(responseRendas.data);
      } else {
        setDividas(initialDividas);
      }
    } catch (error) {
      console.error("Erro ao buscar as Dividas:", error.message);
      setDividas([]);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleChangeEdit = (event) => {
    setSelectedValueEdit(event.target.value);
  };

  function handleCreateValor(novoValor) {
    setCreateValor(novoValor);
  }

  const handleChangeTipoDivida = (event) => {
    setTipoDividaSelected(event.target.value);
  };

  const handleChangeEditTipoDivida = (event) => {
    setTipoDividaEditSelected(event.target.value);
  };

  async function refreshDebtTypes() {
    try {
      const apiClient = setupAPIClient();
      const response = await apiClient.get("/dividas/types");
      setDebtTypes(response.data ?? []);
    } catch {
      // mantém lista existente
    }
  }

  async function createDebtType() {
    const nome = newDebtTypeName.trim();
    if (nome.length < 2) {
      toast.warning("Informe um nome de categoria com ao menos 2 caracteres.");
      return;
    }

    try {
      setLoading(true);
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/dividas/types", { nome });
      const created = response.data as ITipoDivida;

      setDebtTypes((prev) => {
        if (prev.some((t) => t.id === created.id)) return prev;
        return [...prev, created].sort((a, b) => a.nome.localeCompare(b.nome));
      });

      if (created.id != null) {
        setTipoDividaSelected(String(created.id));
        setTipoDividaEditSelected(created.id);
      }
      setNewDebtTypeName("");
      toast.success("Categoria cadastrada com sucesso.");
    } catch (e: unknown) {
      const msg =
        e instanceof AxiosError
          ? getErrorMessage(e.response?.data)
          : "Não foi possível cadastrar a categoria.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setDebtTypes(tipodivida ?? []);
  }, [tipodivida]);

  useEffect(() => {
    fetchDividas();
    refreshDebtTypes();
  }, []);

  const createBtnClass = embedded
    ? "inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/25 transition hover:bg-red-400"
    : "flex w-full items-center space-x-2 rounded-xl bg-red-500 px-4 py-2.5 text-white shadow-lg shadow-red-500/25 hover:bg-red-400 sm:w-auto";

  return (
    <>
      <div
        className={
          embedded ? "space-y-4" : "flex-1 space-y-6 p-2 sm:p-4 md:p-8"
        }
      >
        <header className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div>
            {!embedded && (
              <>
                <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">
                  Meus Gastos
                </h1>
                <p className="text-slate-400">
                  Controle suas dívidas e pagamentos.
                </p>
              </>
            )}
            {embedded && (
              <>
                <h2 className="text-lg font-semibold text-slate-100">Saídas</h2>
                <p className="text-sm text-slate-400">
                  Contas, cartão e obrigações — com vínculo familiar quando
                  aplicável.
                </p>
              </>
            )}
          </div>

          <button
            type="button"
            className={createBtnClass}
            onClick={() => setIsModalCreate(true)}
          >
            <span>Nova dívida / gasto</span>
            <MdAdd size={22} className="inline-block" />
          </button>
        </header>
        <div
          className={`min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-md backdrop-blur-sm ${embedded ? "p-4 sm:p-6" : "p-2 sm:p-4 md:p-6"}`}
        >
              <div className="mb-4 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                <Calendar
                  textButton="Filtrar"
                  type={filterType}
                  colorButton="#570E0E"
                  onDateSelect={filterDividasByDate}
                />
              </div>
              <MovimentacoesListControls
                searchPlaceholder="Buscar por conta, categoria, parceiro ou data…"
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                page={safePage}
                onPageChange={setPage}
                totalItems={filteredDividas.length}
                itemLabel="saídas"
                extraFilters={
                  <>
                    <label className="flex flex-col gap-1 text-sm text-slate-400 sm:flex-row sm:items-center sm:gap-2">
                      <span className="whitespace-nowrap">Pagamento</span>
                      <select
                        value={paymentFilter}
                        onChange={(e) =>
                          setPaymentFilter(
                            e.target.value as "all" | "paid" | "unpaid",
                          )
                        }
                        className={filterSelectClass}
                      >
                        <option value="all">Todos</option>
                        <option value="paid">Pagos</option>
                        <option value="unpaid">Em aberto</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-slate-400 sm:flex-row sm:items-center sm:gap-2">
                      <span className="whitespace-nowrap">Categoria</span>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={filterSelectClass}
                      >
                        <option value="all">Todas</option>
                        {debtTypes.map((t) => (
                          <option key={t.id} value={String(t.id)}>
                            {t.nome}
                          </option>
                        ))}
                      </select>
                    </label>
                  </>
                }
              />
              {(searchQuery.trim() ||
                paymentFilter !== "all" ||
                categoryFilter !== "all") &&
              filteredDividas.length < dividas.length ? (
                <p className="mb-3 text-xs text-slate-500">
                  Os totais no rodapé consideram todas as saídas do período, não só os filtros da tabela.
                </p>
              ) : null}
              <div className="w-full min-w-0">
                {filteredDividas.length > 0 ? (
                  <>
                    <GastosMobileCards
                      items={paginatedDividas}
                      getTipoNome={getTipoDivida}
                      onTogglePaid={handleTogglePaid}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                    <div className="hidden md:block">
                      <Table
                        columns={columns}
                        data={paginatedDividas}
                        color="#C07C7C"
                        minWidthClassName="min-w-[1100px]"
                        rowKey={(d) => d.id}
                      />
                    </div>
                  </>
                ) : dividas.length > 0 ? (
                  <p className="py-10 text-center text-sm text-slate-400">
                    Nenhuma saída corresponde aos filtros ou à pesquisa.
                  </p>
                ) : (
                  <NotFound />
                )}
              </div>
              <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-900/60 p-4 text-slate-100 backdrop-blur-sm md:flex-row">
                <div className="flex w-full flex-col items-start space-y-2 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
                  <div>
                    Total de dívida:{" "}
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div>
                    Pagos:{" "}
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(totalPago)}
                    </span>
                  </div>
                  <div>
                    Renda neste mês:{" "}
                    <span className="text-lg font-bold text-white">
                      {formatCurrency(totalRendas)}
                    </span>
                  </div>
                  <div>
                    Sobra:{" "}
                    <span
                      className={`text-lg font-bold ${
                        totalRendas - total < 0
                          ? "text-red-300"
                          : "text-emerald-300"
                      }`}
                    >
                      {formatCurrency(totalRendas - total)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex w-full items-center space-x-2 rounded-xl bg-red-500 px-4 py-2.5 text-white shadow-lg shadow-red-500/20 hover:bg-red-400 sm:w-auto"
                  onClick={() => setIsModalCreate(true)}
                >
                  Nova dívida
                  <MdAdd size={24} className="inline-block ml-2" />
                </button>
              </div>
            </div>
      </div>

      <Modal isOpen={isModalEdit} onClose={handleCloseEdit} size="xl">
        <div className="flex flex-col gap-4">
          <h2 className={modalTitle}>Editar dívida / gasto</h2>
          <label className="block">
            <span className={modalLabel}>Conta</span>
            <input
              type="text"
              value={nomeDivida}
              onChange={(e) => setNomeDivida(e.target.value)}
              className={modalInput}
            />
          </label>
          <label className="block">
            <span className={modalLabel}>Valor do boleto</span>
            <InputMoney value={valor} onChange={(valor) => setValor(valor)} />
          </label>
          {(usuario?.contavinculo?.length ?? 0) > 0 && (
            <div className={modalInset}>
              <label className="block">
                <span className={modalLabel}>Vínculo (opcional)</span>
                <select
                  value={selectedValueEdit}
                  onChange={handleChangeEdit}
                  className={modalSelect}
                >
                  <option value="">Nenhum</option>
                  {usuario?.contavinculo &&
                    usuario.contavinculo.map((vinculo) => (
                      <option key={vinculo.id} value={vinculo.id}>
                        {vinculo.username}
                      </option>
                    ))}
                </select>
              </label>
              {selectedValueEdit && (
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <label className="block">
                    <span className={modalLabel}>Quem paga no vínculo</span>
                    <InputMoney
                      value={editValorDebt}
                      onChange={(valor) => setEditValorDebt(valor)}
                    />
                  </label>
                  <span className={modalInfo}>
                    Quanto vou pagar:{" "}
                    {formatCurrency(valor - editValorDebt)}
                  </span>
                </div>
              )}
            </div>
          )}
          {debtTypes.length > 0 && (
            <div className={modalInset}>
              <label className="block">
                <span className={modalLabel}>Categoria</span>
                <select
                  value={tipoDividaEditSelected}
                  onChange={handleChangeEditTipoDivida}
                  className={modalSelect}
                >
                  <option value={0}>Selecione a categoria</option>
                  {debtTypes.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nome}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={newDebtTypeName}
                  onChange={(e) => setNewDebtTypeName(e.target.value)}
                  placeholder="Ex.: Luz, Água, Condomínio..."
                  className={modalInput}
                />
                <button
                  type="button"
                  onClick={createDebtType}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg shadow-slate-900/20 transition hover:bg-slate-600"
                >
                  Cadastrar categoria
                </button>
              </div>
            </div>
          )}
          <span className={modalMuted}>
            Vencimento: {formatDate(modalDividas?.data_inclusao)}
          </span>
          <ButtonPages
            bg="#dc2626"
            loading={loading}
            onClick={() => saveEdit(modalDividas?.id)}
          >
            Salvar
          </ButtonPages>
        </div>
      </Modal>

      <Modal isOpen={isModalCreate} onClose={handleCloseCreate} size="xl">
        <div className="flex flex-col gap-4">
          <h2 className={modalTitle}>Nova dívida / gasto</h2>
          <label className="block">
            <span className={modalLabel}>Conta</span>
            <input
              onChange={(e) => {
                setCreateNomeDivida(e.target.value);
              }}
              type="text"
              value={createNomeDivida}
              className={modalInput}
            />
          </label>
          <label className="block">
            <span className={modalLabel}>Valor do boleto</span>
            <InputMoney onChange={handleCreateValor} />
          </label>

          <div className={modalInset}>
            <div className="flex items-center justify-between gap-3">
              <span className={modalLabel}>Adicionar parcelas</span>
              <Toggle
                checked={isInstallments}
                onChange={(e) => setIsInstallments(e.target.checked)}
              />
            </div>

            {isInstallments && (
              <label className="block">
                <span className={modalLabel}>Número de parcelas</span>
                <input
                  type="number"
                  min={1}
                  value={installments}
                  onChange={(e) => setInstallments(+e.target.value)}
                  className={modalInput}
                />
              </label>
            )}
          </div>
          {(usuario?.contavinculo?.length ?? 0) > 0 && (
            <div className={modalInset}>
              <label className="block">
                <span className={modalLabel}>Vínculo (opcional)</span>
                <select
                  value={selectedValue}
                  onChange={handleChange}
                  className={modalSelect}
                >
                  <option value="">Nenhum</option>
                  {usuario?.contavinculo &&
                    usuario.contavinculo.map((vinculo) => (
                      <option key={vinculo.id} value={vinculo.id}>
                        {vinculo.username}
                      </option>
                    ))}
                </select>
              </label>
              {selectedValue && (
                <div className="space-y-2 border-t border-white/10 pt-3">
                  <label className="block">
                    <span className={modalLabel}>Quem paga no vínculo</span>
                    <InputMoney
                      value={createValorDebt}
                      onChange={(valor) => setCreateValorDebt(valor)}
                    />
                  </label>
                  <span className={modalInfo}>
                    Quanto vou pagar:{" "}
                    {formatCurrency(createValor - createValorDebt)}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className={modalInset}>
            <label className="block">
              <span className={modalLabel}>Categoria</span>
              <select
                value={tipoDividaSelected}
                onChange={handleChangeTipoDivida}
                className={modalSelect}
              >
                <option value={0}>Selecione a categoria</option>
                {debtTypes.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={newDebtTypeName}
                onChange={(e) => setNewDebtTypeName(e.target.value)}
                placeholder="Ex.: Luz, Água, Condomínio..."
                className={modalInput}
              />
              <button
                type="button"
                onClick={createDebtType}
                className="inline-flex items-center justify-center rounded-xl bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-100 shadow-lg shadow-slate-900/20 transition hover:bg-slate-600"
              >
                Cadastrar categoria
              </button>
            </div>
          </div>
          <Calendar
            colorButton="#dc2626"
            textButton="Salvar"
            hideType={true}
            type={"day"}
            onDateSelect={(date) => createDivida(date)}
          />
        </div>
      </Modal>
    </>
  );
}
