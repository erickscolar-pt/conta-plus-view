import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdLock } from 'react-icons/md';
import LoginLayout from '@/component/layout/LoginLayout';
import SignupField, { signupInputClass } from '@/component/signup/SignupField';
import { canSSRGuest } from '@/utils/canSSRGuest';
import { getErrorMessage, setupAPIClient } from '@/services/api';

const PASSWORD_HINT =
  'Mínimo 8 caracteres, com 1 maiúscula, 1 número e 1 caractere especial (!@#$%^&*).';

export default function RedefinirSenhaPage() {
  const router = useRouter();
  const token = typeof router.query.token === 'string' ? router.query.token : '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!token) {
      toast.error('Link inválido. Solicite uma nova redefinição de senha.');
      return;
    }
    if (password !== confirm) {
      toast.warning('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await setupAPIClient().post('/auth/reset-password', { token, password });
      setDone(true);
      toast.success('Senha redefinida com sucesso!');
    } catch (err) {
      const msg =
        err instanceof AxiosError
          ? getErrorMessage(err.response?.data)
          : 'Não foi possível redefinir a senha.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoginLayout
      title="Nova senha"
      description="Escolha uma senha segura para acessar sua conta Conta+."
    >
      {!token && router.isReady ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Link inválido ou incompleto. Solicite uma nova redefinição de senha.
          </p>
          <Link
            href="/esqueci-senha"
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white"
          >
            Solicitar novo link
          </Link>
        </div>
      ) : done ? (
        <div className="space-y-4">
          <p className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-brand-200">
            Sua senha foi atualizada. Agora você já pode entrar com a nova senha.
          </p>
          <Link
            href="/login"
            className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white"
          >
            Ir para login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <SignupField label="Nova senha" hint={PASSWORD_HINT} icon={<MdLock size={16} />}>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                className={`${signupInputClass} pr-12`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cp-muted transition hover:text-white"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </SignupField>

          <SignupField label="Confirmar nova senha" icon={<MdLock size={16} />}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className={signupInputClass}
            />
          </SignupField>

          <button
            type="submit"
            disabled={loading || !router.isReady}
            className="w-full rounded-xl bg-gradient-to-r from-dash to-brand-600 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? 'Salvando…' : 'Redefinir senha'}
          </button>

          <p className="text-center text-sm text-cp-subtle">
            <Link href="/esqueci-senha" className="font-medium text-primary hover:underline">
              Solicitar novo link
            </Link>
          </p>
        </form>
      )}
    </LoginLayout>
  );
}

export const getServerSideProps = canSSRGuest(async () => ({ props: {} }));
