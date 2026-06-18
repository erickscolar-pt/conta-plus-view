import { useEffect, useState } from "react";
import { MdArrowBack, MdArrowForward, MdCheckCircle, MdUploadFile } from "react-icons/md";
import BrandLogo from "@/component/brand/BrandLogo";
import { useTutorialInternal } from "@/contexts/TutorialContext";
import { ONBOARDING_STEPS } from "@/component/tutorial/onboardingSteps";
import OfxBankGuides from "@/component/tutorial/OfxBankGuides";
import {
  getTutorialPeekRemaining,
  startTutorialPeek,
  clearTutorialPeek,
  TUTORIAL_STEP_PEEK_MS,
} from "@/services/onboarding";

export default function OnboardingTutorial() {
  const {
    userId,
    active,
    stepIndex,
    totalSteps,
    ready,
    setStepIndex,
    completeTutorial,
  } = useTutorialInternal();

  const step = ONBOARDING_STEPS[stepIndex];
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === totalSteps - 1;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const [panelVisible, setPanelVisible] = useState(
    () => getTutorialPeekRemaining(userId) <= 0,
  );
  const [isTransitioning, setIsTransitioning] = useState(
    () => getTutorialPeekRemaining(userId) > 0,
  );

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = panelVisible ? "hidden" : "";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active, panelVisible]);

  useEffect(() => {
    if (!active) return;

    const remaining = getTutorialPeekRemaining(userId);
    if (remaining <= 0) {
      setPanelVisible(true);
      setIsTransitioning(false);
      return;
    }

    setPanelVisible(false);
    setIsTransitioning(true);
    const timer = window.setTimeout(() => {
      clearTutorialPeek(userId);
      setPanelVisible(true);
      setIsTransitioning(false);
    }, remaining);

    return () => window.clearTimeout(timer);
  }, [active, userId, stepIndex]);

  if (!ready || !active || !step) {
    return null;
  }

  function goToStep(nextIndex: number) {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setPanelVisible(false);
    startTutorialPeek(userId, TUTORIAL_STEP_PEEK_MS);
    setStepIndex(nextIndex);
  }

  async function handleNext() {
    if (isTransitioning) return;
    if (isLast) {
      await completeTutorial();
      return;
    }
    goToStep(Math.min(stepIndex + 1, totalSteps - 1));
  }

  function handlePrev() {
    if (isFirst || isTransitioning) return;
    goToStep(Math.max(stepIndex - 1, 0));
  }

  if (!panelVisible) {
    return (
      <div
        className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] z-[125] flex justify-center px-4 lg:bottom-8"
        role="status"
        aria-live="polite"
      >
        <p className="rounded-full border border-white/10 bg-cp-card/95 px-4 py-2.5 text-xs text-cp-muted shadow-lg backdrop-blur-sm sm:text-sm">
          Explore a tela — próxima dica do tour em instantes…
        </p>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[130] flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="flex max-h-[min(96vh,820px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/[0.1] bg-cp-card shadow-2xl sm:rounded-3xl">
        <div className="border-b border-white/[0.08] px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <BrandLogo size="compact" href="" />
            <span className="text-xs font-medium text-cp-subtle">
              Passo {stepIndex + 1} de {totalSteps}
            </span>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-dash to-brand-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {step.id === "import-ofx" ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-dash/15 px-3 py-1 text-xs font-semibold text-dash">
              <MdUploadFile size={14} />
              Formato recomendado: OFX
            </span>
          ) : null}

          <h2 id="onboarding-title" className="mt-3 text-xl font-bold text-white sm:text-2xl">
            {step.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-cp-muted sm:text-[15px]">
            {step.subtitle}
          </p>

          <ul className="mt-4 space-y-2">
            {step.bullets.map((bullet) => (
              <li
                key={bullet}
                className="flex items-start gap-2 text-sm text-cp-muted"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-dash" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {step.content === "ofx-banks" ? <OfxBankGuides /> : null}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst || isTransitioning}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-cp-muted transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MdArrowBack size={18} />
            Anterior
          </button>

          <button
            type="button"
            onClick={() => void handleNext()}
            disabled={isTransitioning}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLast ? (
              <>
                <MdCheckCircle size={18} />
                Começar a usar
              </>
            ) : (
              <>
                Próximo
                <MdArrowForward size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
