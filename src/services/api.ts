import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'


export function setupAPIClient(ctx = undefined){
  let cookies = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'https://backend-conta-plus-eeb2635e01ad.herokuapp.com',
    headers: {
      Authorization: `Bearer ${cookies['@nextauth.token']}`
    }
  })

  api.interceptors.response.use(response => {
    return response;
  }, (error: AxiosError) => {
    if(error.response.status === 401){
      // qualquer erro 401 (nao autorizado) devemos deslogar o usuario
      if(typeof window !== undefined){
        // Chamar a funçao para deslogar o usuario
      }else{
        return Promise.reject(new AuthTokenError())
      }
    }

    return Promise.reject(error);

  })

  return api;

}