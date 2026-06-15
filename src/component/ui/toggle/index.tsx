import { ChangeEvent } from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        onChange={onChange}
      />
      <span
        className="absolute inset-0 rounded-full bg-cp-card-secondary ring-1 ring-white/[0.08] transition peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40 peer-checked:bg-income peer-checked:ring-income/30"
        aria-hidden
      />
      <span
        className="pointer-events-none relative left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4"
        aria-hidden
      />
    </label>
  );
}
