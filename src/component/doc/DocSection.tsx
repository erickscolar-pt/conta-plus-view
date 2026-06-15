import { ReactNode } from "react";

type Variant = "default" | "ai" | "summary";

const VARIANT_CLASS: Record<Variant, string> = {
  default: "border-white/[0.08] bg-cp-card/60",
  ai: "border-ai/25 bg-gradient-to-br from-ai/10 to-cp-card/40",
  summary: "border-amber-500/25 bg-gradient-to-br from-amber-500/10 to-cp-card/30",
};

const TITLE_CLASS: Record<Variant, string> = {
  default: "text-white",
  ai: "text-white",
  summary: "text-amber-100",
};

type Props = {
  title: string;
  children: ReactNode;
  variant?: Variant;
};

export default function DocSection({ title, children, variant = "default" }: Props) {
  return (
    <section
      className={`scroll-mt-28 rounded-2xl border p-5 shadow-sm backdrop-blur-sm sm:p-6 ${VARIANT_CLASS[variant]}`}
    >
      <h2 className={`text-lg font-semibold sm:text-xl ${TITLE_CLASS[variant]}`}>{title}</h2>
      <div className="doc-prose mt-3">{children}</div>
    </section>
  );
}
