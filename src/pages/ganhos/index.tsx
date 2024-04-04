import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import styles from './styles.module.scss'
import iconGanhos from '../../../public/icons/icon_ganhos_green.png'
import Image from "next/image";
import { Title } from "@/component/ui/title";
import { Table } from "@/component/ui/table";
import { setupAPIClient } from "@/services/api";
import { Rendas, Usuario } from "@/type";
import { formatCurrency, formatDate, formatVinculoUsername } from "@/helper";
import { useEffect, useState } from "react";
import Modal from "@/component/ui/modal";
import { Button } from "@/component/ui/button";
import { ButtonPages } from "@/component/ui/buttonPages";
import Calendar from "@/component/ui/calendar";
import { toast } from "react-toastify";
import InputMoney from "@/component/ui/inputMoney";

interface Ganhos {
    rendas: Rendas[];
    usuario: Usuario;
}
interface RequestData {
    nome_renda: string;
    valor: number;
    data_inclusao?: Date;
    vinculo_id?: number; // O campo vinculo_id é opcional
}

export default function Ganhos({ rendas: initialRendas, usuario }: Ganhos) {
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [valor, setValor] = useState(0)
    const [nomeRenda, setNomeRenda] = useState("")
    const [selectedValueEdit, setSelectedValueEdit] = useState('');

    const [createValor, setCreateValor] = useState(0)
    const [createNomeRenda, setCreateNomeRenda] = useState("")
    const [createVinculo, setCreateVinculo] = useState("")
    const [createSelectedDate, setCreateSelectedDate] = useState<Date | null>(null);
    const [selectedValue, setSelectedValue] = useState('');
    const [modalRendas, setModalRendas] = useState<Rendas>()
    const [loading, setLoading] = useState(false)
    const [rendas, setRendas] = useState<Rendas[]>(initialRendas);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const total = rendas.reduce((acc: number, renda: Rendas) => acc + (renda.valor || 0), 0);


    const columns = [
        { title: 'Valor', key: 'valor', formatter: formatCurrency },
        { title: 'Recebido de :', key: 'nome_renda' },
        { title: 'Vinculado á :', key: 'vinculo.username' },
        { title: 'Pago dia :', key: 'data_inclusao', formatter: formatDate },
        {
            title: '',
            key: 'edit',
            render: (renda: Rendas) =>
                <button
                    className={styles.edit}
                    onClick={() => handleEdit(renda)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.7167 7.5L12.5 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.5ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z" fill="white" />
                    </svg>

                </button>
        },
        {
            title: '',
            key: 'delete',
            render: (renda: Rendas) =>
                <button
                    className={styles.del}
                    onClick={() =>
                        handleDelete(renda)}>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.7913 1.2085L1.20801 15.7918" stroke="white" stroke-width="2.33" stroke-linecap="round" />
                        <path d="M1.20801 1.2085L15.7913 15.7918" stroke="white" stroke-width="2.33" stroke-linecap="round" />
                    </svg>


                </button>
        },
    ];

    const handleEdit = (renda: Rendas) => {
        if (renda.vinculo) {
            setSelectedValueEdit(JSON.stringify(renda.vinculo.id));
        }
        setModalRendas(renda)
        setNomeRenda(renda.nome_renda)
        setValor(renda.valor)
        setIsModalEdit(true);
    };

    async function handleDelete(renda: Rendas) {
        setLoading(true)
        const apiClient = setupAPIClient();

        setIsModalEdit(false);
        const response = await apiClient.delete(`/rendas/${renda.id}`)
        if (response) {
            setLoading(false)
            toast.warning("Renda excluida!")
            fetchRendas();
        } else {
            toast.warning("Erro ao deletar renda")
        }
    };

    async function saveEdit(id: number) {
        setLoading(true)
        const apiClient = setupAPIClient();

        setIsModalEdit(false);

        const requestData: RequestData = {
            nome_renda: nomeRenda,
            valor: valor,
        };

        if (selectedValueEdit !== null && selectedValueEdit !== "" && +selectedValueEdit !== 1) {
            requestData.vinculo_id = +selectedValueEdit - 1;
        } else {
            requestData.vinculo_id = null;
        }

        const response = await apiClient.patch(`/rendas/${id}`, requestData)
        if (response) {
            setLoading(false)
            toast.success("Renda atualizada com sucesso!")
            fetchRendas();
        } else {
            toast.warning("Erro ao editar renda")
        }
    };

    async function createRenda(date: Date) {
        setLoading(true)
        if (!createNomeRenda || !createValor || !date) {
            toast.warning("Preencha todos os campos!")
            setLoading(false)
            return;
        }
        const apiClient = setupAPIClient();

        date.setDate(date.getDate()+1)
        date.setHours(0, 0, 0, 0);

        const requestData: RequestData = {
            nome_renda: createNomeRenda,
            valor: createValor,
            data_inclusao: date,
        };

        if (selectedValue !== null && selectedValue !== "") {
            requestData.vinculo_id = +selectedValue;
        }

        const response = await apiClient.post(`/rendas`, requestData)
        if (response) {
            setSelectedValue("")
            setCreateNomeRenda("")
            setCreateValor(0)
            setCreateVinculo("")
            setLoading(false)
            toast.success("Renda criada com sucesso!")
            fetchRendas();
            setIsModalCreate(false);
        } else {
            toast.error("Erro ao editar renda")
        }
    }

    const handleCloseEdit = () => {
        setIsModalEdit(false);
    }
    const handleCloseCreate = () => {
        setIsModalCreate(false);
    }

    const fetchRendas = async () => {
        const apiClient = setupAPIClient();
        try {
            const response = await apiClient.get('/rendas');
            setRendas(response.data);
        } catch (error) {
            console.error('Erro ao buscar as rendas:', error.message);
            setRendas([]);
        }
    };

    const filterRendasByDate = async (date: Date, type: 'day' | 'month') => {
        const apiClient = setupAPIClient();

        try {
            if (date && type ) {
                const formattedDate = date.toISOString().split('T')[0] + 'T03:00:00Z';


                const response = await apiClient.get(`/rendas/${formattedDate}/${type}`);

                setRendas(response.data);


            } else {
                setRendas(initialRendas);
            }

        } catch (error) {
            console.error('Erro ao buscar as rendas:', error.message);
            setRendas([]);
        }
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleChangeEdit = (event) => {
        setSelectedValueEdit(event.target.value);
    };

    useEffect(() => {
        fetchRendas();
    }, []);

    return (
        <>
            <Header />
            <div className={styles.component}>
                <MenuLateral />
                <div className={styles.ganhosComponent}>
                    <Title textColor="#0E5734" color="#B5E1A0" icon="ganhos" text="MEUS GANHOS" />
                    <div className={styles.ganhos}>
                        <div className={styles.filters}>
                            <Calendar type="day" textButton="Filtrar" onDateSelect={(date, type) => filterRendasByDate(date,type)} />
                        </div>
                        <Table columns={columns} data={rendas} color="#599E52" />

                        <div className={styles.footercreate}>
                            <div className={styles.total}>
                                <p>Sua renda : </p>
                                <span>{formatCurrency(total)}</span>
                            </div>
                            <ButtonPages onClick={() => setIsModalCreate(true)}>Criar Renda</ButtonPages>
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalEdit} onClose={handleCloseEdit}>
                <div className={styles.containerModal}>
                    <h2>Editar Renda</h2>
                    <label>
                        <span>Recebido de:</span>
                        <input
                            type="text"
                            value={nomeRenda}
                            onChange={(e) => setNomeRenda(e.target.value)}
                        />
                    </label>
                    <label>
                        <span>Valor:</span>
                        <InputMoney value={valor} onChange={(valor) => setValor(valor)}/>
                    </label>
                    <select value={selectedValueEdit} onChange={handleChangeEdit}>
                        <option value="">Nenhum</option>
                        {usuario.contavinculo &&
                            usuario.contavinculo.map((vinculo) => (
                                <option key={vinculo.id} value={vinculo.id_usuario_vinculado}>
                                    {vinculo.username}
                                </option>
                            ))

                        }
                    </select>
                    <span>
                        Data de Inclusão: {formatDate(modalRendas?.data_inclusao)}
                    </span>
                    <ButtonPages loading={loading} onClick={() => saveEdit(modalRendas?.id)}>Salvar</ButtonPages>
                </div>
            </Modal>

            <Modal isOpen={isModalCreate} onClose={handleCloseCreate}>
                <div className={styles.containerModal}>
                    <h2>Criar Renda</h2>
                    <label>
                        <span>Recebido de:</span>
                        <input onChange={(e) => { setCreateNomeRenda(e.target.value) }} type="text" value={createNomeRenda} />
                    </label>
                    <label>
                        <span>Valor:</span>
                        <InputMoney value={createValor} onChange={(valor) => setCreateValor(valor)}/>
                    </label>
                    <select value={selectedValue} onChange={handleChange}>
                        <option value="">Nenhum</option>
                        {usuario.contavinculo &&
                            usuario.contavinculo.map((vinculo) => (
                                <option key={vinculo.id} value={vinculo.id}>
                                    {vinculo.username}
                                </option>
                            ))
                        }
                    </select>
                    <Calendar textButton="Salvar" hideType={true} type={'day'} onDateSelect={(date) => createRenda(date)} />

                </div>
            </Modal>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);


    try {
        const user = await apiClient.get('/user/get');
        const rendas = await apiClient.get('/rendas');
        return {
            props: {
                rendas: rendas.data,
                usuario: user.data
            }
        };
    } catch (error) {
        console.error('Erro ao buscar as rendas:', error.message);
        return {
            props: {
                rendas: [],
                usuario: []
            }
        };
    }
});
