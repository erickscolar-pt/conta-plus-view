import { motion, type HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type Glow = "none" | "green" | "purple" | "ai";

const glowClass: Record<Glow, string> = {
  none: "",
  green: "shadow-glow hover:shadow-glow",
  purple: "shadow-glow-purple",
  ai: "shadow-glow-ai",
};

type Props = HTMLMotionProps<"div"> & {
  children: ReactNode;
  secondary?: boolean;
  glow?: Glow;
  className?: string;
};

export default function PremiumCard({
  children,
  secondary = false,
  glow = "none",
  className = "",
  ...props
}: Props) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={[
        "rounded-2xl border border-white/[0.08] backdrop-blur-xl transition-shadow duration-300",
        secondary ? "bg-cp-card-secondary" : "bg-cp-card",
        "shadow-card",
        glowClass[glow],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </motion.div>
  );
}
