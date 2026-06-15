import { ReactNode, ButtonHTMLAttributes, CSSProperties } from "react";
import Button from "../Button";

interface ButtonPagesProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  bg?: string;
  color?: string;
  children: ReactNode;
}

/** @deprecated Use `Button` from `@/component/ui/Button` */
export function ButtonPages({
  loading,
  children,
  bg,
  color,
  className = "",
  style,
  ...rest
}: ButtonPagesProps) {
  const legacyStyle: CSSProperties | undefined =
    bg || color
      ? { backgroundColor: bg, color: color ?? "#fff", ...style }
      : style;

  return (
    <Button loading={loading} variant="primary" className={className} style={legacyStyle} {...rest}>
      {children}
    </Button>
  );
}
