import { setupAPIClient } from "./api";

const STORAGE_PREFIX = "contaplus_onboarding_v1_";
const SESSION_ACTIVE_PREFIX = "contaplus_tutorial_active_v1_";
const SESSION_STEP_PREFIX = "contaplus_tutorial_step_v1_";

export function onboardingStorageKey(userId: number) {
  return `${STORAGE_PREFIX}${userId}`;
}

function sessionActiveKey(userId: number) {
  return `${SESSION_ACTIVE_PREFIX}${userId}`;
}

function sessionStepKey(userId: number) {
  return `${SESSION_STEP_PREFIX}${userId}`;
}

/** Progresso do tour na sessão atual (sobrevive à troca de rota no Next.js). */
export function readTutorialSession(userId: number): {
  active: boolean;
  stepIndex: number;
} {
  try {
    const active = sessionStorage.getItem(sessionActiveKey(userId)) === "true";
    const raw = sessionStorage.getItem(sessionStepKey(userId));
    const stepIndex = raw != null ? Number(raw) : 0;
    return {
      active,
      stepIndex: Number.isFinite(stepIndex) && stepIndex >= 0 ? stepIndex : 0,
    };
  } catch {
    return { active: false, stepIndex: 0 };
  }
}

export function writeTutorialSession(
  userId: number,
  active: boolean,
  stepIndex: number,
) {
  try {
    if (active) {
      sessionStorage.setItem(sessionActiveKey(userId), "true");
      sessionStorage.setItem(sessionStepKey(userId), String(stepIndex));
    } else {
      sessionStorage.removeItem(sessionActiveKey(userId));
      sessionStorage.removeItem(sessionStepKey(userId));
    }
  } catch {
    // ignore storage failures
  }
}

export function clearTutorialSession(userId: number) {
  writeTutorialSession(userId, false, 0);
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
