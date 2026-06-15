import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '@/component/layout/AdminLayout';
import { canSSRAdmin } from '@/utils/canSSRAdmin';
import { getErrorMessage, setupAPIClient } from '@/services/api';
import { AxiosError } from 'axios';

type RequestRow = {
  id: number;
  reason: string;
  request_refund: boolean;
  status: string;
  created_at: string;
  usuario: { id: number; nome: string; email: string };
  refundPayment?: { amount: number | string };
};

export default function AdminCancelRequestsPage() {
  const [items, setItems] = useState<RequestRow[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function load() {
    const res = await setupAPIClient().get('/admin/cancel-requests');
    setItems(res.data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function process(id: number, approve: boolean) {
    setLoadingId(id);
    try {
      const path = approve
        ? `/admin/cancel-requests/${id}/approve`
        : `/admin/cancel-requests/${id}/reject`;
      await setupAPIClient().post(path, { notes: approve ? 'Aprovado pelo admin' : 'Rejeitado' });
      toast.success(approve ? 'Aprovado' : 'Rejeitado');
      await load();
    } catch (error) {
      toast.error(getErrorMessage((error as AxiosError).response?.data) || 'Erro');
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <AdminLayout title="Cancelamentos">
      <h1 className="text-2xl font-bold text-white">Solicitações de cancelamento</h1>
      <p className="mt-1 text-sm text-slate-400">
        Aprovar com reembolso dispara estorno no Mercado Pago (PIX).
      </p>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-slate-500">Nenhuma solicitação pendente.</p>
        ) : (
          items.map((r) => (
            <div key={r.id} className="rounded-xl border border-white/10 bg-cp-card-secondary/50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-white">
                    #{r.id} — {r.usuario.nome} ({r.usuario.email})
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{r.reason}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {r.request_refund ? 'Pediu reembolso' : 'Sem reembolso'} · {r.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={loadingId === r.id}
                    onClick={() => void process(r.id, true)}
                    className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium disabled:opacity-50"
                  >
                    Aprovar
                  </button>
                  <button
                    type="button"
                    disabled={loadingId === r.id}
                    onClick={() => void process(r.id, false)}
                    className="rounded-lg border border-white/20 px-3 py-1.5 text-xs disabled:opacity-50"
                  >
                    Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = canSSRAdmin(async () => ({ props: {} }));
