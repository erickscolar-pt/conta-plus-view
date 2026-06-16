import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdNotificationsNone, MdClose, MdNotificationsActive } from "react-icons/md";
import { setupAPIClient } from "@/services/api";
import { formatCurrency } from "@/helper";
import {
  getWebPushPermission,
  isWebPushSupported,
  subscribeWebPush,
  unsubscribeWebPush,
} from "@/utils/web-push";
import { toast } from "react-toastify";

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
  const [pushPermission, setPushPermission] = useState<
    NotificationPermission | "unsupported"
  >("default");
  const [pushBusy, setPushBusy] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setDismissed(loadDismissed());
    setPushPermission(getWebPushPermission());
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

  const enablePush = async () => {
    setPushBusy(true);
    try {
      const result = await subscribeWebPush();
      setPushPermission(getWebPushPermission());
      if (result === "granted") {
        toast.success("Alertas no celular ativados!");
      } else if (result === "denied") {
        toast.info("Permissão negada. Ative nas configurações do navegador.");
      } else if (result === "no-vapid") {
        toast.warn("Push ainda não configurado no servidor.");
      } else if (result === "unsupported") {
        toast.info("Seu navegador não suporta notificações push.");
      }
    } catch {
      toast.error("Não foi possível ativar os alertas push.");
    } finally {
      setPushBusy(false);
    }
  };

  const disablePush = async () => {
    setPushBusy(true);
    try {
      await unsubscribeWebPush();
      setPushPermission(getWebPushPermission());
      toast.success("Alertas push desativados neste dispositivo.");
    } catch {
      toast.error("Não foi possível desativar os alertas push.");
    } finally {
      setPushBusy(false);
    }
  };

  const severityBorder = (s: NotificationItem["severity"]) => {
    if (s === "high") return "border-l-red-500";
    if (s === "medium") return "border-l-amber-500";
    return "border-l-brand-500/80";
  };

  return (
    <div className="relative z-[45]">
      <button
        ref={btnRef}
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) fetchNotifications();
        }}
        className="relative rounded-xl p-2 text-white ring-1 ring-white/[0.12] transition hover:bg-white/[0.08] hover:ring-white/20"
        title="Notificações"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <MdNotificationsNone className="h-6 w-6 text-white" aria-hidden />
        {badge > 0 ? (
          <span className="absolute right-1 top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {badge > 9 ? "9+" : badge}
          </span>
        ) : null}
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label="Fechar notificações"
            className="fixed inset-x-0 bottom-0 top-16 z-[48] bg-cp-base/80 sm:hidden"
            onClick={() => setOpen(false)}
          />
          <div
            ref={panelRef}
            className="fixed left-3 right-3 top-[4.25rem] z-[50] max-h-[min(78vh,560px)] overflow-hidden rounded-2xl border border-white/20 bg-cp-card shadow-2xl sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-none sm:w-[min(100vw-2rem,22rem)]"
          >
          <div className="flex items-center justify-between border-b border-white/15 bg-cp-card px-4 py-3">
            <span className="text-sm font-semibold text-white">
              Notificações
            </span>
            {visible.length > 0 ? (
              <button
                type="button"
                onClick={dismissAll}
                className="text-xs font-medium text-brand-400 hover:text-brand-300"
              >
                Limpar visíveis
              </button>
            ) : null}
          </div>

          <div className="max-h-[min(70vh,420px)] overflow-y-auto">
            {loading ? (
              <p className="px-4 py-8 text-center text-sm text-cp-muted">
                Carregando…
              </p>
            ) : visible.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-cp-muted">
                Nenhuma notificação no momento.
              </p>
            ) : (
              <ul className="divide-y divide-white/10 py-1">
                {visible.map((n) => (
                  <li
                    key={n.id}
                    className={`border-l-4 ${severityBorder(n.severity)} bg-cp-card/95 px-3 py-3`}
                  >
                    <div className="flex gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">
                          {n.title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-cp-muted">
                          {n.message}
                        </p>
                        {n.amount != null && n.amount > 0 ? (
                          <p className="mt-1 text-xs font-semibold tabular-nums text-white/90">
                            {formatCurrency(n.amount)}
                          </p>
                        ) : null}
                        {n.href ? (
                          <Link
                            href={n.href}
                            className="mt-2 inline-block text-xs font-semibold text-brand-400 hover:text-brand-300"
                            onClick={() => setOpen(false)}
                          >
                            Abrir →
                          </Link>
                        ) : null}
                      </div>
                      <button
                        type="button"
                        className="shrink-0 rounded-lg p-1 text-cp-muted hover:bg-white/[0.08] hover:text-white"
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

          <div className="border-t border-white/[0.08] bg-cp-card px-4 py-3">
            {isWebPushSupported() ? (
              pushPermission === "granted" ? (
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-xs text-emerald-300">
                    <MdNotificationsActive size={16} />
                    Alertas na tela do celular ativos
                  </p>
                  <button
                    type="button"
                    disabled={pushBusy}
                    onClick={() => void disablePush()}
                    className="text-xs font-medium text-cp-muted hover:text-white disabled:opacity-60"
                  >
                    Desativar neste dispositivo
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs leading-relaxed text-cp-muted">
                    Receba contas em atraso, convites e avisos na{" "}
                    <strong className="text-white/90">tela do telefone</strong> — no
                    navegador ou no atalho instalado (PWA).
                  </p>
                  <button
                    type="button"
                    disabled={pushBusy}
                    onClick={() => void enablePush()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-3 py-2.5 text-xs font-semibold text-white shadow-glow disabled:opacity-70"
                  >
                    <MdNotificationsActive size={16} />
                    {pushBusy ? "Ativando…" : "Ativar alertas no celular"}
                  </button>
                </div>
              )
            ) : (
              <p className="text-xs text-cp-muted">
                Notificações push não são suportadas neste navegador.
              </p>
            )}
          </div>

          <p className="border-t border-white/[0.08] bg-cp-card px-4 py-2.5 text-[11px] leading-snug text-cp-muted">
            Dívidas, convites aceitos (quem te vinculou e quem você vinculou) e dica se
            ainda não há parceiros.
          </p>
        </div>
        </>
      ) : null}
    </div>
  );
}
