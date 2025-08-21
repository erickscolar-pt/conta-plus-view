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
import Head from "next/head";
import { Rendas, Usuario } from "@/model/type";
import Chat from "@/component/chat";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

interface Ganhos {
  rendas: Rendas[];
  usuario: Usuario;
}
interface RequestData {
  nome_renda: string;
  valor: number;
  valor_pagamento_vinculo?: number;
  data_inclusao?: Date;
  vinculo_id?: number;
}

export default function Ganhos({ rendas: initialRendas, usuario }: Ganhos) {
  const [isModalEdit, setIsModalEdit] = useState(false);
  const [isModalCreate, setIsModalCreate] = useState(false);
  const [valor, setValor] = useState(0);
  const [nomeRenda, setNomeRenda] = useState("");
  const [createValor, setCreateValor] = useState(0);
  const [createNomeRenda, setCreateNomeRenda] = useState("");
  const [modalRendas, setModalRendas] = useState<Rendas>();
  const [loading, setLoading] = useState(false);
  const [rendas, setRendas] = useState<Rendas[]>(initialRendas);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState<"day" | "month">("day");
  const total = rendas.reduce(
    (acc: number, renda: Rendas) => acc + (renda.valor || 0),
    0
  );
  const totalvinculo = rendas.reduce(
    (acc: number, renda: Rendas) => acc + (renda.valor_pagamento_vinculo || 0),
    0
  );

  const columns = [
    { title: "Valor", key: "valor", formatter: formatCurrency },
    { title: "Recebido de", key: "nome_renda" },
    { title: "Pago dia", key: "data_inclusao", formatter: formatDate },
    {
      title: "Ações",
      key: "actions",
      render: (renda: Rendas) => (
        <div className="flex item-center justify-center space-x-4">
          <button
            className="w-8 h-8 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center hover:bg-blue-200"
            onClick={() => handleEdit(renda)}
          >
            <MdEdit size={20} />
          </button>
          <button
            className="w-8 h-8 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200"
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
      fetchRendas();
    } else {
      toast.warning("Erro ao deletar renda");
    }
  }

  async function saveEdit(id: number) {
    setLoading(true);
    const apiClient = setupAPIClient();
    setIsModalEdit(false);
    const requestData: RequestData = {
      nome_renda: nomeRenda,
      valor: valor,
    };
    const response = await apiClient.patch(`/rendas/${id}`, requestData);
    if (response) {
      setLoading(false);
      toast.success("Renda atualizada com sucesso!");
      fetchRendas();
    } else {
      toast.warning("Erro ao editar renda");
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
    const response = await apiClient.post(`/rendas`, requestData);
    if (response) {
      setCreateNomeRenda("");
      setCreateValor(0);
      setLoading(false);
      toast.success("Renda criada com sucesso!");
      fetchRendas();
      setIsModalCreate(false);
    } else {
      toast.error("Erro ao editar renda");
    }
  }

  const handleCloseEdit = () => setIsModalEdit(false);
  const handleCloseCreate = () => setIsModalCreate(false);

  const fetchRendas = async () => {
    const apiClient = setupAPIClient();
    try {
      if (filterDate !== "") {
        const response = await apiClient.get(
          `/rendas/${filterDate}/${filterType}`
        );
        setRendas(response.data);
      } else {
        const response = await apiClient.get("/rendas");
        setRendas(response.data);
      }
    } catch (error) {
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
          `/rendas/${formattedDate}/${type}`
        );
        setRendas(response.data);
      } else {
        setRendas(initialRendas);
      }
    } catch (error) {
      setRendas([]);
    }
  };

  useEffect(() => {
    fetchRendas();
  }, []);

  return (
    <>
      <Head>
        <title>Conta Plus - Ganhos</title>
      </Head>
      <div className="flex flex-col md:flex-row h-screen bg-gray-100">
        <MenuLateral />
        <div className="flex-1 flex flex-col md:ml-20">
          <Header usuario={usuario} />
          <main className="flex-1 p-2 sm:p-4 md:p-8">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Meus Ganhos
                </h1>
                <p className="text-gray-500">
                  Acompanhe suas rendas e salários.
                </p>
              </div>
              <button
                className="flex items-center space-x-2 px-4 py-2 bg-teal-500 text-white rounded-lg shadow-sm hover:bg-teal-600 w-full sm:w-auto"
                onClick={() => setIsModalCreate(true)}
              >
                <MdAdd size={20} />
                <span>Adicionar Ganho</span>
              </button>
            </header>
            <div className="bg-white p-2 sm:p-4 md:p-6 rounded-2xl shadow-md">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-6 gap-4">
                <Calendar
                  type={filterType}
                  onDateSelect={filterRendasByDate}
                  textButton="Filtrar"
                />
                
              </div>
              <div className="w-full">
                {rendas.length > 0 ? (
                  <Table columns={columns} data={rendas} />
                ) : (
                  <NotFound />
                )}
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-6 pt-4 border-t border-gray-200 gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-gray-700 font-medium">Sua renda:</span>
                  <span className="px-4 py-2 bg-teal-100 text-teal-700 font-bold rounded-lg">
                    {formatCurrency(total)}
                  </span>
                  {totalvinculo > 0 && (
                    <>
                      <span className="text-gray-700 font-medium">
                        Renda recebida do vínculo:
                      </span>
                      <span className="px-4 py-2 bg-teal-100 text-teal-700 font-bold rounded-lg">
                        {formatCurrency(totalvinculo)}
                      </span>
                      <span className="text-gray-700 font-medium">Total:</span>
                      <span className="px-4 py-2 bg-teal-100 text-teal-700 font-bold rounded-lg">
                        {formatCurrency(totalvinculo + total)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Modal isOpen={isModalEdit} onClose={handleCloseEdit}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Editar Renda</h2>
          <label className="block mb-2">
            <span className="block text-sm font-medium text-gray-700">
              Recebido de:
            </span>
            <input
              type="text"
              value={nomeRenda}
              onChange={(e) => setNomeRenda(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </label>
          <label className="block mb-2">
            <span className="block text-sm font-medium text-gray-700">
              Valor:
            </span>
            <InputMoney value={valor} onChange={(valor) => setValor(valor)} />
          </label>
          <span className="block mb-4">
            Data de Inclusão: {formatDate(modalRendas?.data_inclusao)}
          </span>
          <ButtonPages
            loading={loading}
            onClick={() => saveEdit(modalRendas?.id)}
          >
            Salvar
          </ButtonPages>
        </div>
      </Modal>
      <Modal isOpen={isModalCreate} onClose={handleCloseCreate}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Criar Renda</h2>
          <label className="block mb-2">
            <span className="block text-sm font-medium text-gray-700">
              Recebido de:
            </span>
            <input
              onChange={(e) => setCreateNomeRenda(e.target.value)}
              type="text"
              value={createNomeRenda}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </label>
          <label className="block mb-2">
            <span className="block text-sm font-medium text-gray-700">
              Valor:
            </span>
            <InputMoney
              value={createValor}
              onChange={(valor) => setCreateValor(valor)}
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
      <Chat usuario={usuario} />
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  try {
    const user = await apiClient.get("/user/get");
    const rendas = await apiClient.get("/rendas");
    return {
      props: {
        rendas: rendas.data,
        usuario: user.data,
      },
    };
  } catch (error) {
    return {
      props: {
        rendas: [],
        usuario: [],
      },
    };
  }
});
