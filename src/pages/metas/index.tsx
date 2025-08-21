import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Table } from "@/component/ui/table";
import { setupAPIClient } from "@/services/api";
import { formatCurrency, formatDate } from "@/helper";
import { useEffect, useState } from "react";
import Modal from "@/component/ui/modal";
import Calendar from "@/component/ui/calendar";
import { toast } from "react-toastify";
import InputMoney from "@/component/ui/inputMoney";
import NotFound from "@/component/notfound";
import Head from "next/head";
import { Objetivos, Usuario } from "@/model/type";
import Chat from "@/component/chat";
import { MdAdd, MdEdit, MdDelete, MdAccountBalanceWallet } from "react-icons/md";
import styles from "./styles.module.scss";
import { ButtonPages } from "@/component/ui/buttonPages";

interface Metas {
  objetivos: Objetivos[];
  usuario: Usuario;
}
interface RequestData {
  nome_objetivo: string;
  valor: number;
  data_inclusao?: Date;
  vinculo_id?: number;
}

export default function Metas({ objetivos: initialObjetivos, usuario }: Metas) {
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [valor, setValor] = useState(0);
  const [nomeObjetivo, setNomeObjetivo] = useState("");
  const [selectedValueEdit, setSelectedValueEdit] = useState("");
  const [createValor, setCreateValor] = useState(0);
  const [createNomeObjetivo, setCreateNomeObjetivo] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [modalObjetivos, setModalObjetivos] = useState<Objetivos>();
  const [loading, setLoading] = useState(false);
  const [objetivos, setObjetivos] = useState<Objetivos[]>(initialObjetivos);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState<"day" | "month">("day");

  const total = objetivos.reduce(
    (acc: number, obj: Objetivos) => acc + (obj.valor || 0),
    0
  );

  const columns = [
    { title: "Minha meta", key: "nome_objetivo" },
    { title: "Valor", key: "valor", formatter: formatCurrency },
    { title: "Guardei dia", key: "data_inclusao", formatter: formatDate },
    {
      title: "Ações",
      key: "actions",
      render: (obj: Objetivos) => (
        <div className="flex item-center justify-center space-x-4">
          <button
            className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center hover:bg-blue-200"
            onClick={() => handleEdit(obj)}
          >
            <MdEdit size={20} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200"
            onClick={() => handleDelete(obj)}
          >
            <MdDelete size={20} />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (obj: Objetivos) => {
    if (obj.vinculo) {
      setSelectedValueEdit(String(obj.vinculo.id));
    }
    setModalObjetivos(obj);
    setNomeObjetivo(obj.nome_objetivo);
    setValor(obj.valor);
    setIsModalEdit(true);
  };

  async function handleDelete(obj: Objetivos) {
    setLoading(true);
    const apiClient = setupAPIClient();
    setIsModalEdit(false);
    const response = await apiClient.delete(`/objetivos/${obj.id}`);
    if (response) {
      setLoading(false);
      toast.warning("Objetivo excluído!");
      fetchObjetivos();
    } else {
      toast.warning("Erro ao deletar objetivo");
    }
  }

  async function saveEdit(id: number) {
    setLoading(true);
    const apiClient = setupAPIClient();
    setIsModalEdit(false);

    const requestData: RequestData = {
      nome_objetivo: nomeObjetivo,
      valor: valor,
    };

    if (
      selectedValueEdit !== null &&
      selectedValueEdit !== "" &&
      +selectedValueEdit !== 0
    ) {
      requestData.vinculo_id = +selectedValueEdit;
    } else {
      requestData.vinculo_id = null;
    }

    const response = await apiClient.patch(`/objetivos/${id}`, requestData);
    if (response) {
      setLoading(false);
      toast.success("Objetivo atualizado com sucesso!");
      fetchObjetivos();
    } else {
      toast.warning("Erro ao editar objetivo");
    }
  }

  async function createObjetivo(date: Date) {
    setLoading(true);
    if (!createNomeObjetivo || !createValor || !date) {
      toast.warning("Preencha todos os campos!");
      setLoading(false);
      return;
    }
    const apiClient = setupAPIClient();

    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);

    const requestData: RequestData = {
      nome_objetivo: createNomeObjetivo,
      valor: createValor,
      data_inclusao: date,
    };

    if (selectedValue !== null && selectedValue !== "") {
      requestData.vinculo_id = +selectedValue;
    }

    const response = await apiClient.post(`/objetivos`, requestData);
    if (response) {
      setSelectedValue("");
      setCreateNomeObjetivo("");
      setCreateValor(0);
      setLoading(false);
      toast.success("Objetivo criado com sucesso!");
      fetchObjetivos();
      setIsModalCreate(false);
    } else {
      toast.error("Erro ao criar objetivo");
    }
  }

  const handleCloseEdit = () => setIsModalEdit(false);
  const handleCloseCreate = () => setIsModalCreate(false);

  const fetchObjetivos = async () => {
    const apiClient = setupAPIClient();
    try {
      if (filterDate !== "") {
        const response = await apiClient.get(
          `/objetivos/${filterDate}/${filterType}`
        );
        setObjetivos(response.data);
      } else {
        const response = await apiClient.get("/objetivos");
        setObjetivos(response.data);
      }
    } catch (error) {
      setObjetivos([]);
    }
  };

  const filterObjetivosByDate = async (date: Date, type: "day" | "month") => {
    const apiClient = setupAPIClient();
    try {
      if (date && type) {
        const formattedDate = date.toISOString().split("T")[0] + "T03:00:00Z";
        setFilterDate(formattedDate);
        setFilterType(type);
        const response = await apiClient.get(
          `/objetivos/${formattedDate}/${type}`
        );
        setObjetivos(response.data);
      } else {
        setObjetivos(initialObjetivos);
      }
    } catch (error) {
      setObjetivos([]);
    }
  };

  useEffect(() => {
    fetchObjetivos();
  }, []);

  return (
    <>
      <Head>
        <title>Conta Plus - Metas</title>
      </Head>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        <MenuLateral />
        <div className="flex-1 flex flex-col md:ml-20 pb-16">
          <Header usuario={usuario} />
          <main className="flex-1 p-2 sm:p-4 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Minhas Metas
                </h1>
                <p className="text-gray-500">
                  Acompanhe seus objetivos e valores guardados.
                </p>
              </div>
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg shadow-sm hover:bg-emerald-600 w-full sm:w-auto"
                onClick={() => setIsModalCreate(true)}
              >
                <MdAdd size={24} />
                <span>Criar Objetivo</span>
              </button>
            </header>
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-2xl shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
                <Calendar
                  textButton="Filtrar"
                  type={filterType}
                  colorButton="#0E1557"
                  onDateSelect={filterObjetivosByDate}
                />
              </div>
              <div className="w-full">
                {objetivos.length > 0 ? (
                  <Table columns={columns} data={objetivos} color="#686D9F" />
                ) : (
                  <NotFound />
                )}
              </div>
              <div className="bg-indigo-900 text-white rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
                <div className="flex items-center space-x-4">
                  <MdAccountBalanceWallet size={32} />
                  <div>
                    <p className="text-lg">Guardado este Mês</p>
                    <p className="text-2xl font-bold">{formatCurrency(total)}</p>
                  </div>
                </div>
                <button
                  className="bg-emerald-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-emerald-600 transition flex items-center space-x-2 w-full sm:w-auto"
                  onClick={() => setIsModalCreate(true)}
                >
                  <MdAdd size={24} />
                  <span>Criar Objetivo</span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Modal isOpen={isModalEdit} onClose={handleCloseEdit}>
        <div className={styles.containerModal}>
          <h2>Editar Objetivo</h2>
          <label>
            <span>Recebido de:</span>
            <input
              type="text"
              value={nomeObjetivo}
              onChange={(e) => setNomeObjetivo(e.target.value)}
            />
          </label>
          <label>
            <span>Valor:</span>
            <input
              type="text"
              value={valor}
              onChange={(e) => setValor(parseFloat(e.target.value))}
            />
            <InputMoney value={valor} onChange={(valor) => setValor(valor)} />
          </label>
          <span>
            Data de Inclusão: {formatDate(modalObjetivos?.data_inclusao)}
          </span>
          <ButtonPages
            bg="#0E1557"
            loading={loading}
            onClick={() => saveEdit(modalObjetivos?.id)}
          >
            Salvar
          </ButtonPages>
        </div>
      </Modal>

      <Modal isOpen={isModalCreate} onClose={handleCloseCreate}>
        <div className={styles.containerModal}>
          <h2>Criar Objetivo</h2>
          <label>
            <span>Recebido de:</span>
            <input
              onChange={(e) => {
                setCreateNomeObjetivo(e.target.value);
              }}
              type="text"
              value={createNomeObjetivo}
            />
          </label>
          <label>
            <span>Valor:</span>
            <InputMoney
              value={createValor}
              onChange={(valor) => setCreateValor(valor)}
            />
          </label>
          <Calendar
            colorButton="#0E1557"
            textButton="Salvar"
            hideType={true}
            type={"day"}
            onDateSelect={(date) => createObjetivo(date)}
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
    const objetivos = await apiClient.get("/objetivos");
    return {
      props: {
        objetivos: objetivos.data,
        usuario: user.data,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar as objetivos:", error.message);
    return {
      props: {
        objetivos: [],
        usuario: [],
      },
    };
  }
});
