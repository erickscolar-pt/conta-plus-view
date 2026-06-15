const SW_PATH = "/sw.js";
const DISMISS_KEY = "contaplus_pwa_install_dismissed_v2";

export const ANDROID_APK_URL =
  process.env.NEXT_PUBLIC_ANDROID_APK_URL?.trim() ||
  "https://expo.dev/artifacts/eas/t225CN3XdC9FRWbhFXrdjLE3kEaRyZqc5dI0wqhKqbc.apk";

export function getPwaDismissKey() {
  return DISMISS_KEY;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;

  try {
    return await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
  } catch {
    return null;
  }
}

export async function clearAppCaches(): Promise<void> {
  if (typeof window === "undefined" || !("caches" in window)) return;
  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
}

export async function applyAppUpdate(): Promise<void> {
  if (typeof window === "undefined") return;

  await clearAppCaches();

  if (!("serviceWorker" in navigator)) {
    window.location.reload();
    return;
  }

  const reg = await navigator.serviceWorker.getRegistration();
  const waiting = reg?.waiting;

  if (waiting) {
    await new Promise<void>((resolve) => {
      const onControllerChange = () => {
        navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
        resolve();
      };
      navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
      waiting.postMessage({ type: "SKIP_WAITING" });
    });
  } else {
    await reg?.update();
  }

  window.location.reload();
}

function trackInstallingWorker(
  worker: ServiceWorker,
  onUpdateAvailable: () => void,
): void {
  worker.addEventListener("statechange", () => {
    if (worker.state === "installed" && navigator.serviceWorker.controller) {
      onUpdateAvailable();
    }
  });
}

export function subscribeToAppUpdates(onUpdateAvailable: () => void): () => void {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return () => {};
  }

  let registration: ServiceWorkerRegistration | null = null;

  void registerServiceWorker().then((reg) => {
    if (!reg) return;
    registration = reg;

    if (reg.waiting && navigator.serviceWorker.controller) {
      onUpdateAvailable();
    }

    reg.addEventListener("updatefound", () => {
      const worker = reg.installing;
      if (worker) trackInstallingWorker(worker, onUpdateAvailable);
    });
  });

  const interval = window.setInterval(() => {
    void registration?.update();
  }, 60 * 60 * 1000);

  return () => window.clearInterval(interval);
}

export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function isMobileBrowser(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (typeof window === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

export function isIosSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPhone|iPad|iPod/i.test(ua) && /Safari/i.test(ua) && !/CriOS|FxiOS|EdgiOS/i.test(ua);
}

export function isIos(): boolean {
  if (typeof window === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function isBeforeInstallPromptEvent(e: Event): e is BeforeInstallPromptEvent {
  return "prompt" in e && typeof (e as BeforeInstallPromptEvent).prompt === "function";
}
