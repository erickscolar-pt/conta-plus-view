import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import styles from './styles.module.scss'
import { Title } from "@/component/ui/title";
import { Table } from "@/component/ui/table";
import { setupAPIClient } from "@/services/api";
import { Dividas, Rendas, Usuario } from "@/type";
import { formatarMoeda, formatCurrency, formatDate, formatVinculoUsername } from "@/helper";
import { useEffect, useState } from "react";
import Modal from "@/component/ui/modal";
import { ButtonPages } from "@/component/ui/buttonPages";
import Calendar from "@/component/ui/calendar";
import { toast } from "react-toastify";
import InputMoney from "@/component/ui/inputMoney";

interface Gastos {
    dividas: Dividas[];
    rendas: Rendas[];
    usuario: Usuario;
}
interface RequestData {
    nome_divida: string;
    valor: number;
    data_inclusao?: Date;
    vinculo_id?: number; // O campo vinculo_id é opcional
}
export default function Gastos({ dividas: initialDividas, rendas: initialRendas, usuario }: Gastos) {
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isModalCreate, setIsModalCreate] = useState(false);
    const [valor, setValor] = useState(0)
    const [nomeDivida, setNomeDivida] = useState("")
    const [selectedValueEdit, setSelectedValueEdit] = useState('');

    const [createValor, setCreateValor] = useState(0)
    const [createNomeDivida, setCreateNomeDivida] = useState("")
    const [createVinculo, setCreateVinculo] = useState("")
    const [createSelectedDate, setCreateSelectedDate] = useState<Date | null>(null);
    const [selectedValue, setSelectedValue] = useState('');
    const [modalDividas, setModalDividas] = useState<Dividas>()
    const [loading, setLoading] = useState(false)
    const [dividas, setDividas] = useState<Dividas[]>(initialDividas);
    const [rendas, setRendas] = useState<Rendas[]>(initialRendas);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const total = dividas.reduce((acc: number, divida: Dividas) => acc + (divida.valor || 0), 0);
    const totalRendas = rendas.reduce((acc: number, renda: Rendas) => acc + (renda.valor || 0), 0);


    const columns = [
        { title: 'Valor do boleto :', key: 'valor', formatter: formatCurrency },
        { title: 'Conta :', key: 'nome_divida' },
        { title: 'Vinculado á :', key: 'vinculo.username' },
        { title: 'Vence dia :', key: 'data_inclusao', formatter: formatDate },
        {
            title: '',
            key: 'edit',
            render: (Divida: Dividas) =>
                <button
                    className={styles.edit}
                    onClick={() => handleEdit(Divida)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11.7167 7.5L12.5 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.5ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z" fill="white" />
                    </svg>

                </button>
        },
        {
            title: '',
            key: 'delete',
            render: (Divida: Dividas) =>
                <button
                    className={styles.del}
                    onClick={() =>
                        handleDelete(Divida)}>
                    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.7913 1.2085L1.20801 15.7918" stroke="white" stroke-width="2.33" stroke-linecap="round" />
                        <path d="M1.20801 1.2085L15.7913 15.7918" stroke="white" stroke-width="2.33" stroke-linecap="round" />
                    </svg>


                </button>
        },
    ];

    const handleEdit = (Divida: Dividas) => {
        if (Divida.vinculo) {
            setSelectedValueEdit(JSON.stringify(Divida.vinculo.id));
        }
        setModalDividas(Divida)
        setNomeDivida(Divida.nome_divida)
        setValor(Divida.valor)
        setIsModalEdit(true);
    };

    async function handleDelete(Divida: Dividas) {
        setLoading(true)
        const apiClient = setupAPIClient();

        setIsModalEdit(false);
        const response = await apiClient.delete(`/Dividas/${Divida.id}`)
        if (response) {
            setLoading(false)
            toast.warning("Divida excluida!")
            fetchDividas();
        } else {
            toast.warning("Erro ao deletar Divida")
        }
    };

    async function saveEdit(id: number) {
        setLoading(true)
        const apiClient = setupAPIClient();

        setIsModalEdit(false);

        const requestData: RequestData = {
            nome_divida: nomeDivida,
            valor: valor,
        };

        if (selectedValueEdit !== null && selectedValueEdit !== "" && +selectedValueEdit !== 1) {
            requestData.vinculo_id = +selectedValueEdit - 1;
        } else {
            requestData.vinculo_id = null;
        }

        const response = await apiClient.patch(`/Dividas/${id}`, requestData)
        if (response) {
            setLoading(false)
            toast.success("Divida atualizada com sucesso!")
            fetchDividas();
        } else {
            toast.warning("Erro ao editar Divida")
        }
    };

    async function createDivida(date: Date) {
        setLoading(true)
        if (!createNomeDivida || !createValor || !date) {
            toast.warning("Preencha todos os campos!")
            setLoading(false)
            return;
        }
        const apiClient = setupAPIClient();
        date.setDate(date.getDate()+1)
        date.setHours(0, 0, 0, 0);

        const requestData: RequestData = {
            nome_divida: createNomeDivida,
            valor: createValor,
            data_inclusao: date,
        };

        if (selectedValue !== null && selectedValue !== "") {
            requestData.vinculo_id = +selectedValue;
        }

        const response = await apiClient.post(`/dividas`, requestData)
        if (response) {
            setSelectedValue("")
            setCreateNomeDivida("")
            setCreateValor(0)
            setCreateVinculo("")
            setLoading(false)
            toast.success("Divida criada com sucesso!")
            fetchDividas();
            setIsModalCreate(false);
        } else {
            toast.error("Erro ao editar Divida")
        }
    }

    const handleCloseEdit = () => {
        setIsModalEdit(false);
    }
    const handleCloseCreate = () => {
        setIsModalCreate(false);
    }

    const fetchDividas = async () => {
        const apiClient = setupAPIClient();
        try {
            const response = await apiClient.get('/dividas');
            const responserendas = await apiClient.get('/rendas');
            setRendas(responserendas.data)
            setDividas(response.data);
        } catch (error) {
            console.error('Erro ao buscar as Dividas:', error.message);
            setDividas([]);
            setRendas([])
        }
    };

    const filterDividasByDate = async (date: Date, type: 'day' | 'month') => {
        const apiClient = setupAPIClient();
        try {
            if (date && type ) {
                const formattedDate = date.toISOString().split('T')[0] + 'T03:00:00Z';

                const response = await apiClient.get(`/dividas/${formattedDate}/${type}`);
                const responseRendas = await apiClient.get(`/rendas/${formattedDate}/month`);

                setDividas(response.data);
                setRendas(responseRendas.data)


            } else {
                setDividas(initialDividas);
            } 

        } catch (error) {
            console.error('Erro ao buscar as Dividas:', error.message);
            setDividas([]);
        }
    };

    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };

    const handleChangeEdit = (event) => {
        setSelectedValueEdit(event.target.value);
    };

    function handleCreateValor (novoValor){
          setCreateValor(novoValor);

    }

    useEffect(() => {
        fetchDividas();
    }, []);
    
    return (
        <>
            <Header />
            <div className={styles.component}>
                <MenuLateral />
                <div className={styles.gastosComponent}>
                    <Title textColor="#570E0E" color="#DAB7B7" icon="gastos" text="MEUS GASTOS" />
                    <div className={styles.gastos}>
                        <div className={styles.filters}>
                            <Calendar type="day" colorButton="#570E0E" onDateSelect={(date, type) => filterDividasByDate(date, type)} />

                        </div>
                        <Table columns={columns} data={dividas} color="#C07C7C" />

                        <div className={styles.footercreate}>
                            <div className={styles.total}>
                                <p>Total de divida: </p>
                                <span>{formatCurrency(total)}</span>

                                <p>Sua renda neste mês:</p>
                                <span style={{ color: '#0E5734' }}>{formatCurrency(totalRendas)}</span>

                                <p>Sobra:</p>
                                <span style={{ backgroundColor: totalRendas - total < 0 ? '#C07C7C' : '#0E5734', color: totalRendas - total < 0 ? '#570E0E' : '#B5E1A0'}}>{formatCurrency(totalRendas - total)}</span>
                            </div>
                            <ButtonPages bg="#570E0E" onClick={() => setIsModalCreate(true)}>Criar Divida</ButtonPages>
                        </div>
                    </div>
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
                        Data vencimento: {formatDate(modalDividas?.data_inclusao)}
                    </span>
                    <ButtonPages bg="#570E0E" loading={loading} onClick={() => saveEdit(modalDividas?.id)}>Salvar</ButtonPages>
                </div>
            </Modal>

            <Modal isOpen={isModalCreate} onClose={handleCloseCreate}>
                <div className={styles.containerModal}>
                    <h2>Criar Divida</h2>
                    <label>
                        <span>Conta :</span>
                        <input onChange={(e) => { setCreateNomeDivida(e.target.value) }} type="text" value={createNomeDivida} />
                    </label>
                    <label>
                        <span>Valor do boleto:</span>
                        <InputMoney onChange={handleCreateValor} />
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
                    <Calendar colorButton="#570E0E" textButton="Salvar" hideType={true} type={'day'} onDateSelect={(date) => createDivida(date)} />

                </div>
            </Modal>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);


    try {
        const user = await apiClient.get('/user/get');
        const dividas = await apiClient.get('/dividas');
        const rendas = await apiClient.get('/rendas');

        
        return {
            props: {
                dividas: dividas.data,
                rendas: rendas.data,
                usuario: user.data
            }
        };
    } catch (error) {
        console.error('Erro ao buscar as dividas:', error.message);
        return {
            props: {
                dividas: [],
                rendas: [],
                usuario: []
            }
        };
    }
});
