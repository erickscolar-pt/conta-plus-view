import { setupAPIClient } from "@/services/api";
import { registerServiceWorker } from "@/utils/pwa";

const PUSH_ENDPOINT_STORAGE = "contaplus_web_push_endpoint_v1";

export const NOTIFICATIONS_CHANGED_EVENT = "contaplus:notifications-changed";

export function emitNotificationsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}

export function isWebPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function getWebPushPermission(): NotificationPermission | "unsupported" {
  if (!isWebPushSupported()) return "unsupported";
  return Notification.permission;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function getVapidPublicKey(): Promise<string | null> {
  const api = setupAPIClient();
  const { data } = await api.get<{ publicKey: string | null }>(
    "/notifications/push/vapid-public-key",
  );
  return data.publicKey ?? null;
}

async function unregisterStaleEndpoint(currentEndpoint: string): Promise<void> {
  const previous = localStorage.getItem(PUSH_ENDPOINT_STORAGE);
  if (!previous || previous === currentEndpoint) return;
  try {
    const api = setupAPIClient();
    await api.post("/notifications/push/unregister-web", { endpoint: previous });
  } catch {
    // endpoint antigo pode já ter sido removido no servidor
  }
}

export async function subscribeWebPush(): Promise<
  NotificationPermission | "unsupported" | "no-vapid"
> {
  if (!isWebPushSupported()) return "unsupported";

  const publicKey = await getVapidPublicKey();
  if (!publicKey) return "no-vapid";

  await registerServiceWorker();

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return permission;

  const registration = await navigator.serviceWorker.ready;
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  const json = subscription.toJSON();
  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    throw new Error("Inscrição push inválida");
  }

  await unregisterStaleEndpoint(json.endpoint);

  const api = setupAPIClient();
  await api.post("/notifications/push/register-web", {
    endpoint: json.endpoint,
    p256dh: json.keys.p256dh,
    auth: json.keys.auth,
  });

  localStorage.setItem(PUSH_ENDPOINT_STORAGE, json.endpoint);
  return "granted";
}

export async function unsubscribeWebPush(): Promise<void> {
  if (!isWebPushSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) return;

  const api = setupAPIClient();
  try {
    await api.post("/notifications/push/unregister-web", {
      endpoint: subscription.endpoint,
    });
  } catch {
    // ignore unregister failures
  }

  await subscription.unsubscribe();
  localStorage.removeItem(PUSH_ENDPOINT_STORAGE);
}

export async function syncWebPushSubscription(): Promise<void> {
  if (!isWebPushSupported() || Notification.permission !== "granted") return;
  try {
    await subscribeWebPush();
  } catch {
    // ignore background sync errors
  }
}

export async function dismissNotifications(ids: string[]): Promise<void> {
  const unique = Array.from(new Set(ids.filter((id) => id.trim().length > 0)));
  if (unique.length === 0) return;
  const api = setupAPIClient();
  await api.post("/notifications/dismiss", { ids: unique });
}
