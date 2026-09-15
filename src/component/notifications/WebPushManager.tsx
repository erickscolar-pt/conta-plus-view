import { useEffect } from "react";
import {
  dismissNotifications,
  emitNotificationsChanged,
  syncWebPushSubscription,
} from "@/utils/web-push";
import { isStandalonePwa } from "@/utils/pwa";

type PushWorkerMessage = {
  type?: string;
  notificationId?: string;
};

/**
 * Mantém a inscrição Web Push no navegador e no app instalado (PWA).
 * O service worker recebe os avisos com o app fechado.
 */
export default function WebPushManager() {
  useEffect(() => {
    const sync = () => {
      void syncWebPushSubscription();
    };

    sync();

    const onVisibility = () => {
      if (document.visibilityState === "visible") sync();
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("appinstalled", sync);

    const standaloneQuery = window.matchMedia("(display-mode: standalone)");
    const onDisplayMode = () => {
      if (isStandalonePwa()) sync();
    };
    if (typeof standaloneQuery.addEventListener === "function") {
      standaloneQuery.addEventListener("change", onDisplayMode);
    }

    const onWorkerMessage = (event: MessageEvent<PushWorkerMessage>) => {
      if (event.data?.type === "NOTIFICATION_CLICKED" && event.data.notificationId) {
        void dismissNotifications([event.data.notificationId])
          .catch(() => undefined)
          .finally(() => emitNotificationsChanged());
        return;
      }
      if (event.data?.type === "PUSH_RECEIVED") {
        emitNotificationsChanged();
      }
    };
    navigator.serviceWorker?.addEventListener("message", onWorkerMessage);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("appinstalled", sync);
      if (typeof standaloneQuery.removeEventListener === "function") {
        standaloneQuery.removeEventListener("change", onDisplayMode);
      }
      navigator.serviceWorker?.removeEventListener("message", onWorkerMessage);
    };
  }, []);

  return null;
}
