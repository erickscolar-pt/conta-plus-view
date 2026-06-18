import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Router from "next/router";
import {
  fetchOnboardingComplete,
  isPolicyBannerDismissed,
  markOnboardingComplete,
  readLocalOnboardingComplete,
  writeLocalOnboardingComplete,
} from "@/services/onboarding";
import { ONBOARDING_STEPS } from "@/component/tutorial/onboardingSteps";

type TutorialContextValue = {
  active: boolean;
  stepIndex: number;
  totalSteps: number;
  requestImportModal: () => void;
  registerImportModalOpener: (fn: () => void) => void;
};

const TutorialContext = createContext<TutorialContextValue | null>(null);

export function useTutorial() {
  const ctx = useContext(TutorialContext);
  if (!ctx) {
    throw new Error("useTutorial must be used within TutorialProvider");
  }
  return ctx;
}

export function useTutorialOptional() {
  return useContext(TutorialContext);
}

type TutorialProviderProps = {
  userId: number;
  children: ReactNode;
  onStepChange?: (stepIndex: number) => void;
  onComplete?: () => void;
};

export function TutorialProvider({
  userId,
  children,
  onStepChange,
  onComplete,
}: TutorialProviderProps) {
  const [active, setActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const importModalOpener = useRef<(() => void) | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (readLocalOnboardingComplete(userId)) {
        setReady(true);
        return;
      }

      try {
        const completed = await fetchOnboardingComplete();
        if (cancelled) return;
        if (completed) {
          writeLocalOnboardingComplete(userId);
          setReady(true);
          return;
        }
      } catch {
        // API indisponível — segue com tutorial local
      }

      const waitForPolicy = () => {
        if (cancelled) return;
        if (isPolicyBannerDismissed()) {
          setActive(true);
          setReady(true);
          return;
        }
        window.setTimeout(waitForPolicy, 400);
      };

      window.setTimeout(waitForPolicy, 600);
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!active) return;
    onStepChange?.(stepIndex);
    const step = ONBOARDING_STEPS[stepIndex];
    if (!step) return;

    if (Router.pathname !== step.route) {
      void Router.push(step.route);
    }
  }, [active, stepIndex, onStepChange]);

  const registerImportModalOpener = useCallback((fn: () => void) => {
    importModalOpener.current = fn;
  }, []);

  const requestImportModal = useCallback(() => {
    importModalOpener.current?.();
  }, []);

  const completeTutorial = useCallback(async () => {
    writeLocalOnboardingComplete(userId);
    try {
      await markOnboardingComplete();
    } catch {
      // localStorage já garante não repetir neste dispositivo
    }
    setActive(false);
    onComplete?.();
  }, [userId, onComplete]);

  const value = useMemo(
    () => ({
      active,
      stepIndex,
      totalSteps: ONBOARDING_STEPS.length,
      requestImportModal,
      registerImportModalOpener,
      ready,
      setStepIndex,
      completeTutorial,
    }),
    [
      active,
      stepIndex,
      requestImportModal,
      registerImportModalOpener,
      ready,
      completeTutorial,
    ],
  );

  return (
    <TutorialContext.Provider
      value={{
        active: value.active,
        stepIndex: value.stepIndex,
        totalSteps: value.totalSteps,
        requestImportModal: value.requestImportModal,
        registerImportModalOpener: value.registerImportModalOpener,
      }}
    >
      <TutorialInternalContext.Provider value={value}>
        {children}
      </TutorialInternalContext.Provider>
    </TutorialContext.Provider>
  );
}

type InternalValue = {
  active: boolean;
  stepIndex: number;
  totalSteps: number;
  ready: boolean;
  setStepIndex: (index: number | ((prev: number) => number)) => void;
  completeTutorial: () => Promise<void>;
};

const TutorialInternalContext = createContext<InternalValue | null>(null);

export function useTutorialInternal() {
  const ctx = useContext(TutorialInternalContext);
  if (!ctx) {
    throw new Error("useTutorialInternal must be used within TutorialProvider");
  }
  return ctx;
}
