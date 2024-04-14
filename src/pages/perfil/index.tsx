import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaCopy } from 'react-icons/fa';
import { TiUserDeleteOutline } from "react-icons/ti";
import Header from '@/component/header';
import MenuLateral from '@/component/menulateral';
import { canSSRAuth } from '@/utils/canSSRAuth';
import styles from './styles.module.scss';
import { setupAPIClient } from '@/services/api';
import { Usuario } from '@/type';
import { Title } from '@/component/ui/title';
import { isValidUsername } from '@/helper';
import { Router, useRouter } from 'next/router';
import { usePathname } from 'next/navigation'

interface Usuarios {
    usuario: Usuario;
}

export default function Perfil({ usuario }: Usuarios) {
    const [nome, setNome] = useState(usuario.nome);
    const [username, setUsername] = useState(usuario.username);
    const [copied, setCopied] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    const handleCopyLink = () => {

        console.log('URL atual:', baseUrl);

        //navigator.clipboard.writeText(`https://view-conta-plus-76f002898a47.herokuapp.com/codigo/${usuario.codigoReferencia}`);
        navigator.clipboard.writeText(`${baseUrl}/codigo/${usuario.codigoReferencia}`);
        setCopied(true);
        toast.success('Link do convite copiado!', {
            position: toast.POSITION.TOP_RIGHT,
        });
    };

    const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNome(event.target.value);
    };

    const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(event.target.value);
    };

    const handleSaveChanges = async () => {
        try {
            if (!isValidUsername(username)) {
                toast.error('O nome de usuário deve conter apenas letras, números e caracteres especiais permitidos.', {
                  position: toast.POSITION.BOTTOM_RIGHT
                });
                toast.warning('Exemplo: nome_de_usuario', {
                    position: toast.POSITION.BOTTOM_CENTER
                  });
                return;
              }
            const apiClient = setupAPIClient();
            await apiClient.put('/user/att', { nome, username });
            toast.success('Alterações salvas com sucesso!', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        } catch (error) {
            console.error('Erro ao salvar alterações:', error.message);
            toast.error('Erro ao salvar as alterações. Tente novamente mais tarde.', {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
        }
    };

    async function handleDeleteVinculo(id:number){
        try {
            const apiClient = setupAPIClient();
            await apiClient.delete(`/vinculo/${id}`);
            toast.warning('Conta desvinculada!', {
                position: toast.POSITION.TOP_RIGHT,
            });
        } catch (error) {
            console.error('Erro ao salvar alterações:', error.message);
            toast.error('Erro ao salvar as alterações. Tente novamente mais tarde.', {
                position: toast.POSITION.TOP_CENTER,
            });
        } 
    }

    useEffect(() => {
        // Verifica se o código está sendo executado no navegador
        if (typeof window !== 'undefined') {
          // Obtém a URL base do navegador
          const baseUrl = window.location.origin;
          setBaseUrl(baseUrl);
        }
      }, []);

    return (
        <>
            <Header />
            <div className={styles.component}>
                <MenuLateral />
                <div className={styles.ganhosComponent}>
                    <Title textColor="#000000" color="#F0F1E8" text="PERFIL" />
                    <div className={styles.ganhos}>
                        <div className={styles.componentInputs}>
                            <div className={styles.componentEdit}>
                                <div className={styles.edit}>
                                    <label>Nome:</label>
                                    <input type="text" value={nome} onChange={handleNomeChange} />
                                </div>
                                <div className={styles.edit}>
                                    <label>Nome de Usuário:</label>
                                    <input type="text" value={username} onChange={handleUsernameChange} />
                                </div>
                                <div className={styles.edit}>
                                    <label>Email:</label>
                                    <input style={{ cursor: 'no-drop' }} type="text" value={usuario.email} readOnly />
                                </div>
                            </div>
                            <div className={styles.componentLinkAccept}>
                                {usuario.contavinculo.length > 0 &&
                                    <>
                                        <div className={styles.containerPeaples}>
                                            <h1>Pessoas que compartilho contas</h1>
                                            <div className={styles.peaples}>
                                                {
                                                    usuario.contavinculo.map((usuario, index) => {
                                                        return (
                                                            <div key={index} className={styles.remove}>
                                                                <p>{usuario.username}</p>
                                                                <button onClick={() => {handleDeleteVinculo(usuario.id)}} type="button"><TiUserDeleteOutline color='#fff' size={25} /></button>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>

                                    </>

                                }
                            </div>
                        </div>

                        <div className={styles.componentButtons}>
                            <div className={styles.link}>
                                <p>
                                    Deseja compartilhar contas com alguém ? Click e compartilhe seu link com um amigo já cadastrado, assim que ele acessar o link vocês estaram vinculados e você poderá compartilhar contas, sonhos e rendas!
                                </p>
                                <button onClick={handleCopyLink}>
                                    {copied ? 'Link Copiado, click para copiar novamente!' : <><FaCopy /> Copiar Link do Convite</>}
                                </button>
                            </div>

                            <button className={styles.save} onClick={handleSaveChanges}>Salvar Alterações</button>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apiClient = setupAPIClient(ctx);

    try {
        const response = await apiClient.get('/user/get');
        return {
            props: {
                usuario: response.data
            }
        };
    } catch (error) {
        console.error('Erro ao buscar usuario:', error.message);
        return {
            props: {
                usuario: []
            }
        };
    }
})
