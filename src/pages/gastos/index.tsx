import styles from "./styles.module.scss";
import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Table } from "@/component/ui/table";
import { setupAPIClient } from "@/services/api";
import { formatCurrency, formatDate } from "@/helper";
import { useEffect, useState } from "react";
import Modal from "@/component/ui/modal";
import { ButtonPages } from "@/component/ui/buttonPages";
import Calendar from "@/component/ui/calendar";
import { toast } from "react-toastify";
import InputMoney from "@/component/ui/inputMoney";
import NotFound from "@/component/notfound";
import { Toggle } from "@/component/ui/toggle";
import Head from "next/head";
import { Dividas, ITipoDivida, Rendas, Usuario } from "@/model/type";
import Chat from "@/component/chat";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

interface Gastos {
  dividas: Dividas[];
  rendas: Rendas[];
  usuario: Usuario;
  tipodivida: ITipoDivida[];
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
export default function Gastos({
  dividas: initialDividas,
  rendas: initialRendas,
  usuario,
  tipodivida,
}: Gastos) {
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
    const tipoDivida = tipodivida.find((tipo) => tipo.id === tipoDividaId);
    return tipoDivida ? tipoDivida.nome : "Tipo não encontrado";
  };

  const columns = [
    { title: "Conta", key: "nome_divida" },
    { title: "Valor do boleto", key: "valor", formatter: formatCurrency },
    { title: "Tipo", key: "tipo_divida_id", formatter: getTipoDivida },
    { title: "Vou dividir com", key: "username" },
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
            className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600"
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
            className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600"
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
    } else {
      toast.warning("Erro ao deletar Divida");
    }
  }

  async function saveEdit(id: number) {
    setLoading(true);
    const apiClient = setupAPIClient();

    setIsModalEdit(false);
    if (+tipoDividaEditSelected === 0) {
      toast.warning("Selecione o tipo de divida!");
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

    const response = await apiClient.post(`/dividas`, requestData);
    if (response) {
      setSelectedValue("");
      setCreateNomeDivida("");
      setCreateValor(0);
      setCreateVinculo("");
      setTipoDividaSelected("");
      setCreateValorDebt(0);
      setInstallments(1);
      setLoading(false);
      toast.success("Divida criada com sucesso!");
      fetchDividas();
      setIsModalCreate(false);
    } else {
      toast.error("Erro ao editar Divida");
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

  useEffect(() => {
    fetchDividas();
  }, []);

  return (
    <>
      <Head>
        <title>Conta Plus - Gastos</title>
      </Head>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        <MenuLateral />
        <div className="flex-1 flex flex-col md:ml-20">
          <Header usuario={usuario} />
          <main className="flex-1 p-2 sm:p-4 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Meus Gastos
                </h1>
                <p className="text-gray-500">
                  Controle suas dívidas e pagamentos.
                </p>
              </div>

              <button
                className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg shadow-sm hover:bg-teal-600 w-full sm:w-auto"
                onClick={() => setIsModalCreate(true)}
              >
                Criar Dívida
                <MdAdd size={24} className="inline-block ml-2" />
              </button>
            </header>
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-2xl shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
                <Calendar
                  textButton="Filtrar"
                  type={filterType}
                  colorButton="#570E0E"
                  onDateSelect={filterDividasByDate}
                />
              </div>
              <div className="w-full">
                {dividas.length > 0 ? (
                  <Table columns={columns} data={dividas} color="#C07C7C" />
                ) : (
                  <NotFound />
                )}
              </div>
              <div className="mt-6 p-4 bg-gray-800 text-white rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 items-start sm:items-center w-full">
                  <div>
                    Total de dívida:{" "}
                    <span className="font-bold text-lg">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div>
                    Pagos:{" "}
                    <span className="font-bold text-lg">
                      {formatCurrency(totalPago)}
                    </span>
                  </div>
                  <div>
                    Renda neste mês:{" "}
                    <span className="font-bold text-lg">
                      {formatCurrency(totalRendas)}
                    </span>
                  </div>
                  <div>
                    Sobra:{" "}
                    <span
                      className={`font-bold text-lg ${
                        totalRendas - total < 0
                          ? "text-red-400"
                          : "text-green-300"
                      }`}
                    >
                      {formatCurrency(totalRendas - total)}
                    </span>
                  </div>
                </div>
                <button
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg shadow-sm hover:bg-teal-600 w-full sm:w-auto"
                  onClick={() => setIsModalCreate(true)}
                >
                  Criar Dívida
                  <MdAdd size={24} className="inline-block ml-2" />
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Modal isOpen={isModalEdit} onClose={handleCloseEdit}>
        <div className={styles.containerModal}>
          <h2>Editar Divida</h2>
          <label>
            <span>Conta:</span>
            <input
              type="text"
              value={nomeDivida}
              onChange={(e) => setNomeDivida(e.target.value)}
            />
          </label>
          <label>
            <span>Valor do boleto:</span>
            <InputMoney value={valor} onChange={(valor) => setValor(valor)} />
          </label>
          {usuario.contavinculo.length > 0 && (
            <div className={styles.selected}>
              <select value={selectedValueEdit} onChange={handleChangeEdit}>
                <option value="">Nenhum</option>
                {usuario.contavinculo &&
                  usuario.contavinculo.map((vinculo) => (
                    <option key={vinculo.id} value={vinculo.id}>
                      {vinculo.username}
                    </option>
                  ))}
              </select>
              {selectedValueEdit && (
                <div className={styles.contentselected}>
                  <label>
                    <span>Quanto deve pagar :</span>
                    <InputMoney
                      value={editValorDebt}
                      onChange={(valor) => setEditValorDebt(valor)}
                    />
                  </label>
                  <span className={styles.info}>
                    Quanto vou pagar : {formatCurrency(valor - editValorDebt)}
                  </span>
                </div>
              )}
            </div>
          )}
          {tipodivida.length > 0 && (
            <div className={styles.selected}>
              <select
                value={tipoDividaEditSelected}
                onChange={handleChangeEditTipoDivida}
              >
                <option value={0}>Selecione o Tipo</option>
                {tipodivida.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
          <span>
            Data vencimento: {formatDate(modalDividas?.data_inclusao)}
          </span>
          <ButtonPages
            bg="#570E0E"
            loading={loading}
            onClick={() => saveEdit(modalDividas?.id)}
          >
            Salvar
          </ButtonPages>
        </div>
      </Modal>

      <Modal isOpen={isModalCreate} onClose={handleCloseCreate}>
        <div className={styles.containerModal}>
          <h2>Criar Divida</h2>
          <label>
            <span>Conta :</span>
            <input
              onChange={(e) => {
                setCreateNomeDivida(e.target.value);
              }}
              type="text"
              value={createNomeDivida}
            />
          </label>
          <label>
            <span>Valor do boleto:</span>
            <InputMoney onChange={handleCreateValor} />
          </label>

          <div className={styles.selected}>
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              Adicionar parcelas
              <Toggle
                checked={isInstallments}
                onChange={(e) => setIsInstallments(e.target.checked)}
              />
            </span>

            {isInstallments && (
              <label>
                <span>Numero de parcelas:</span>
                <input
                  type="number"
                  value={installments}
                  onChange={(e) => setInstallments(+e.target.value)}
                />
              </label>
            )}
          </div>
          {usuario.contavinculo.length > 0 && (
            <div className={styles.selected}>
              <select value={selectedValue} onChange={handleChange}>
                <option value="">Nenhum</option>
                {usuario.contavinculo &&
                  usuario.contavinculo.map((vinculo) => (
                    <option key={vinculo.id} value={vinculo.id}>
                      {vinculo.username}
                    </option>
                  ))}
              </select>
              {selectedValue && (
                <div className={styles.contentselected}>
                  <label>
                    <span>Quanto deve pagar :</span>
                    <InputMoney
                      value={createValorDebt}
                      onChange={(valor) => setCreateValorDebt(valor)}
                    />
                  </label>
                  <span className={styles.info}>
                    Quanto vou pagar:{" "}
                    {formatCurrency(createValor - createValorDebt)}
                  </span>
                </div>
              )}
            </div>
          )}
          {tipodivida.length > 0 && (
            <div className={styles.selected}>
              <select
                value={tipoDividaSelected}
                onChange={handleChangeTipoDivida}
              >
                <option value={0}>Selecione o Tipo</option>
                {tipodivida.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
          <Calendar
            colorButton="#570E0E"
            textButton="Salvar"
            hideType={true}
            type={"day"}
            onDateSelect={(date) => createDivida(date)}
          />
        </div>
      </Modal>
      <Chat usuario={usuario} />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  try {
    const user = await apiClient.get("/user/get");
    const dividas = await apiClient.get("/dividas");
    const tipodivida = await apiClient.get("/dividas/getTipoDivida");
    const rendas = await apiClient.get("/rendas");

    return {
      props: {
        dividas: dividas.data,
        rendas: rendas.data,
        usuario: user.data,
        tipodivida: tipodivida.data,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar as dividas:", error.message);
    return {
      props: {
        dividas: [],
        rendas: [],
        usuario: [],
        tipodivida: [],
      },
    };
  }
});
