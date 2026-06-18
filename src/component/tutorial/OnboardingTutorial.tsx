import { useEffect } from "react";
import { MdArrowBack, MdArrowForward, MdCheckCircle, MdUploadFile } from "react-icons/md";
import BrandLogo from "@/component/brand/BrandLogo";
import { useTutorialInternal } from "@/contexts/TutorialContext";
import { ONBOARDING_STEPS } from "@/component/tutorial/onboardingSteps";
import OfxBankGuides from "@/component/tutorial/OfxBankGuides";

export default function OnboardingTutorial() {
  const {
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

  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [active]);

  if (!ready || !active || !step) {
    return null;
  }

  async function handleNext() {
    if (isLast) {
      await completeTutorial();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }

  function handlePrev() {
    setStepIndex((i) => Math.max(i - 1, 0));
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
            disabled={isFirst}
            className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-cp-muted transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <MdArrowBack size={18} />
            Anterior
          </button>

          <button
            type="button"
            onClick={() => void handleNext()}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110"
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
