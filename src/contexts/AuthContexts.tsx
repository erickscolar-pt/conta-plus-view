import { createContext, ReactNode, useState } from 'react';
import { api } from '../services/apiCliente';
import { toast } from 'react-toastify'
import { destroyCookie, setCookie } from 'nookies';
import Router from 'next/router'

type AuthContextData = {
  usuario: UsuarioProps;
  isAuthenticated: boolean;
  handleLink: (credentials: ReqLinkProps) => Promise<void>;
  signIn: (credentials: SignInProps) => Promise<void>;
  signOut: () => void;
  signUp: (credentials: SignUpProps) => Promise<void>
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
  senha: string,
  codigoRecomendacao: string
}


type ReqLinkProps = {
  userId: number,
  urlReferencia: string
}

type AuthProviderProps = {
  children: ReactNode;
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


  async function handleLink({ userId, urlReferencia }: ReqLinkProps) {
    try {
      const response = await api.post('user/generate-link', { userId, urlReferencia })
      console.log(response)
    } catch (e) {
      console.log(e)
    }
  }

  async function signIn({ username, password }: SignInProps) {


    try {
      const response = await api.post('/auth/signin', {
        username,
        password
      })

      console.log(response.data);

      const { id,email, token } = response.data;



      if (window) {
        // set props data to session storage or local storage 
        sessionStorage.setItem('id', id)
      }



      setCookie(undefined, '@nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/" // Quais caminhos terao acesso ao cookie
      })

      setUsuario({
        id,
        username,
      })

      // Passar para as proximas requisições o token
      api.defaults.headers['Authorization'] = `Bearer ${token}`

      toast.success("Bem vindo!")

      //Redirecionar para pagina atendimento
      Router.push('/ganhos')


    } catch (err) {
      console.log(err)
      toast.error("Erro ao acessar.")
    }
  }

  async function signUp({ nome,email, senha, codigoRecomendacao }: SignUpProps) {
    ////console.log('login => ' + username)
    ////console.log('senha => ' + password)

    try {
      const response = await api.post('/user/signup', {
        nome,
        email,
        senha,
        codigoRecomendacao
      })
      console.log(response)
      toast.success("Conta criada com sucesso.")

      Router.push('/')


    } catch (err) {
      toast.error("Erro ao cadastrar usuario.")
    }
  }

  return (
    <AuthContexts.Provider value={{ usuario, isAuthenticated, signIn, signOut, signUp, handleLink  }}>
      {children}
    </AuthContexts.Provider>
  )
}