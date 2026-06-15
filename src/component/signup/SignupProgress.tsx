import { motion } from "framer-motion";

const STEP_LABELS = ["Seus dados", "Segurança", "Pronto!"];

type Props = {
  step: number;
  totalSteps: number;
};

export default function SignupProgress({ step, totalSteps }: Props) {
  const progress = Math.min(100, Math.round((step / totalSteps) * 100));

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-wider text-cp-subtle">
        <span>
          Etapa {step} de {totalSteps}
        </span>
        <span className="text-primary">{progress}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-dash via-primary to-brand-300"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="mt-4 hidden gap-2 sm:flex">
        {STEP_LABELS.slice(0, totalSteps).map((label, index) => {
          const n = index + 1;
          const active = n === step;
          const done = n < step;
          return (
            <div
              key={label}
              className={`flex flex-1 items-center gap-2 rounded-xl border px-3 py-2 text-xs transition ${
                active
                  ? "border-primary/40 bg-primary/10 text-white"
                  : done
                    ? "border-white/[0.08] bg-white/[0.04] text-cp-muted"
                    : "border-transparent text-cp-subtle"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  done
                    ? "bg-primary text-cp-base"
                    : active
                      ? "bg-primary/30 text-primary"
                      : "bg-white/10 text-cp-subtle"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span className="truncate font-medium">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
