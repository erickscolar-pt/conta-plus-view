import { ButtonHTMLAttributes, ReactNode } from "react";
import { FaSpinner } from "react-icons/fa";

type Variant = "primary" | "secondary" | "income" | "expense" | "ghost";

const variantClass: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-dash to-brand-600 text-white shadow-glow hover:brightness-110",
  secondary:
    "border border-white/[0.08] bg-cp-card text-cp-muted hover:bg-white/[0.04] hover:text-white",
  income: "bg-income/20 text-green-100 ring-1 ring-income/30 hover:bg-income/30",
  expense: "bg-expense/20 text-red-100 ring-1 ring-expense/30 hover:bg-expense/30",
  ghost: "bg-transparent text-cp-muted hover:bg-white/[0.04] hover:text-white",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: Variant;
  fullWidth?: boolean;
  children: ReactNode;
};

export default function Button({
  loading,
  children,
  variant = "primary",
  fullWidth = true,
  className = "",
  disabled,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${fullWidth ? "w-full" : ""} ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {loading ? <FaSpinner className="animate-spin" /> : children}
    </button>
  );
}
