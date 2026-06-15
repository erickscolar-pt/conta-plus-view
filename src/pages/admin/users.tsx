import { useEffect, useState } from 'react';
import AdminLayout from '@/component/layout/AdminLayout';
import { canSSRAdmin } from '@/utils/canSSRAdmin';
import { setupAPIClient } from '@/services/api';

type UserRow = {
  id: number;
  nome: string;
  email: string;
  username: string;
  emailVerified: boolean;
  plan: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);

  async function load(q = search) {
    const res = await setupAPIClient().get('/admin/users', {
      params: { search: q || undefined, limit: 50 },
    });
    setItems(res.data.items);
    setTotal(res.data.total);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <AdminLayout title="Usuários">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Usuários</h1>
          <p className="text-sm text-slate-400">{total} cadastrados</p>
        </div>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar e-mail ou nome"
            className="rounded-lg border border-white/10 bg-cp-card px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-cp-card/80 text-slate-400">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Nome</th>
              <th className="p-3">E-mail</th>
              <th className="p-3">Plano</th>
              <th className="p-3">Verificado</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-b border-white/5">
                <td className="p-3 font-mono text-slate-500">{u.id}</td>
                <td className="p-3 text-white">{u.nome}</td>
                <td className="p-3 text-slate-300">{u.email}</td>
                <td className="p-3">{u.plan}</td>
                <td className="p-3">{u.emailVerified ? 'Sim' : 'Não'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = canSSRAdmin(async () => ({ props: {} }));
