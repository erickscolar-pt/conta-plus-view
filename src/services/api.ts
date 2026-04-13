import axios, { AxiosError } from 'axios'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'
import Router from 'next/router'
import { destroyCookie } from 'nookies'

function getErrorMessage(data: unknown): string {
  if (data && typeof data === 'object' && 'message' in data) {
    const msg = (data as { message: string | string[] }).message
    if (Array.isArray(msg)) return msg.join(' ')
    if (typeof msg === 'string') return msg
  }
  return 'Ocorreu um erro na requisição.'
}

export function setupAPIClient(ctx = undefined) {
  const cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${cookies['@nextauth.token']}`,
    },
  })

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string | string[] }>) => {
      const status = error.response?.status
      if (status === 401) {
        if (typeof window !== 'undefined') {
          destroyCookie(undefined, '@nextauth.token')
          Router.push('/login')
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }

      return Promise.reject(error)
    },
  )

  return api
}

export { getErrorMessage }
