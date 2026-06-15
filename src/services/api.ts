import axios, { AxiosError } from 'axios'
import type { GetServerSidePropsContext } from 'next'
import { AuthTokenError } from './errors/AuthTokenError'
import Router from 'next/router'
import { parseRequestCookies } from '@/utils/cookies'

function getErrorMessage(data: unknown): string {
  if (data && typeof data === 'object') {
    if ('message' in data) {
      const msg = (data as { message: string | string[] }).message
      if (Array.isArray(msg)) return msg.join(' ')
      if (typeof msg === 'string') return msg
    }
    if ('error' in data && typeof (data as { error: unknown }).error === 'string') {
      return (data as { error: string }).error
    }
  }
  return 'Ocorreu um erro na requisição.'
}

function isPublicAuthRequest(url?: string) {
  if (!url) return false;
  const path = url.split('?')[0] ?? '';
  return (
    path.includes('auth/verify-email') ||
    path.includes('auth/resend-verification') ||
    path.includes('auth/forgot-password') ||
    path.includes('auth/reset-password')
  );
}

export function setupAPIClient(ctx?: GetServerSidePropsContext) {
  const cookies = parseRequestCookies(ctx)
  const isBrowser = typeof window !== 'undefined'

  const api = axios.create({
    baseURL: isBrowser ? '/api/backend' : process.env.NEXT_PUBLIC_API_URL,
    headers: isBrowser
      ? undefined
      : {
          Authorization: `Bearer ${cookies['@nextauth.token']}`,
        },
  })

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string | string[] }>) => {
      const status = error.response?.status
      if (status === 401 && !isPublicAuthRequest(error.config?.url)) {
        if (typeof window !== 'undefined') {
          axios.post('/api/auth/logout').catch(() => undefined)
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
