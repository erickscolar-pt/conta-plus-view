import { FormEvent, useEffect, useState } from 'react';
import { setupAPIClient, getErrorMessage } from '@/services/api';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

type CancelStatus = {
  id: number;
  status: string;
  request_refund: boolean;
  reason: string;
  created_at: string;
};

export default function CancelAccountPanel() {
  const [reason, setReason] = useState('');
  const [requestRefund, setRequestRefund] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<CancelStatus | null>(null);

  useEffect(() => {
    void setupAPIClient()
      .get('/user/cancel-account/status')
      .then((res) => setStatus(res.data))
      .catch(() => undefined);
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (reason.trim().length < 10) {
      toast.warning('Descreva o motivo com pelo menos 10 caracteres.');
      return;
    }
    if (
      !window.confirm(
        requestRefund
          ? 'Confirma cancelamento e solicitação de reembolso? Analisaremos em até 5 dias úteis.'
          : 'Confirma o cancelamento da conta?',
      )
    ) {
      return;
    }
    setLoading(true);
    try {
      const res = await setupAPIClient().post('/user/cancel-account', {
        reason: reason.trim(),
        requestRefund,
      });
      toast.success(res.data.message || 'Solicitação enviada.');
      const updated = await setupAPIClient().get('/user/cancel-account/status');
      setStatus(updated.data);
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          'Não foi possível enviar a solicitação.',
      );
    } finally {
      setLoading(false);
    }
  }

  if (status && ['pending', 'processing'].includes(status.status)) {
    return (
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5">
        <h3 className="text-sm font-semibold text-amber-100">Cancelamento em análise</h3>
        <p className="mt-2 text-xs text-cp-muted">
          Solicitação #{status.id} —{' '}
          {status.request_refund ? 'com pedido de reembolso' : 'sem reembolso'}.
          {status.request_refund
            ? ' Se aprovado, o estorno será feito via Mercado Pago (mesmo meio do PIX).'
            : ''}
        </p>
      </div>
    );
  }

  if (status?.status === 'completed') {
    return (
      <div className="rounded-2xl border border-white/10 bg-cp-card-secondary p-5 text-sm text-cp-muted">
        Sua conta foi encerrada ou o cancelamento foi concluído.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-expense/25 bg-expense/5 p-5">
      <h3 className="text-sm font-semibold text-white">Cancelar conta</h3>
      <p className="mt-1 text-xs text-cp-muted">
        Ao cancelar, você perde acesso à plataforma. Se pagou o Premium recentemente, marque
        reembolso — analisamos conforme o CDC.
      </p>
      <label className="mt-4 flex items-start gap-2 text-sm text-cp-muted">
        <input
          type="checkbox"
          checked={requestRefund}
          onChange={(e) => setRequestRefund(e.target.checked)}
          className="mt-1"
        />
        Solicitar reembolso do último pagamento Premium (via Mercado Pago)
      </label>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        rows={3}
        placeholder="Motivo do cancelamento (mín. 10 caracteres)"
        className="mt-3 w-full rounded-xl border border-white/10 bg-cp-base px-3 py-2 text-sm text-white"
      />
      <button
        type="submit"
        disabled={loading}
        className="mt-3 rounded-xl border border-expense/40 px-4 py-2 text-sm font-medium text-expense hover:bg-expense/10 disabled:opacity-50"
      >
        {loading ? 'Enviando…' : 'Solicitar cancelamento'}
      </button>
    </form>
  );
}
