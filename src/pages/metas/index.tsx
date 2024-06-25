import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import styles from "./styles.module.scss";
import { Title } from "@/component/ui/title";
import { Table } from "@/component/ui/table";
import { setupAPIClient } from "@/services/api";
import { formatCurrency, formatDate, formatVinculoUsername } from "@/helper";
import { useEffect, useState } from "react";
import Modal from "@/component/ui/modal";
import { ButtonPages } from "@/component/ui/buttonPages";
import Calendar from "@/component/ui/calendar";
import { toast } from "react-toastify";
import InputMoney from "@/component/ui/inputMoney";
import NotFound from "@/component/notfound";
import Head from "next/head";
import { Objetivos, Usuario } from "@/model/type";

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
  const [createVinculo, setCreateVinculo] = useState("");
  const [createSelectedDate, setCreateSelectedDate] = useState<Date | null>(
    null
  );
  const [selectedValue, setSelectedValue] = useState("");
  const [modalObjetivos, setModalObjetivos] = useState<Objetivos>();
  const [loading, setLoading] = useState(false);
  const [objetivos, setObjetivos] = useState<Objetivos[]>(initialObjetivos);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState<"day" | "month">("day");

  const total = objetivos.reduce(
    (acc: number, Objetivo: Objetivos) => acc + (Objetivo.valor || 0),
    0
  );

  const columns = [
    { title: "Minha meta :", key: "nome_objetivo" },
    { title: "Valor", key: "valor", formatter: formatCurrency },
    { title: "Guardei dia :", key: "data_inclusao", formatter: formatDate },
    {
      title: "",
      key: "edit",
      render: (Objetivo: Objetivos) => (
        <button className={styles.edit} onClick={() => handleEdit(Objetivo)}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11.7167 7.5L12.5 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.5ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z"
              fill="white"
            />
          </svg>
        </button>
      ),
    },
    {
      title: "",
      key: "delete",
      render: (Objetivo: Objetivos) => (
        <button className={styles.del} onClick={() => handleDelete(Objetivo)}>
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15.7913 1.2085L1.20801 15.7918"
              stroke="white"
              stroke-width="2.33"
              stroke-linecap="round"
            />
            <path
              d="M1.20801 1.2085L15.7913 15.7918"
              stroke="white"
              stroke-width="2.33"
              stroke-linecap="round"
            />
          </svg>
        </button>
      ),
    },
  ];

  const handleEdit = (Objetivo: Objetivos) => {
    if (Objetivo.vinculo) {
      setSelectedValueEdit(JSON.stringify(Objetivo.vinculo.id));
    }
    setModalObjetivos(Objetivo);
    setNomeObjetivo(Objetivo.nome_objetivo);
    setValor(Objetivo.valor);
    setIsModalEdit(true);
  };

  async function handleDelete(Objetivo: Objetivos) {
    setLoading(true);
    const apiClient = setupAPIClient();

    setIsModalEdit(false);
    const response = await apiClient.delete(`/Objetivos/${Objetivo.id}`);
    if (response) {
      setLoading(false);
      toast.warning("Objetivo excluida!");
      fetchObjetivos();
    } else {
      toast.warning("Erro ao deletar Objetivo");
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
      +selectedValueEdit !== 1
    ) {
      requestData.vinculo_id = +selectedValueEdit - 1;
    } else {
      requestData.vinculo_id = null;
    }

    const response = await apiClient.patch(`/Objetivos/${id}`, requestData);
    if (response) {
      setLoading(false);
      toast.success("Objetivo atualizada com sucesso!");
      fetchObjetivos();
    } else {
      toast.warning("Erro ao editar Objetivo");
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

    const response = await apiClient.post(`/Objetivos`, requestData);
    if (response) {
      setSelectedValue("");
      setCreateNomeObjetivo("");
      setCreateValor(0);
      setCreateVinculo("");
      setLoading(false);
      toast.success("Objetivo criada com sucesso!");
      fetchObjetivos();
      setIsModalCreate(false);
    } else {
      toast.error("Erro ao editar Objetivo");
    }
  }

  const handleCloseEdit = () => {
    setIsModalEdit(false);
  };
  const handleCloseCreate = () => {
    setIsModalCreate(false);
  };

  const fetchObjetivos = async () => {
    const apiClient = setupAPIClient();
    try {
      if (filterDate !== "") {
        const response = await apiClient.get(
          `/Objetivos/${filterDate}/${filterType}`
        );

        setObjetivos(response.data);
      } else {
        const response = await apiClient.get("/Objetivos");
        setObjetivos(response.data);
      }
    } catch (error) {
      console.error("Erro ao buscar as Objetivos:", error.message);
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
          `/Objetivos/${formattedDate}/${type}`
        );

        setObjetivos(response.data);
      } else {
        setObjetivos(initialObjetivos);
      }
    } catch (error) {
      console.error("Erro ao buscar as Objetivos:", error.message);
      setObjetivos([]);
    }
  };

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleChangeEdit = (event) => {
    setSelectedValueEdit(event.target.value);
  };

  useEffect(() => {
    fetchObjetivos();
  }, []);
  return (
    <>
      <Head>
        <title>Conta Plus - Metas</title>
      </Head>
      <div className={styles.component}>
        <Header />
        <div className={styles.objetivosComponent}>
          <MenuLateral />
          <div className={styles.objetivos}>
            <Title
              textColor="#0E1557"
              color="#B7C1DA"
              icon="metas"
              text="MINHAS METAS"
            />
            <div className={styles.content}>
              <div className={styles.filters}>
                <Calendar
                  textButton="Filtrar"
                  type="day"
                  colorButton="#0E1557"
                  onDateSelect={(date, type) =>
                    filterObjetivosByDate(date, type)
                  }
                />
              </div>
              {objetivos.length > 0 ? (
                <Table columns={columns} data={objetivos} color="#686D9F" />
              ) : (
                <NotFound />
              )}
              <div className={styles.footercreate}>
                <div className={styles.total}>
                  <p>Guardado este Mês: </p>
                  <span>{formatCurrency(total)}</span>
                </div>
                <ButtonPages
                  bg="#0E1557"
                  onClick={() => setIsModalCreate(true)}
                >
                  Criar Objetivo
                </ButtonPages>
              </div>
            </div>
          </div>
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
