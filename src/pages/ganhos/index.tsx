import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import styles from './styles.module.scss'
import iconGanhos from '../../../public/icons/icon_ganhos_green.png'
import Image from "next/image";
import { Title } from "@/component/ui/title";
import { Table } from "@/component/ui/table";
import { setupAPIClient } from "@/services/api";
import { Rendas } from "@/type";
import { formatCurrency, formatDate } from "@/helper";
import { useEffect, useState } from "react";
import Modal from "@/component/ui/modal";
import { Button } from "@/component/ui/button";
import { ButtonPages } from "@/component/ui/buttonPages";
import Calendar from "@/component/ui/calendar";
import { toast } from "react-toastify";

interface Ganhos {
    rendas: Rendas[];
}
export default function Ganhos({ rendas: initialRendas }: Ganhos) {
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [valor, setValor] = useState(0)
    const [nomeRenda, setNomeRenda] = useState("")
    const [vinculo, setVinculo] = useState("")
    const [createValor, setCreateValor] = useState(0)
    const [createNomeRenda, setCreateNomeRenda] = useState("")
    const [createVinculo, setCreateVinculo] = useState("")
    const [createSelectedDate, setCreateSelectedDate] = useState<Date | null>(null);
    const [modalRendas, setModalRendas] = useState<Rendas>()
    const [loading, setLoading] = useState(false)
    const [rendas, setRendas] = useState<Rendas[]>(initialRendas);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const columns = [
        { title: 'Valor', key: 'valor', formatter: formatCurrency },
        { title: 'Recebido de:', key: 'nome_renda' },
        { title: 'Vinculado á:', key: '' },
        { title: 'Data de Inclusão', key: 'data_inclusao', formatter: formatDate },
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
        setModalRendas(renda)
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
        const response = await apiClient.patch(`/rendas/${id}`, {
            nome_renda: nomeRenda,
            valor: valor
        })
        if (response) {
            setLoading(false)
            toast.success("Renda atualizada com sucesso!")
            fetchRendas();
        } else {
            toast.warning("Erro ao editar renda")
        }
    };

    async function createRenda() {
        setLoading(true)
        console.log(createValor)
        if (!createNomeRenda || !createValor || !createSelectedDate) {
            toast.warning("Preencha todos os campos!")
            setLoading(false)
            return;
        }
        const apiClient = setupAPIClient();

        const response = await apiClient.post(`/rendas`, {
            nome_renda: createNomeRenda,
            valor: createValor,
            data_inclusao: createSelectedDate
        })
        if (response) {
            setCreateNomeRenda("")
            setCreateValor(0)
            setCreateVinculo("")
            setLoading(false)
            toast.success("Renda atualizada com sucesso!")
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

    const filterRendasByDate = () => {
        if (selectedDate) {
            const filteredRendas = initialRendas.filter(renda => {
                const rendaDate = new Date(renda.data_inclusao);
                const filterDate = new Date(selectedDate)
                return rendaDate.getDate() === filterDate.getDate();
            });

            setRendas(filteredRendas);

        } else {
            setRendas(initialRendas);
        }
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
                            <Calendar onDateSelect={(date) => setSelectedDate(date)} />
                            <ButtonPages onClick={() => filterRendasByDate()}>Filtrar</ButtonPages>
                        </div>
                        <Table columns={columns} data={rendas} color="#599E52" />
                        <div className={styles.footercreate}>
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
                        <input onChange={(e) => { setNomeRenda(e.target.value) }} type="text" defaultValue={modalRendas?.nome_renda} />
                    </label>
                    <label>
                        <span>Valor:</span>
                        <input onChange={(e) => { setValor(+e.target.value) }} type="text" defaultValue={modalRendas?.valor} />
                    </label>
                    <span>
                        Data de Inclusão:
                        {formatDate(modalRendas?.data_inclusao)}
                    </span>
                    <ButtonPages loading={loading} onClick={() => saveEdit(modalRendas?.id)}>Salvar</ButtonPages>
                </div>
            </Modal>

            <Modal isOpen={isModalCreate} onClose={handleCloseCreate}>
                <div className={styles.containerModal}>
                    <h2>Criar Renda</h2>

                    <label>
                        <span>Recebido de:</span>
                        <input onChange={(e) => { setCreateNomeRenda(e.target.value) }} type="text" defaultValue={modalRendas?.nome_renda} />
                    </label>
                    <label>
                        <span>Valor:</span>
                        <input onChange={(e) => { setCreateValor(+e.target.value) }} type="text" defaultValue={modalRendas?.valor} />
                    </label>
                    <Calendar onDateSelect={(date) => setCreateSelectedDate(date)} />

                    <ButtonPages loading={loading} onClick={() => createRenda()}>Salvar</ButtonPages>
                </div>
            </Modal>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    try {
        const response = await apiClient.get('/rendas');
        return {
            props: {
                rendas: response.data
            }
        };
    } catch (error) {
        console.error('Erro ao buscar as rendas:', error.message);
        return {
            props: {
                rendas: []
            }
        };
    }
});
