import type { IconType } from "react-icons";

const variants: Record<
  string,
  { ring: string; iconBg: string; iconColor: string; valueColor: string }
> = {
  income: {
    ring: "ring-emerald-400/20",
    iconBg: "bg-emerald-500/15",
    iconColor: "text-emerald-400",
    valueColor: "text-emerald-300",
  },
  expense: {
    ring: "ring-red-400/20",
    iconBg: "bg-red-500/15",
    iconColor: "text-red-400",
    valueColor: "text-red-300",
  },
  goal: {
    ring: "ring-sky-400/20",
    iconBg: "bg-sky-500/15",
    iconColor: "text-sky-400",
    valueColor: "text-sky-300",
  },
  balance: {
    ring: "ring-white/10",
    iconBg: "bg-white/10",
    iconColor: "text-slate-300",
    valueColor: "text-slate-50",
  },
};

export default function MetricCard({
  title,
  subtitle,
  value,
  icon: Icon,
  variant = "balance",
}: {
  title: string;
  subtitle?: string;
  value: string;
  icon: IconType;
  variant?: keyof typeof variants;
}) {
  const v = variants[variant] ?? variants.balance;

  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/5 p-5 shadow-sm backdrop-blur-sm ring-1 ${v.ring}`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${v.iconBg}`}
        >
          <Icon className={`text-xl ${v.iconColor}`} />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-sm font-medium text-slate-400">{title}</p>
          {subtitle ? (
            <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
          ) : null}
          <p
            className={`mt-2 text-2xl font-semibold tracking-tight ${v.valueColor}`}
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}
