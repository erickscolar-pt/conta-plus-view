import { createContext, ReactNode, useState } from 'react';
import { api } from '../services/apiCliente';
import { toast } from 'react-toastify';
import { destroyCookie, setCookie } from 'nookies';
import Router from 'next/router';

type AuthContextData = {
  usuario: UsuarioProps;
  isAuthenticated: boolean;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
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

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContexts = createContext({} as AuthContextData);

export function signOut() {
  try {
    destroyCookie(undefined, '@nextauth.token');
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
      const response = await api.post('/auth/signin', { username, password });
      const { id, name, token, role } = response.data;

      if (window) {
        sessionStorage.setItem('id', id);
      }

      setUsuario({ id, name, username, role });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/"
      });
      toast.success("Bem vindo!");
      Router.push('/ganhos');
    } catch (err) {
      console.error(err);
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
      return response;
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar usuário.");
    }
  }

  return (
    <AuthContexts.Provider value={{ usuario, isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContexts.Provider>
  );
}
