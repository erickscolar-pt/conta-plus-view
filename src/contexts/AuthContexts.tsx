import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/apiCliente';
import { toast } from 'react-toastify';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router';
import { isTokenExpired } from '@/utils/isTokenExpired';

type AuthContextData = {
  usuario: UsuarioProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  checkPlan: (plan: SelectedPlanType) => Promise<ResponsePayments>;
  signUp: (credentials: SignUpProps) => Promise<Object>
}

type UsuarioProps = {
  id: number;
  name: string;
  username?: string;
  token?: string;
  role: boolean;
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
  codigoRecomendacao: string,
  acceptTerms: boolean
}

export type SelectedPlanType = {
  description?: string,
  email: string,
  usuario_id: number,
  plano_id: number
}

type AuthProviderProps = {
  children: ReactNode;
}

export type ResponsePayments = {
  id: number,
  qr_code: string,
  qr_code_base64: string,
  payment: boolean,
  isDone: boolean,
  msg: string
}

export const AuthContexts = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('nivel');
    Router.push('/');
  } catch {
    console.log('Erro ao deslogar');
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioProps>();

  const isAuthenticated = !!usuario;

  useEffect(() => {
    if (isTokenExpired()) {
      console.log("Token expired, signing out");
      //signOut();
    }
  }, []);

  async function signIn({ username, password }: SignInProps) {
    try {
      const response = await api.post('/auth/signin', { username, password });
      const { id, name ,email, token, isPaymentDone, requirePayment, role } = response.data;

      if (window) {
        sessionStorage.setItem('id', id);
      }

      setUsuario({ id, name, username, role });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      if(role){
        setCookie(undefined, '@nextauth.token', token, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/"
        });
        Router.push({ pathname: '/admin' });
        toast.success("Bem vindo à administração do sistema.");
        return;
      }

      if (requirePayment) {
        const res = await api(`${process.env.NEXT_PUBLIC_API_URL}/payments/planos`);
        if (!res.data) {
          throw new Error('Failed to fetch');
        }

        toast.warning("Sem plano definido, escolha um plano.");
        Router.push({
          pathname: '/paymentuser',
          query: { userData: JSON.stringify({ id, email }), planosData: JSON.stringify(res.data) }
        });
      }

      if (isPaymentDone) {
        setCookie(undefined, '@nextauth.token', token, {
          maxAge: 60 * 60 * 24 * 30,
          path: "/"
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

  async function signUp({ nome, email, username, senha, codigoRecomendacao, acceptTerms }: SignUpProps) {
    try {
      const response = await api.post('/user/signup', {
        nome,
        email,
        username,
        senha,
        codigoRecomendacao,
        acceptTerms
      });
      toast.success("Conta criada com sucesso!");
      toast.success("Escolha um plano para seu perfil.");
      return response;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao cadastrar usuário.");
    }
  }

  async function checkPlan({ email, plano_id, usuario_id, description }: SelectedPlanType) {
    try {
      const response = await api.post('/payments', {
        description,
        email,
        usuario_id,
        plano_id
      });
      const res: ResponsePayments = await response.data;
      if(!res.isDone){
        toast.warn(res.msg);
        return;
      }
      if(res.payment === false){
        Router.push('/')
        return;
      }
      return res;
    } catch (err) {
      console.log(err);
      toast.error("Erro ao consultar planos.");
    }
  }

  return (
    <AuthContexts.Provider value={{ usuario, isAuthenticated, signIn, signOut, signUp, checkPlan }}>
      {children}
    </AuthContexts.Provider>
  );
}
