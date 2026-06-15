import { useEffect, useState } from 'react';
import AdminLayout from '@/component/layout/AdminLayout';
import { canSSRAdmin } from '@/utils/canSSRAdmin';
import { setupAPIClient } from '@/services/api';

type AuditRow = {
  id: number;
  action: string;
  ip_address: string | null;
  created_at: string;
  actor?: { email?: string; nome?: string } | null;
  metadata?: Record<string, unknown>;
};

export default function AdminAuditPage() {
  const [items, setItems] = useState<AuditRow[]>([]);

  useEffect(() => {
    void setupAPIClient()
      .get('/admin/audit', { params: { limit: 100 } })
      .then((res) => setItems(res.data))
      .catch(() => undefined);
  }, []);

  return (
    <AdminLayout title="Auditoria">
      <h1 className="text-2xl font-bold text-white">Auditoria de segurança</h1>
      <p className="mt-1 text-sm text-slate-400">
        Cadastros, logins, verificações de e-mail e cancelamentos.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-white/10 bg-cp-card-secondary/80 text-slate-400">
            <tr>
              <th className="p-2">Data</th>
              <th className="p-2">Ação</th>
              <th className="p-2">Usuário</th>
              <th className="p-2">IP</th>
            </tr>
          </thead>
          <tbody>
            {items.map((row) => (
              <tr key={row.id} className="border-b border-white/5 text-slate-300">
                <td className="p-2 whitespace-nowrap">
                  {new Date(row.created_at).toLocaleString('pt-BR')}
                </td>
                <td className="p-2 font-mono">{row.action}</td>
                <td className="p-2">{row.actor?.email ?? '—'}</td>
                <td className="p-2 font-mono text-slate-500">{row.ip_address ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = canSSRAdmin(async () => ({ props: {} }));
