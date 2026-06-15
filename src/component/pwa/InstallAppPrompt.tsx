import { useCallback, useEffect, useState } from "react";
import { MdClose, MdInstallMobile } from "react-icons/md";
import {
  isIosSafari,
  isMobileBrowser,
  isStandalonePwa,
} from "@/utils/pwa";

const DISMISS_KEY = "contaplus_pwa_install_dismissed_v1";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export default function InstallAppPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalonePwa()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;
    if (!isMobileBrowser()) return;

    if (isIosSafari()) {
      setIosHint(true);
      setVisible(true);
      return;
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBip);
    return () => window.removeEventListener("beforeinstallprompt", onBip);
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  }, [deferred]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[75] px-3 lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-sm lg:px-0">
      <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-cp-card to-cp-card p-4 shadow-card ring-1 ring-primary/20 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <MdInstallMobile size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white">Instalar Conta+ no celular</p>
            {iosHint ? (
              <p className="mt-1 text-xs leading-relaxed text-cp-muted">
                Toque em <strong className="text-white/90">Compartilhar</strong> e depois em{" "}
                <strong className="text-white/90">Adicionar à Tela de Início</strong> para usar
                como app, sem loja.
              </p>
            ) : (
              <p className="mt-1 text-xs leading-relaxed text-cp-muted">
                Adicione o site à tela inicial — mesma experiência de app, atualizada pela web.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 rounded-lg p-1 text-cp-muted hover:bg-white/[0.06] hover:text-white"
            aria-label="Fechar"
          >
            <MdClose size={18} />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          {!iosHint && deferred ? (
            <button
              type="button"
              onClick={() => void install()}
              className="flex-1 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-3 py-2.5 text-sm font-semibold text-white shadow-glow"
            >
              Instalar app
            </button>
          ) : null}
          <button
            type="button"
            onClick={dismiss}
            className="rounded-xl border border-white/[0.08] px-3 py-2.5 text-sm font-medium text-cp-muted hover:text-white"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
}
