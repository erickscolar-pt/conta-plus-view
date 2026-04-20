import Head from "next/head";
import { FormEvent, useEffect, useMemo, useState } from "react";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { formatCurrency } from "@/helper";
import { ITipoDivida, MarketSession, Usuario } from "@/model/type";

type Props = {
  usuario: Usuario;
  tipodivida: ITipoDivida[];
};

export default function MercadoPage({ usuario, tipodivida }: Props) {
  const api = setupAPIClient();
  const [sessions, setSessions] = useState<MarketSession[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [newSessionName, setNewSessionName] = useState("");
  const [itemNome, setItemNome] = useState("");
  const [itemBarcode, setItemBarcode] = useState("");
  const [itemQuantidade, setItemQuantidade] = useState("1");
  const [itemPreco, setItemPreco] = useState("");
  const [tipoDividaId, setTipoDividaId] = useState<string>("");

  const active = useMemo(
    () => sessions.find((s) => s.id === activeId) ?? null,
    [sessions, activeId],
  );

  async function loadSessions() {
    setLoading(true);
    try {
      const { data } = await api.get<MarketSession[]>("/market/sessions");
      setSessions(data);
      if (data.length > 0 && !activeId) setActiveId(data[0].id);
      if (data.length === 0) setActiveId(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createSession(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const { data } = await api.post<MarketSession>("/market/sessions", {
        nome: newSessionName.trim() || undefined,
      });
      setSessions((prev) => [data, ...prev]);
      setActiveId(data.id);
      setNewSessionName("");
    } catch {
      setMessage("Não foi possível criar a lista.");
    } finally {
      setSaving(false);
    }
  }

  async function addItem(e: FormEvent) {
    e.preventDefault();
    if (!active) return;
    setSaving(true);
    setMessage(null);
    try {
      const { data } = await api.post<MarketSession>(
        `/market/sessions/${active.id}/items`,
        {
          nome: itemNome,
          barcode: itemBarcode || undefined,
          quantidade: Number(itemQuantidade || "1"),
          preco_unitario: Number(itemPreco || "0"),
        },
      );
      setSessions((prev) => prev.map((s) => (s.id === data.id ? data : s)));
      setItemNome("");
      setItemBarcode("");
      setItemQuantidade("1");
      setItemPreco("");
    } catch {
      setMessage("Não foi possível adicionar o item.");
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(itemId: number) {
    if (!active) return;
    setSaving(true);
    try {
      const { data } = await api.delete<MarketSession>(
        `/market/sessions/${active.id}/items/${itemId}`,
      );
      setSessions((prev) => prev.map((s) => (s.id === data.id ? data : s)));
    } finally {
      setSaving(false);
    }
  }

  async function finalize() {
    if (!active) return;
    setSaving(true);
    setMessage(null);
    try {
      await api.post(`/market/sessions/${active.id}/finalize`, {
        tipoDividaId: tipoDividaId ? Number(tipoDividaId) : undefined,
      });
      await loadSessions();
      setMessage("Compra finalizada e registrada em Saídas.");
    } catch {
      setMessage("Não foi possível finalizar a compra.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Head>
        <title>Mercado | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="px-3 py-4 sm:px-6 md:px-10 md:py-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                Calculadora de mercado
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Monte sua lista de compras e finalize para registrar uma saída.
              </p>
            </div>

            <form
              onSubmit={createSession}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <label className="mb-2 block text-sm text-slate-300">Nova lista</label>
              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  className="flex-1 rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm"
                  placeholder="Ex.: Compra da semana"
                  value={newSessionName}
                  onChange={(e) => setNewSessionName(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-emerald-500/25 px-4 py-2 text-sm font-semibold text-emerald-100 disabled:opacity-60"
                >
                  Criar lista
                </button>
              </div>
            </form>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">
                  Listas
                </h2>
                {loading ? (
                  <p className="text-sm text-slate-400">Carregando...</p>
                ) : sessions.length === 0 ? (
                  <p className="text-sm text-slate-400">Sem listas ainda.</p>
                ) : (
                  <div className="space-y-2">
                    {sessions.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveId(s.id)}
                        className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                          s.id === activeId
                            ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-100"
                            : "border-white/10 bg-slate-900/70 text-slate-200"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{s.nome}</span>
                          <span className="text-xs uppercase">{s.status}</span>
                        </div>
                        <p className="mt-1 text-xs text-slate-400">
                          Total: {formatCurrency(s.total)}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </section>

              <section className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                {!active ? (
                  <p className="text-sm text-slate-400">
                    Selecione uma lista para adicionar produtos.
                  </p>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-slate-100">{active.nome}</h2>
                      <span className="text-sm text-slate-300">
                        Total: {formatCurrency(active.total)}
                      </span>
                    </div>

                    {active.status === "open" && (
                      <form onSubmit={addItem} className="grid grid-cols-1 gap-3 md:grid-cols-4">
                        <input
                          className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm md:col-span-2"
                          placeholder="Nome do produto"
                          value={itemNome}
                          onChange={(e) => setItemNome(e.target.value)}
                          required
                        />
                        <input
                          className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm"
                          placeholder="Código de barras"
                          value={itemBarcode}
                          onChange={(e) => setItemBarcode(e.target.value)}
                        />
                        <input
                          className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm"
                          placeholder="Qtd"
                          value={itemQuantidade}
                          onChange={(e) => setItemQuantidade(e.target.value)}
                        />
                        <input
                          className="rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm"
                          placeholder="Preço unit."
                          value={itemPreco}
                          onChange={(e) => setItemPreco(e.target.value)}
                          required
                        />
                        <button
                          type="submit"
                          disabled={saving}
                          className="rounded-xl bg-cyan-500/25 px-4 py-2 text-sm font-semibold text-cyan-100 md:col-span-4"
                        >
                          Adicionar item
                        </button>
                      </form>
                    )}

                    <div className="space-y-2">
                      {active.items.length === 0 ? (
                        <p className="text-sm text-slate-400">Nenhum item ainda.</p>
                      ) : (
                        active.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2"
                          >
                            <div>
                              <p className="text-sm font-medium text-slate-100">{item.nome}</p>
                              <p className="text-xs text-slate-400">
                                {item.quantidade} x {formatCurrency(item.preco_unitario)}{" "}
                                {item.barcode ? `• ${item.barcode}` : ""}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm text-slate-200">
                                {formatCurrency(item.subtotal)}
                              </span>
                              {active.status === "open" && (
                                <button
                                  type="button"
                                  onClick={() => void removeItem(item.id)}
                                  className="text-xs text-red-300 hover:text-red-200"
                                >
                                  Remover
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {active.status === "open" && (
                      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-400">
                          Categoria de saída ao finalizar (opcional)
                        </label>
                        <select
                          className="w-full rounded-xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm"
                          value={tipoDividaId}
                          onChange={(e) => setTipoDividaId(e.target.value)}
                        >
                          <option value="">Automático: Compras de mercado</option>
                          {tipodivida.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                              {tipo.nome}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => void finalize()}
                          disabled={saving || active.items.length === 0}
                          className="mt-3 rounded-xl bg-emerald-500/25 px-4 py-2 text-sm font-semibold text-emerald-100 disabled:opacity-60"
                        >
                          Finalizar compra e registrar saída
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>
            </div>

            {message && <p className="text-sm text-slate-300">{message}</p>}
          </div>
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const [user, tipodivida] = await Promise.all([
    apiClient.get("/user/get"),
    apiClient.get("/dividas/types"),
  ]);
  return {
    props: {
      usuario: user.data,
      tipodivida: tipodivida.data,
    },
  };
});
