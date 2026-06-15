import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { MdEmail } from 'react-icons/md';
import LoginLayout from '@/component/layout/LoginLayout';
import SignupField, { signupInputClass } from '@/component/signup/SignupField';
import { canSSRGuest } from '@/utils/canSSRGuest';
import { getErrorMessage, setupAPIClient } from '@/services/api';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.warning('Informe seu e-mail.');
      return;
    }
    setLoading(true);
    try {
      await setupAPIClient().post('/auth/forgot-password', { email: email.trim() });
      setSent(true);
      toast.success('Se o e-mail existir, enviamos instruções para redefinir a senha.');
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? getErrorMessage(err.response?.data)
          : 'Não foi possível enviar o e-mail.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginLayout
      title="Esqueci minha senha"
      description="Informe o e-mail da sua conta. Enviaremos um link para criar uma nova senha."
    >
      {sent ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-brand-200">
            Se existir uma conta com <strong className="text-white">{email}</strong>, você receberá
            um e-mail com o link para redefinir a senha. Verifique também a pasta de spam.
          </p>
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white"
          >
            Voltar ao login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <SignupField label="E-mail da conta" icon={<MdEmail size={16} />}>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className={signupInputClass}
            />
          </SignupField>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-dash to-brand-600 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Enviando…' : 'Enviar link de redefinição'}
          </button>

          <p className="text-center text-sm text-cp-subtle">
            <Link href="/login" className="font-medium text-primary hover:underline">
              ← Voltar ao login
            </Link>
          </p>
        </form>
      )}
    </LoginLayout>
  );
}

export const getServerSideProps = canSSRGuest(async () => ({ props: {} }));
