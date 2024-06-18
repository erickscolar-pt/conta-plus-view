import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/apiCliente';
import { toast } from 'react-toastify'
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router'
import { isTokenExpired } from '@/utils/isTokenExpired';

type AuthContextData = {
  usuario: UsuarioProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  checkPlan: (plan: SelectedPlanType) => void;
  signUp: (credentials: SignUpProps) => Promise<Object>
}

type UsuarioProps = {
  id: number;
  username?: string;
  token?: string;
}

type SignInProps = {
  username: string;
  password: string;
}

type SignUpProps = {
  nome: string,
  email: string,
  username: string,
  senha: string,
  codigoRecomendacao: string
}

export type SelectedPlanType = {
  description?: string,
  email: string,
  usuario_id: number,
  plano_id: number
}


type ReqLinkProps = {
  userId: number,
  urlReferencia: string
}

type AuthProviderProps = {
  children: ReactNode;
}

export type ResponsePayments = {
  id: number,
  qr_code: string,
  qr_code_base64: string,
}

export const AuthContexts = createContext({} as AuthContextData)

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token')
    sessionStorage.removeItem('id')
    sessionStorage.removeItem('nivel')
    Router.push('/')
  } catch {
    console.log('erro ao deslogar')
  }
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [usuario, setUsuario] = useState<UsuarioProps>()

  const isAuthenticated = !!usuario;

  useEffect(() => {
    // Verifica se o token expirou ao renderizar o componente de layout
    if (isTokenExpired()) {
      // Redireciona o usuário para a página de login se o token expirou
      signOut()
    }
  }, []);

  async function signIn({ username, password }: SignInProps) {
    try {
      const response = await api.post('/auth/signin', {
        username,
        password
      });
      console.log(response.status);
      const { id, email, token, isPaymentDone, requirePayment } = response.data;

      if (window) {
        // set props data to session storage or local storage 
        sessionStorage.setItem('id', id);
      }

      setUsuario({
        id,
        username,
      });

      // Passar para as proximas requisições o token
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      if (requirePayment) {
        const res = await api(`${process.env.NEXT_PUBLIC_API_URL}/payments/planos`);
        if (!res.data) {
          throw new Error('Failed to fetch');
        }

        toast.warning("Sem plano definido, escolha um plano.");
        Router.push({
          pathname: '/paymentuser',
          query: {
            userData: JSON.stringify({ id, email }), // Passe o usuário corretamente
            planosData: JSON.stringify(res.data) // Certifique-se de passar o data aqui
          }
        });
      }

      if (isPaymentDone) {
        setCookie(undefined, '@nextauth.token', token, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/" // Quais caminhos terao acesso ao cookie
        });
        toast.success("Bem vindo!");
        Router.push('/ganhos');
      } else {
        const payment = await api.get('/payments/user');
        toast.warning("Pagamento pendente.");
        Router.push({
          pathname: '/payment',
          query: { paymentData: JSON.stringify(payment.data) }
        });
      }

    } catch (err) {
      console.log(err);
      toast.error("Erro ao acessar.");
    }
  }


  async function signUp({ nome, email, username, senha, codigoRecomendacao }: SignUpProps) {

    try {
      const response = await api.post('/user/signup', {
        nome,
        email,
        username,
        senha,
        codigoRecomendacao
      })
      toast.success("Conta criada com sucesso!")
      toast.success("Escolha um plano para seu perfil.")
      return response;
    } catch (err) {
      console.log(err)
      toast.error("Erro ao cadastrar usuario.")
    }
  }

  async function checkPlan({ email, plano_id, usuario_id, description }: SelectedPlanType) {
    try {
      const response = await api.post('/payments', {
        description,
        email,
        usuario_id,
        plano_id
      })
      const res: ResponsePayments = await response.data;
      return res
    } catch (err) {
      console.log(err)
      toast.error("Erro consultar planos.")
    }
  }

  return (
    <AuthContexts.Provider value={{ usuario, isAuthenticated, signIn, signOut, signUp, checkPlan }}>
      {children}
    </AuthContexts.Provider>
  )
}