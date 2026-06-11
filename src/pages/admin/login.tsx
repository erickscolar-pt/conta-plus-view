import { FormEvent, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/services/api';
import { AxiosError } from 'axios';
import BrandLogo from '@/component/brand/BrandLogo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/signin', { username, password });
      if (!response.data.role) {
        toast.error('Acesso negado: conta sem perfil administrador.');
        await axios.post('/api/auth/logout');
        return;
      }
      toast.success('Bem-vindo, admin.');
      void router.push('/admin');
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? getErrorMessage(err.response?.data)
          : 'Credenciais inválidas';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Admin | Conta+</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-8"
        >
          <BrandLogo size="default" className="mb-6" />
          <h1 className="text-lg font-bold text-white">Painel administrativo</h1>
          <p className="mt-1 text-xs text-slate-400">Acesso restrito a administradores</p>
          <input
            className="mt-6 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white"
            placeholder="E-mail"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            type="password"
            className="mt-3 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-white"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-amber-600 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
          <Link href="/" className="mt-4 block text-center text-xs text-slate-500 hover:text-slate-300">
            Voltar ao site
          </Link>
        </form>
      </div>
    </>
  );
}
