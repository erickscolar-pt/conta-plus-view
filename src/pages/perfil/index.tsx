import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import { TiUserDeleteOutline } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Head from "next/head";
import Header from "@/component/header";
import MenuLateral from "@/component/menulateral";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { isValidUsername } from "@/helper";
import Router from "next/router";
import Chat from "@/component/chat";
import { Plano, Usuario } from "@/model/type";
import {
MdPersonRemove,
MdSend
} from "react-icons/md";

interface Usuarios {
  usuario: Usuario;
  plano: Plano;
}

export default function Perfil({ usuario, plano }: Usuarios) {
  const [nome, setNome] = useState(usuario.nome);
  const [username, setUsername] = useState(usuario.username);
  const [email, setEmail] = useState(usuario.email);
  const [inviteEmail, setInviteEmail] = useState("");
  const [acceptMail, setAcceptMail] = useState(usuario.acceptMail);
  const [loading, setLoading] = useState(false);

  const handleNomeChange = (event: React.ChangeEvent<HTMLInputElement>) => setNome(event.target.value);
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => setUsername(event.target.value);

  const handleSaveChanges = async () => {
    try {
      if (!isValidUsername(username)) {
        toast.error("O nome de usuário deve conter apenas letras, números e caracteres especiais permitidos.", { position: toast.POSITION.BOTTOM_RIGHT });
        toast.warning("Exemplo: nome_de_usuario", { position: toast.POSITION.BOTTOM_CENTER });
        return;
      }
      const apiClient = setupAPIClient();
      await apiClient.put("/user/att", { nome, username, email });
      toast.success("Alterações salvas com sucesso!", { position: toast.POSITION.BOTTOM_RIGHT });
    } catch (error: any) {
      toast.error("Erro ao salvar as alterações. Tente novamente mais tarde.", { position: toast.POSITION.BOTTOM_RIGHT });
    }
  };

  async function handleDeleteVinculo(id: number) {
    try {
      const apiClient = setupAPIClient();
      await apiClient.delete(`/vinculo/${id}`);
      toast.warning("Conta desvinculada!", { position: toast.POSITION.TOP_RIGHT });
    } catch (error: any) {
      toast.error("Erro ao salvar as alterações. Tente novamente mais tarde.", { position: toast.POSITION.TOP_CENTER });
    }
  }

  const handleToggleAcceptMail = async () => {
    try {
      const apiClient = setupAPIClient();
      await apiClient.post("/user/active-mail", { active: !acceptMail });
      setAcceptMail(!acceptMail);
      toast.success(`Notificações por e-mail ${!acceptMail ? "ativadas" : "desativadas"}`, { position: toast.POSITION.BOTTOM_RIGHT });
    } catch (error: any) {
      toast.error("Erro ao atualizar notificações. Tente novamente mais tarde.", { position: toast.POSITION.BOTTOM_RIGHT });
    }
  };

  function planoDuration(numberPlun: number) {
    switch (numberPlun) {
      case 60: return "Free (60 dias)";
      case 30: return "Mensal";
      case 180: return "Semestral";
      case 365: return "Anual";
      default: return "";
    }
  }

  function handlePlan() {
    Router.push("/paymentauth");
  }

  const handleSendInvite = async () => {
    try {
      setLoading(true);
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/user/invite-email-user", { email: inviteEmail });
      if (response.data) {
        toast.success("Convite enviado com sucesso!", { position: toast.POSITION.TOP_RIGHT });
        setInviteEmail("");
      } else {
        toast.error("Erro ao enviar convite. Verifique o e-mail e tente novamente.", { position: toast.POSITION.TOP_RIGHT });
        setInviteEmail("");
      }
    } catch (error: any) {
      toast.error("Erro ao enviar convite. Tente novamente mais tarde.", { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Conta Plus - Perfil</title>
      </Head>
      <div className="flex h-screen bg-gray-100">
        <MenuLateral />
        <div className="flex-1 flex flex-col md:ml-20 pb-16">
          <Header usuario={usuario} />
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                      <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="name">Nome</label>
                        <input
                          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          id="name"
                          type="text"
                          value={nome}
                          onChange={handleNomeChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="username">Nome de Usuário</label>
                        <input
                          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          id="username"
                          type="text"
                          value={username}
                          onChange={handleUsernameChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <input
                          className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                          id="email"
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                        {!usuario.emailVerified && (
                          <p className="text-red-500 text-xs mt-2">E-mail não verificado</p>
                        )}
                      </div>
                    </form>
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-medium text-gray-900">Notificações</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        As notificações são para os lembretes de pagamentos das suas dívidas cadastradas.
                      </p>
                      <div className="mt-4 flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                        <span className="font-medium text-gray-700">Notificações por E-mail</span>
                        <label className="relative inline-flex items-center cursor-pointer" htmlFor="email-notifications">
                          <input
                            id="email-notifications"
                            type="checkbox"
                            className="sr-only peer"
                            checked={acceptMail}
                            onChange={handleToggleAcceptMail}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:bg-emerald-600 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-8">
                    <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-emerald-800">
                        Plano Atual: {plano ? planoDuration(+plano.plan_duration) : "—"}
                      </h3>
                      <p className="text-sm text-emerald-700 mt-1">
                        {plano.plan_duration ? `Seu plano atual é válido até ${plano.expiry_date}` : ""}
                      </p>
                      <button
                        className="mt-4 w-full bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                        onClick={handlePlan}
                        type="button"
                      >
                        Mudar Plano
                      </button>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Pessoas que compartilho contas
                      </h3>
                      {usuario.contavinculo && usuario.contavinculo.length > 0 ? (
                        usuario.contavinculo.map((v, idx) => (
                          <div key={v.id || idx} className="flex items-center justify-between mb-2">
                            <span className="text-gray-700">{v.username}</span>
                            <button
                              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                              onClick={() => handleDeleteVinculo(v.id)}
                              type="button"
                              title="Remover vínculo"
                            >
                              <MdPersonRemove size={20} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm">Nenhum vínculo ativo.</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">Compartilhar Contas</h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Deseja compartilhar contas com alguém? <strong>Envie o convite por e-mail</strong>, assim que ele acessar o link vocês estarão vinculados e você poderá compartilhar contas, aproveite!
                  </p>
                  <div className="mt-4 flex items-center space-x-2">
                    <input
                      className="flex-grow px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Digite o e-mail ou nome de usuário do convidado"
                      type="text"
                      value={inviteEmail}
                      onChange={e => setInviteEmail(e.target.value)}
                    />
                    <button
                      className="p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center"
                      onClick={handleSendInvite}
                      type="button"
                    >
                      {loading ? (
                        <AiOutlineLoading3Quarters size={20} className="animate-spin" />
                      ) : (
                        <MdSend size={20} className="text-white" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-8 flex justify-end">
                  <button
                    className="bg-emerald-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                    onClick={handleSaveChanges}
                    type="button"
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Chat usuario={usuario} />
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
  } catch (error: any) {
    return {
      props: {
        usuario: [],
        plano: [],
      },
    };
  }
});