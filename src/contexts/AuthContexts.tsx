import { createContext, ReactNode, useState } from 'react';
import { AxiosError } from 'axios';
import axios from 'axios';
import { api } from '../services/apiCliente';
import { getErrorMessage } from '../services/api';
import { toast } from 'react-toastify';
import Router from 'next/router';

type AuthContextData = {
  usuario: UsuarioProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (credentials: SignUpProps) => Promise<{ data: unknown }>
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

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContexts = createContext({} as AuthContextData);

export async function signOut() {
  try {
    await axios.post('/api/auth/logout');
    sessionStorage.removeItem('id');
    sessionStorage.removeItem('nivel');
    Router.push('/');
  } catch {
    console.error('Erro ao deslogar');
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [usuario, setUsuario] = useState<UsuarioProps>();

  const isAuthenticated = !!usuario;

  async function signIn({ username, password }: SignInProps) {
    try {
      const response = await axios.post('/api/auth/signin', { username, password });
      const { id, name, role } = response.data;

      if (window) {
        sessionStorage.setItem('id', id);
      }

      setUsuario({ id, name, username, role });

      toast.success('Bem vindo!');
      /* Navegação completa: garante que o cookie httpOnly vá no pedido ao SSR. */
      if (typeof window !== 'undefined') {
        window.location.assign('/movimentacoes');
      } else {
        await Router.push('/movimentacoes');
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao acessar.");
    }
  }

  async function signUp({ nome, email, username, senha, codigoRecomendacao, acceptTerms }: SignUpProps) {
    try {
      const payload: Record<string, unknown> = {
        nome,
        email,
        username,
        senha,
        acceptTerms,
      };
      if (codigoRecomendacao && String(codigoRecomendacao).trim() !== '') {
        payload.codigoRecomendacao = String(codigoRecomendacao).trim();
      }

      const response = await api.post('/user/signup', payload);
      return response;
    } catch (err) {
      const ax = err as AxiosError<{ message?: string | string[] }>;
      const msg = ax.response?.data
        ? getErrorMessage(ax.response.data)
        : 'Não foi possível concluir o cadastro.';
      toast.error(msg);
      throw err;
    }
  }

  return (
    <AuthContexts.Provider value={{ usuario, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContexts.Provider>
  );
}
