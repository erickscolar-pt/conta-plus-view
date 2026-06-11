import { useEffect, useState } from 'react';
import AdminLayout from '@/component/layout/AdminLayout';
import { canSSRAdmin } from '@/utils/canSSRAdmin';
import { setupAPIClient } from '@/services/api';

type Dashboard = {
  totalUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  premiumUsers: number;
  activeSubscriptions: number;
  pendingCancelRequests: number;
  cancelRequestsPendingRefund: number;
  paymentsApproved: number;
  signupsThisMonth: number;
  conversionRate: number;
  planUsage: { code: string; name: string; activeSubscriptions: number }[];
};

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);

  useEffect(() => {
    void setupAPIClient()
      .get('/admin/dashboard')
      .then((res) => setData(res.data))
      .catch(() => undefined);
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <h1 className="text-2xl font-bold text-white">Visão geral</h1>
      <p className="mt-1 text-sm text-slate-400">Métricas da aplicação Conta+</p>

      {!data ? (
        <p className="mt-8 text-slate-500">Carregando…</p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Usuários ativos" value={data.totalUsers} />
            <Stat label="E-mails confirmados" value={data.verifiedUsers} />
            <Stat label="Premium ativos" value={data.premiumUsers} />
            <Stat label="Conversão Premium" value={`${data.conversionRate}%`} />
            <Stat label="Cadastros este mês" value={data.signupsThisMonth} />
            <Stat label="Assinaturas ativas" value={data.activeSubscriptions} />
            <Stat label="PIX aprovados" value={data.paymentsApproved} />
            <Stat label="Cancelamentos pendentes" value={data.pendingCancelRequests} />
          </div>

          <section className="mt-10">
            <h2 className="text-lg font-semibold text-white">Planos em uso</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {data.planUsage.map((p) => (
                <div
                  key={p.code}
                  className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3"
                >
                  <span className="text-sm text-slate-300">{p.name}</span>
                  <span className="font-mono text-sm text-emerald-400">
                    {p.activeSubscriptions}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {data.cancelRequestsPendingRefund > 0 ? (
            <p className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {data.cancelRequestsPendingRefund} solicitação(ões) aguardando análise de reembolso.
            </p>
          ) : null}
        </>
      )}
    </AdminLayout>
  );
}

export const getServerSideProps = canSSRAdmin(async () => ({ props: {} }));
