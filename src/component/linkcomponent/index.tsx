import Image from "next/image";
import { canSSRGuest } from "../../utils/canSSRGuest";
import styles from './styles.module.scss'
import imgfundo from '../../../public/img_boneco.png'
import imgLinkIcon from '../../../public/link_icon.png'
import { FormEvent, useContext, useEffect, useState } from "react";
import { FaRegCopy, FaSpinner } from "react-icons/fa";
import { toast } from 'react-toastify';
import { setupAPIClient } from "@/services/api";


export default function LinkComponent() {
    const [inputValue, setInputValue] = useState('');
    const [isButtonActive, setIsButtonActive] = useState(false)
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState(0)
    const [inputActive, setInputActive] = useState(true);
    const [activeNewLink, setActiveNewLink] = useState(true);
    const [urlLink, setUrlLink] = useState('')
    const apiClient = setupAPIClient(); 
    let urlBase = 'http://localhost:3000/user/redirect/'


    useEffect(() => {
        if(window) {
            setId(parseInt(sessionStorage.getItem('id')))
        }
    },[])

    function handleInputChange(e) {
        setInputValue(e);
        console.log(e === '')
        setIsButtonActive(e !== '');
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault()

        setLoading(true)

        if (isButtonActive) {
            apiClient

        const response = await apiClient.post('user/generate-link',{
            userId:id, 
            urlReferencia:inputValue})

            setUrlLink(urlBase+String(response.data.codigoRecomendacao))
        }

        setLoading(false)
        setInputActive(false)
        setActiveNewLink(false)
        setInputValue('')
    };

    function handleCreateLink(e: FormEvent) {
        e.preventDefault()
        setInputActive(true)
        setActiveNewLink(true)
    }

    function handleCopy() {
        navigator.clipboard.writeText(urlLink)
        toast.success('Link copiado com sucesso', {
            position: toast.POSITION.TOP_CENTER
        });
    }

    return (
        <div className={styles.content}>
            <div className={styles.direita}>
                <div className={styles.info}>
                    <Image src={imgLinkIcon} alt="" />
                    <h1>Gerador de Link</h1>
                    <p>Crie links personalizados que convertem
                        e geram comissões para você.</p>
                </div>
                <div className={styles.componentInput}>
                    <p>
                        Vá até a página que deseja compartilhar,
                        copie a URL e cole no campo abaixo para
                        criar seu link personalizado:
                    </p>

                    {inputActive ? (
                        <input
                            type="text"
                            placeholder="Cole a URL aqui..."
                            value={inputValue}
                            onChange={(e) => handleInputChange(e.target.value)}
                        />
                    ) : (
                        <button
                            onClick={handleCopy}
                            className={styles.copylink}
                        >
                            <FaRegCopy /> Copiar link personalizado
                        </button>
                    )}

                    {activeNewLink ? (
                        <button
                            onClick={handleSubmit}
                            className={isButtonActive ? styles.activebutton : styles.inativebutton}
                            disabled={!isButtonActive}
                        >
                            {loading ? (
                                <FaSpinner color="#FFF" size={16} />
                            ) : (
                                'Criar link personalizado'
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={handleCreateLink}
                            className={styles.activelink}
                        >
                            Criar novo link
                        </button>
                    )}
                </div>
            </div>
            <div className={styles.esquerda}>

                <Image width={500} src={imgfundo} alt="" />
                <p>Links personalizados <b>aumentam
                    as suas chances e conversão em até 50%, </b>
                    criando mais comissões para você.
                    <b> Comece agora a criar e compartilhar seus links.</b></p>
            </div>
        </div>
    )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {

    return {
        props: {}
    }
})
