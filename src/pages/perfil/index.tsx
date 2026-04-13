import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Head from "next/head";
import Header from "@/component/header";
import MenuLateral from "@/component/menulateral";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { isValidUsername } from "@/helper";
import Chat from "@/component/chat";
import { Usuario } from "@/model/type";
import {
MdPersonRemove,
MdContentCopy,
MdSend
} from "react-icons/md";

interface Usuarios {
  usuario: Usuario;
}

export default function Perfil({ usuario }: Usuarios) {
  const [nome, setNome] = useState(usuario.nome);
  const [username, setUsername] = useState(usuario.username);
  const [email, setEmail] = useState(usuario.email);
  const [inviteIdentifier, setInviteIdentifier] = useState("");
  const [inviteLink, setInviteLink] = useState("");
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

  const handleSendInvite = async () => {
    try {
      setLoading(true);
      const apiClient = setupAPIClient();
      const response = await apiClient.post("/user/invite-link", { identifier: inviteIdentifier });
      setInviteLink(response.data.link);
      toast.success("Link de convite gerado com sucesso!", { position: toast.POSITION.TOP_RIGHT });
    } catch (error: any) {
      toast.error("Erro ao gerar convite. Verifique o usuário informado.", { position: toast.POSITION.TOP_RIGHT });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteLink = async () => {
    if (!inviteLink) {
      return;
    }

    await navigator.clipboard.writeText(inviteLink);
    toast.success("Link copiado!", { position: toast.POSITION.TOP_RIGHT });
  };

  return (
    <>
      <Head>
        <title>Conta Plus - Perfil</title>
      </Head>
      <div className="flex h-screen bg-gray-100">
        <MenuLateral />
        <div className="flex-1 flex flex-col md:ml-20 max-sm:pb-16">
          <Header usuario={usuario} />
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-lg p-8 lg:m-8">
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
                      </div>
                    </form>
                  </div>
                  <div className="space-y-8">
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
                    Gere um link para outro usuário já cadastrado. Basta informar o e-mail ou nome de usuário dele e compartilhar o link manualmente.
                  </p>
                  <div className="mt-4 flex items-center space-x-2">
                    <input
                      className="flex-grow px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      placeholder="Digite o e-mail ou nome de usuário do convidado"
                      type="text"
                      value={inviteIdentifier}
                      onChange={e => setInviteIdentifier(e.target.value)}
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
                  {inviteLink && (
                    <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                      <p className="text-sm text-emerald-900 break-all">{inviteLink}</p>
                      <button
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                        onClick={handleCopyInviteLink}
                        type="button"
                      >
                        <MdContentCopy size={18} />
                        Copiar link
                      </button>
                    </div>
                  )}
                </div>
                <div className="mt-8 flex justify-end max-md:justify-start">
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

    return {
      props: {
        usuario: user.data,
      },
    };
  } catch (error: any) {
    return {
      props: {
        usuario: [],
      },
    };
  }
});
