import { FormEvent, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { getErrorMessage, setupAPIClient } from '@/services/api';
import BrandLogo from '@/component/brand/BrandLogo';

export default function VerificarEmailPage() {
  const router = useRouter();
  const token = typeof router.query.token === 'string' ? router.query.token : '';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoAttempted = useRef(false);

  async function confirmToken(activeToken = token) {
    if (!activeToken) return;
    setLoading(true);
    setError(null);
    try {
      const api = setupAPIClient();
      await api.post('/auth/verify-email', { token: activeToken });
      setVerified(true);
      toast.success('E-mail confirmado!');
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? getErrorMessage(err.response?.data)
          : 'Link inválido ou expirado.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!router.isReady || !token || autoAttempted.current) return;
    autoAttempted.current = true;
    void confirmToken(token);
  }, [router.isReady, token]);

  async function resend(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.warning('Informe seu e-mail.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const api = setupAPIClient();
      await api.post('/auth/resend-verification', { email: email.trim() });
      toast.success('Novo e-mail de confirmação enviado. Verifique sua caixa de entrada.');
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? getErrorMessage(err.response?.data)
          : 'Não foi possível reenviar.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Confirmar e-mail | Conta+</title>
      </Head>
      <div className="flex min-h-screen items-start justify-center overflow-x-hidden bg-cp-base px-3 py-8 pb-28 sm:items-center sm:px-4 sm:py-10 sm:pb-10">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-cp-card p-5 sm:p-8">
          <BrandLogo size="default" className="mb-6" />
          <h1 className="text-lg font-bold text-white sm:text-xl">Confirme seu e-mail</h1>
          <p className="mt-2 text-sm text-cp-muted">
            Precisamos confirmar seu e-mail para ativar a conta e evitar cadastros falsos.
          </p>

          {verified ? (
            <div className="mt-6 space-y-4">
              <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
                E-mail confirmado com sucesso! Agora você pode entrar.
              </p>
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white"
              >
                Ir para login
              </Link>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {token ? (
                <p className="text-sm text-cp-muted">
                  {loading ? 'Confirmando seu e-mail…' : 'Processando link de confirmação…'}
                </p>
              ) : (
                <p className="text-sm text-cp-subtle">
                  Abra o link que enviamos para seu e-mail ou solicite um novo abaixo.
                </p>
              )}

              {error ? (
                <div className="space-y-3">
                  <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                    {error}
                  </p>
                  {token ? (
                    <button
                      type="button"
                      onClick={() => void confirmToken()}
                      disabled={loading}
                      className="w-full rounded-xl border border-white/10 py-2.5 text-sm text-cp-muted hover:text-white disabled:opacity-50"
                    >
                      Tentar confirmar novamente
                    </button>
                  ) : null}
                </div>
              ) : null}

              <form onSubmit={resend} className="border-t border-white/10 pt-4">
                <p className="text-xs text-cp-subtle">Não recebeu? Reenvie o link:</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-cp-base px-3 py-2.5 text-sm text-white"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 w-full rounded-xl border border-white/10 py-2.5 text-sm text-cp-muted hover:text-white disabled:opacity-50"
                >
                  Reenviar e-mail de confirmação
                </button>
              </form>

              <p className="text-center text-xs text-cp-subtle">
                <Link href="/login" className="text-primary hover:underline">
                  Voltar ao login
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
