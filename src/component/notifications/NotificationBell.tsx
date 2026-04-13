import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdNotificationsNone, MdClose } from "react-icons/md";
import { setupAPIClient } from "@/services/api";
import { formatCurrency } from "@/helper";

const STORAGE_KEY = "contaplus_dismissed_notifications_v1";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  href?: string;
  severity: "high" | "medium" | "low";
  date?: string;
  amount?: number;
};

function loadDismissed(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as string[];
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveDismissed(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDismissed(loadDismissed());
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const api = setupAPIClient();
      const { data } = await api.get<{ items: NotificationItem[] }>(
        "/notifications",
      );
      setItems(data.items ?? []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  /** Atualiza após aceitar convite (/codigo) ou voltar de outra aba */
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") {
        void fetchNotifications();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [fetchNotifications]);

  useEffect(() => {
    const onRoute = () => {
      void fetchNotifications();
    };
    router.events.on("routeChangeComplete", onRoute);
    return () => router.events.off("routeChangeComplete", onRoute);
  }, [router.events, fetchNotifications]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(t) &&
        btnRef.current &&
        !btnRef.current.contains(t)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const visible = useMemo(
    () => items.filter((i) => !dismissed.has(i.id)),
    [items, dismissed],
  );

  const dismissOne = (id: string) => {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    saveDismissed(next);
  };

  const dismissAll = () => {
    const next = new Set(dismissed);
    for (const i of visible) {
      next.add(i.id);
    }
    setDismissed(next);
    saveDismissed(next);
  };

  const badge = visible.length;

  const severityBorder = (s: NotificationItem["severity"]) => {
    if (s === "high") return "border-l-red-500";
    if (s === "medium") return "border-l-amber-500";
    return "border-l-emerald-500/80";
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) fetchNotifications();
        }}
        className="relative rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-slate-100"
        title="Notificações"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <MdNotificationsNone className="h-6 w-6" aria-hidden />
        {badge > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {badge > 9 ? "9+" : badge}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="absolute right-0 top-full z-50 mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-white/10 bg-slate-900/98 shadow-2xl ring-1 ring-white/5 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <span className="text-sm font-semibold text-slate-100">
              Notificações
            </span>
            {visible.length > 0 ? (
              <button
                type="button"
                onClick={dismissAll}
                className="text-xs font-medium text-emerald-400 hover:text-emerald-300"
              >
                Limpar visíveis
              </button>
            ) : null}
          </div>

          <div className="max-h-[min(70vh,420px)] overflow-y-auto">
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                Carregando…
              </p>
            ) : visible.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-500">
                Nenhuma notificação no momento.
              </p>
            ) : (
              <ul className="divide-y divide-white/5 py-1">
                {visible.map((n) => (
                  <li
                    key={n.id}
                    className={`border-l-4 ${severityBorder(n.severity)} px-3 py-3`}
                  >
                    <div className="flex gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-100">
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                          {n.message}
                        </p>
                        {n.amount != null && n.amount > 0 ? (
                          <p className="mt-1 text-xs font-semibold tabular-nums text-slate-300">
                            {formatCurrency(n.amount)}
                          </p>
                        ) : null}
                        {n.href ? (
                          <Link
                            href={n.href}
                            className="mt-2 inline-block text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                            onClick={() => setOpen(false)}
                          >
                            Abrir →
                          </Link>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="shrink-0 rounded-lg p-1 text-slate-500 hover:bg-white/10 hover:text-slate-300"
                        title="Dispensar"
                        onClick={() => dismissOne(n.id)}
                      >
                        <MdClose className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="border-t border-white/10 px-4 py-2 text-[11px] text-slate-500">
            Dívidas, convites aceitos (quem te vinculou e quem você vinculou) e dica se
            ainda não há parceiros.
          </p>
        </div>
      ) : null}
    </div>
  );
}
