import type { IconType } from "react-icons";
import { motion } from "framer-motion";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

const variants: Record<
  string,
  {
    ring: string;
    iconBg: string;
    iconColor: string;
    valueColor: string;
    glow: string;
  }
> = {
  income: {
    ring: "ring-income/20",
    iconBg: "bg-income/15",
    iconColor: "text-income",
    valueColor: "text-income",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(34,197,94,0.35)]",
  },
  expense: {
    ring: "ring-expense/20",
    iconBg: "bg-expense/15",
    iconColor: "text-expense",
    valueColor: "text-expense",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(239,68,68,0.3)]",
  },
  goal: {
    ring: "ring-goals/20",
    iconBg: "bg-goals/15",
    iconColor: "text-goals",
    valueColor: "text-goals",
    glow: "hover:shadow-[0_0_32px_-8px_rgba(6,182,212,0.3)]",
  },
  savings: {
    ring: "ring-planning/20",
    iconBg: "bg-planning/15",
    iconColor: "text-planning",
    valueColor: "text-planning",
    glow: "hover:shadow-glow-purple",
  },
  balance: {
    ring: "ring-dash/20",
    iconBg: "bg-dash/15",
    iconColor: "text-dash",
    valueColor: "text-white",
    glow: "hover:shadow-glow",
  },
};

export default function MetricCard({
  title,
  subtitle,
  value,
  icon: Icon,
  variant = "balance",
  trend,
  trendLabel,
}: {
  title: string;
  subtitle?: string;
  value: string;
  icon: IconType;
  variant?: keyof typeof variants;
  trend?: number;
  trendLabel?: string;
}) {
  const v = variants[variant] ?? variants.balance;
  const trendUp = trend != null && trend >= 0;
  const hasTrend = trend != null && Number.isFinite(trend);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
      className={`group rounded-2xl border border-white/[0.08] bg-cp-card p-5 shadow-card backdrop-blur-xl ring-1 transition-shadow duration-300 ${v.ring} ${v.glow}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${v.iconBg} transition-transform duration-300 group-hover:scale-105`}
        >
          <Icon className={`text-lg ${v.iconColor}`} />
        </div>
        {hasTrend && (
          <div
            className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              trendUp
                ? "bg-income/15 text-income"
                : "bg-expense/15 text-expense"
            }`}
          >
            {trendUp ? (
              <FaArrowTrendUp className="text-[10px]" />
            ) : (
              <FaArrowTrendDown className="text-[10px]" />
            )}
            {Math.abs(trend).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="mt-4 min-w-0">
        <p className="text-sm font-medium text-cp-muted">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-cp-subtle">{subtitle}</p>
        ) : null}
        <p className={`mt-2 text-2xl font-bold tracking-tight ${v.valueColor}`}>
          {value}
        </p>
        {trendLabel ? (
          <p className="mt-1.5 text-xs text-cp-subtle">{trendLabel}</p>
        ) : null}
      </div>
    </motion.div>
  );
}
