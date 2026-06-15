import { useCallback, useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { InstallAppContent, isBeforeInstallPromptEvent } from "@/component/pwa/InstallAppContent";
import {
  getPwaDismissKey,
  isMobileBrowser,
  isStandalonePwa,
  type BeforeInstallPromptEvent,
} from "@/utils/pwa";

export default function InstallAppPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalonePwa()) return;
    if (localStorage.getItem(getPwaDismissKey()) === "1") return;
    if (!isMobileBrowser()) return;

    const showTimer = window.setTimeout(() => setVisible(true), 2000);

    const onBip = (e: Event) => {
      e.preventDefault();
      if (isBeforeInstallPromptEvent(e)) {
        setDeferred(e);
        setVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", onBip);
    return () => {
      window.clearTimeout(showTimer);
      window.removeEventListener("beforeinstallprompt", onBip);
    };
  }, []);

  const dismiss = useCallback(() => {
    localStorage.setItem(getPwaDismissKey(), "1");
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    setDeferred(null);
    if (choice.outcome === "accepted") {
      localStorage.setItem(getPwaDismissKey(), "1");
      setVisible(false);
    }
  }, [deferred]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[75] px-3 lg:bottom-4 lg:left-auto lg:right-4 lg:max-w-md lg:px-0">
      <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-cp-card to-cp-card p-4 shadow-card ring-1 ring-primary/20 backdrop-blur-xl">
        <button
          type="button"
          onClick={dismiss}
          className="absolute right-2 top-2 rounded-lg p-1.5 text-cp-muted hover:bg-white/[0.06] hover:text-white"
          aria-label="Fechar"
        >
          <MdClose size={18} />
        </button>
        <InstallAppContent
          variant="banner"
          deferred={deferred}
          onInstallClick={() => void install()}
          onDismiss={dismiss}
        />
      </div>
    </div>
  );
}
