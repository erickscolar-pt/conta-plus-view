import LoggedLayout from "@/component/layout/LoggedLayout";
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
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdAccountBalanceWallet,
  MdOutlineSavings,
} from "react-icons/md";
import { ButtonPages } from "@/component/ui/buttonPages";
import {
  modalLabel,
  modalInput,
  modalMuted,
  modalTitle,
} from "@/component/ui/modal/modalClasses";

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
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-500/20 text-sky-300 hover:bg-sky-500/30"
            onClick={() => handleEdit(obj)}
          >
            <MdEdit size={20} />
          </button>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-300 hover:bg-red-500/30"
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
        <title>Metas | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto p-2 sm:p-4 md:p-8">
            <header className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold text-slate-50 sm:text-3xl">
                  Minhas metas
                </h1>
                <p className="text-slate-400">
                  Acompanhe seus objetivos e valores guardados.
                </p>
              </div>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 sm:w-auto"
                onClick={() => setIsModalCreate(true)}
              >
                <MdOutlineSavings size={22} />
                <span>Criar objetivo</span>
              </button>
            </header>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-2 shadow-md backdrop-blur-sm sm:p-4 md:p-6">
              <div className="mb-6 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
                <Calendar
                  textButton="Filtrar"
                  type={filterType}
                  colorButton="#10b981"
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
              <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-slate-100 backdrop-blur-sm sm:flex-row sm:p-6">
                <div className="flex items-center space-x-4">
                  <MdAccountBalanceWallet
                    size={32}
                    className="text-emerald-400"
                  />
                  <div>
                    <p className="text-lg text-slate-300">Guardado este mês</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-400 sm:w-auto"
                  onClick={() => setIsModalCreate(true)}
                >
                  <MdOutlineSavings size={22} />
                  <span>Criar objetivo</span>
                </button>
              </div>
            </div>
        </main>
      </LoggedLayout>

      <Modal isOpen={isModalEdit} onClose={handleCloseEdit} size="md">
        <div className="flex flex-col gap-4">
          <h2 className={modalTitle}>Editar objetivo</h2>
          <label className="block">
            <span className={modalLabel}>Nome do objetivo</span>
            <input
              type="text"
              value={nomeObjetivo}
              onChange={(e) => setNomeObjetivo(e.target.value)}
              className={modalInput}
            />
          </label>
          <label className="block">
            <span className={modalLabel}>Valor</span>
            <InputMoney value={valor} onChange={(v) => setValor(v)} />
          </label>
          <span className={modalMuted}>
            Data de inclusão: {formatDate(modalObjetivos?.data_inclusao)}
          </span>
          <ButtonPages
            bg="#059669"
            loading={loading}
            onClick={() => saveEdit(modalObjetivos?.id)}
          >
            Salvar
          </ButtonPages>
        </div>
      </Modal>

      <Modal isOpen={isModalCreate} onClose={handleCloseCreate} size="md">
        <div className="flex flex-col gap-4">
          <h2 className={modalTitle}>Criar objetivo</h2>
          <label className="block">
            <span className={modalLabel}>Nome do objetivo</span>
            <input
              onChange={(e) => {
                setCreateNomeObjetivo(e.target.value);
              }}
              type="text"
              value={createNomeObjetivo}
              className={modalInput}
            />
          </label>
          <label className="block">
            <span className={modalLabel}>Valor</span>
            <InputMoney
              value={createValor}
              onChange={(valor) => setCreateValor(valor)}
            />
          </label>
          <Calendar
            colorButton="#059669"
            textButton="Salvar"
            hideType={true}
            type={"day"}
            onDateSelect={(date) => createObjetivo(date)}
          />
        </div>
      </Modal>
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "erro";
    console.error("Erro ao buscar as objetivos:", msg);
    return {
      redirect: { destination: "/movimentacoes", permanent: false },
    };
  }
});
