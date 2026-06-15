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
    const reg = await navigator.serviceWorker.register(SW_PATH, { scope: "/" });
    if (reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" });
    return reg;
  } catch {
    return null;
  }
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
