import { setupAPIClient } from "./api";

const STORAGE_PREFIX = "contaplus_onboarding_v1_";

export function onboardingStorageKey(userId: number) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function readLocalOnboardingComplete(userId: number): boolean {
  try {
    return localStorage.getItem(onboardingStorageKey(userId)) === "true";
  } catch {
    return false;
  }
}

export function writeLocalOnboardingComplete(userId: number) {
  try {
    localStorage.setItem(onboardingStorageKey(userId), "true");
  } catch {
    // ignore storage failures
  }
}

export async function fetchOnboardingComplete(): Promise<boolean> {
  const api = setupAPIClient();
  const { data } = await api.get<{ completed: boolean }>("/user/onboarding");
  return Boolean(data.completed);
}

export async function markOnboardingComplete(): Promise<void> {
  const api = setupAPIClient();
  await api.post("/user/onboarding/complete");
}

export function isPolicyBannerDismissed(): boolean {
  try {
    return (
      localStorage.getItem("contaplus_policy_update_seen_v2") === "true" &&
      localStorage.getItem("contaplus_privacy_consent_v1") === "true" &&
      localStorage.getItem("cookieConsent") === "true"
    );
  } catch {
    return false;
  }
}
