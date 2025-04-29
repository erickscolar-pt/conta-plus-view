import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCopy, FaCheck } from "react-icons/fa";
import { TiUserDeleteOutline } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
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
import Chat from "@/component/chat";

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
  const [inviteEmail, setInviteEmail] = useState("");
  const [acceptMail, setAcceptMail] = useState(usuario.acceptMail);
  const [loading, setLoading] = useState(false)
  const handleCopyLink = () => {
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

  const handleToggleAcceptMail = async () => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/user/active-mail", { active: !acceptMail });
      setAcceptMail(!acceptMail);
      toast.success(
        `Notificações por e-mail ${
          !acceptMail ? "ativadas" : "desativadas"
        }`,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    } catch (error) {
      console.error("Erro ao atualizar notificações:", error.message);
      toast.error(
        "Erro ao atualizar notificações. Tente novamente mais tarde.",
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    }
  };

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

  const handleSendInvite = async () => {
    try {
      setLoading(true)
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/user/invite-email-user", {
        email: inviteEmail
      });
      if (response.data) {
        toast.success("Convite enviado com sucesso!", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setInviteEmail('')
        setLoading(false)
      } else {
        toast.error(
          "Erro ao enviar convite. Verifique o e-mail e tente novamente.",
          {
            position: toast.POSITION.TOP_RIGHT,
          }
        );
        setInviteEmail('')
        setLoading(false)
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error.message);
      toast.error("Erro ao enviar convite. Tente novamente mais tarde.", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Conta Plus - Perfil</title>
      </Head>
      <div className={styles.component}>
        <Header usuario={usuario}/>
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
                    <p className="text-red-500 text-xs mt-2">
                      E-mail não verificado
                    </p>
                  )}
                </div>
                <div className="flex flex-col justify-start gap-4 mt-4 mb-2 border border-black rounded-xl p-4 ">
                  <div className="w-full">
                    <p>
                      As notificações são para os lembretes de pagamentos das
                      suas dividas cadastradas.
                    </p>
                  </div>
                  <div className=" flex justify-start gap-4 w-full">
                    <label className="text-sm font-medium text-gray-700">
                      Notificações por E-mail:
                    </label>
                    <button
                      onClick={handleToggleAcceptMail}
                      className={`${
                        acceptMail ? "bg-green-500" : "bg-gray-200"
                      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}
                    >
                      <span
                        className={`${
                          acceptMail ? "translate-x-6" : "translate-x-1"
                        } inline-block h-4 w-4 transform bg-white rounded-full transition-transform`}
                      />
                    </button>
                  </div>
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
                  Deseja compartilhar contas com alguém ?{" "}
                  <b>envie o convite por e-mail</b>, assim que ele acessar o
                  link vocês estaram vinculados e você poderá compartilhar
                  contas, aproveite!
                </p>
                {/* <button className={styles.btnLink} onClick={handleCopyLink}>
                  {copied ? (
                    "Link Copiado, click para copiar novamente!"
                  ) : (
                    <>
                      <FaCopy /> Copiar Link do Convite
                    </>
                  )}
                </button> */}
                <div className="flex w-full mt-4">
                  <input
                    className="flex-1 p-2 border border-gray-300 rounded-l-xl"
                    type="email"
                    placeholder="Digite o e-mail ou nome de usuario do convidado"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <button
                    className="px-4 py-2 text-white border bg-primary rounded-r-xl hover:bg-ganhos"
                    onClick={handleSendInvite}
                  >
                    {loading ? <AiOutlineLoading3Quarters size={16} className="animate-spin text-4xl text-white" /> : <FaCheck />}
                  </button>
                </div>
              </div>
              <button className={styles.btn} onClick={handleSaveChanges}>
                Salvar Alterações
              </button>
            </div>

            <div className={styles.toggleContainer}></div>
          </div>
        </div>
      </div>
      <Chat usuario={usuario}/>

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
