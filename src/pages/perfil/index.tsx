import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCopy } from "react-icons/fa";
import { TiUserDeleteOutline } from "react-icons/ti";
import Header from "@/component/header";
import MenuLateral from "@/component/menulateral";
import { canSSRAuth } from "@/utils/canSSRAuth";
import styles from "./styles.module.scss";
import { setupAPIClient } from "@/services/api";
import { Title } from "@/component/ui/title";
import { isValidUsername } from "@/helper";
import Router from "next/router";
import Head from "next/head";
import { Plano, Usuario } from "@/model/type";

interface Usuarios {
  usuario: Usuario;
  plano: Plano;
}

export default function Perfil({ usuario, plano }: Usuarios) {
  const [nome, setNome] = useState(usuario.nome);
  const [username, setUsername] = useState(usuario.username);
  const [email, setEmail] = useState(usuario.email);
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  const handleCopyLink = () => {
    console.log("URL atual:", baseUrl);

    navigator.clipboard.writeText(
      `${baseUrl}/codigo/${usuario.codigoReferencia}`
    );
    setCopied(true);
    toast.success("Link do convite copiado!", {
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
        toast.error(
          "O nome de usuário deve conter apenas letras, números e caracteres especiais permitidos.",
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
        toast.warning("Exemplo: nome_de_usuario", {
          position: toast.POSITION.BOTTOM_CENTER,
        });
        return;
      }
      const apiClient = setupAPIClient();
      await apiClient.put("/user/att", { nome, username, email });
      toast.success("Alterações salvas com sucesso!", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error) {
      console.error("Erro ao salvar alterações:", error.message);
      toast.error("Erro ao salvar as alterações. Tente novamente mais tarde.", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  async function handleDeleteVinculo(id: number) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.delete(`/vinculo/${id}`);
      toast.warning("Conta desvinculada!", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.error("Erro ao salvar alterações:", error.message);
      toast.error("Erro ao salvar as alterações. Tente novamente mais tarde.", {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  useEffect(() => {
    // Verifica se o código está sendo executado no navegador
    if (typeof window !== "undefined") {
      // Obtém a URL base do navegador
      const baseUrl = window.location.origin;
      setBaseUrl(baseUrl);
    }
  }, []);

  function planoDuration(numberPlun: number) {
    switch (numberPlun) {
      case 60:
        return "Free(60 dias)";
      case 30:
        return "Mensal";
      case 180:
        return "Semestral";
      case 365:
        return "Anual";
      default:
        return "";
    }
  }

  function handlePlan() {
    Router.push("/paymentauth");
  }

  return (
    <>
      <Head>
        <title>Conta Plus - Perfil</title>
      </Head>
      <div className={styles.component}>
        <Header />
        <div className={styles.perfilComponent}>
          <MenuLateral />
          <div className={styles.perfil}>
            <Title textColor="#000000" color="#F0F1E8" text="PERFIL" />
            <div className={styles.componentInputs}>
              <div className={styles.componentEdit}>
                <div className={styles.edit}>
                  <label>Nome:</label>
                  <input type="text" value={nome} onChange={handleNomeChange} />
                </div>
                <div className={styles.edit}>
                  <label>Nome de Usuário:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                  />
                </div>
                <div className={styles.edit}>
                  <label>Email:</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {!usuario.emailVerified && (
                    <p className="text-red-500 text-xs mt-2">E-mail não verificado</p>
                  )}
                </div>
              </div>
              <div className={styles.componentLinkAccept}>
                {plano && (
                  <>
                    <div className={styles.planContainer}>
                      <p>Plano atual: {planoDuration(+plano.plan_duration)}</p>
                      <button onClick={() => handlePlan()} type="button">
                        Mudar plano
                      </button>
                    </div>
                  </>
                )}
                {usuario.contavinculo.length > 0 && (
                  <>
                    <div className={styles.containerPeaples}>
                      <h1>Pessoas que compartilho contas</h1>
                      <div className={styles.peaples}>
                        {usuario.contavinculo.map((usuario, index) => {
                          return (
                            <div key={index} className={styles.remove}>
                              <p>{usuario.username}</p>
                              <button
                                onClick={() => {
                                  handleDeleteVinculo(usuario.id);
                                }}
                                type="button"
                              >
                                <TiUserDeleteOutline color="#fff" size={25} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className={styles.componentButtons}>
              <div className={styles.link}>
                <p>
                  Deseja compartilhar contas com alguém ? Click e compartilhe
                  seu link com um amigo já cadastrado, assim que ele acessar o
                  link vocês estaram vinculados e você poderá compartilhar
                  contas, aproveite!
                </p>
                <button onClick={handleCopyLink}>
                  {copied ? (
                    "Link Copiado, click para copiar novamente!"
                  ) : (
                    <>
                      <FaCopy /> Copiar Link do Convite
                    </>
                  )}
                </button>
              </div>

              <button className={styles.save} onClick={handleSaveChanges}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  try {
    const user = await apiClient.get("/user/get");
    const plano = await apiClient.get("/payments/plano-user");
    return {
      props: {
        usuario: user.data,
        plano: plano.data,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar usuario:", error.message);
    return {
      props: {
        usuario: [],
        plano: [],
      },
    };
  }
});
