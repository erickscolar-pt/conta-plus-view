import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { setupAPIClient } from '@/services/api';
import BrandLogo from '@/component/brand/BrandLogo';

export default function VerificarEmailPage() {
  const router = useRouter();
  const token = typeof router.query.token === 'string' ? router.query.token : '';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmToken() {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const api = setupAPIClient();
      await api.post('/auth/verify-email', { token });
      setVerified(true);
      toast.success('E-mail confirmado!');
    } catch {
      setError('Link inválido ou expirado. Solicite um novo e-mail abaixo.');
    } finally {
      setLoading(false);
    }
  }

  async function resend() {
    if (!email.trim()) {
      toast.warning('Informe seu e-mail.');
      return;
    }
    setLoading(true);
    try {
      const api = setupAPIClient();
      await api.post('/auth/resend-verification', { email: email.trim() });
      toast.success('Se o e-mail existir, enviamos um novo link.');
    } catch {
      toast.error('Não foi possível reenviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <title>Confirmar e-mail | Conta+</title>
      </Head>
      <div className="flex min-h-screen items-center justify-center bg-cp-base px-4">
        <div className="w-full max-w-md rounded-2xl border border-white/10 bg-cp-card p-8">
          <BrandLogo size="default" className="mb-6" />
          <h1 className="text-xl font-bold text-white">Confirme seu e-mail</h1>
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
                <button
                  type="button"
                  onClick={() => void confirmToken()}
                  disabled={loading}
                  className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? 'Confirmando…' : 'Confirmar meu e-mail'}
                </button>
              ) : (
                <p className="text-sm text-cp-subtle">
                  Abra o link que enviamos para seu e-mail.
                </p>
              )}
              {error ? <p className="text-sm text-amber-300">{error}</p> : null}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-cp-subtle">Não recebeu? Reenvie o link:</p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-cp-base px-3 py-2.5 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => void resend()}
                  disabled={loading}
                  className="mt-3 w-full rounded-xl border border-white/10 py-2.5 text-sm text-cp-muted hover:text-white"
                >
                  Reenviar e-mail de confirmação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
