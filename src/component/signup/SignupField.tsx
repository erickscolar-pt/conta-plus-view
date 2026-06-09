import { ReactNode } from "react";

type Props = {
  label: string;
  hint?: string;
  icon?: ReactNode;
  children: ReactNode;
};

export default function SignupField({ label, hint, icon, children }: Props) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200">
        {icon ? (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
            {icon}
          </span>
        ) : null}
        {label}
      </label>
      {children}
      {hint ? <p className="mt-1.5 text-xs leading-relaxed text-cp-subtle">{hint}</p> : null}
    </div>
  );
}

export const signupInputClass =
  "w-full rounded-xl border border-white/[0.08] bg-cp-base/80 px-4 py-3.5 text-slate-100 shadow-inner shadow-black/20 placeholder:text-cp-subtle transition focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25";
