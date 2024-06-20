import { ReactNode, ButtonHTMLAttributes } from "react";
import styles from "./styles.module.scss";

import { FaSpinner } from "react-icons/fa";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  bg?: string;
  color?: string;
  children: ReactNode;
}

export function Button({ loading, children, bg, color, ...rest }: ButtonProps) {
  return (
    <button
      style={{
        backgroundColor: bg ? bg : "#599E52",
        color: color ? color : "#FFF",
      }}
      className={styles.btn}
      disabled={loading}
      {...rest}
    >
      {loading ? (
        <FaSpinner size={16} className="animate-spin text-4xl text-white" />
      ) : (
        <>{children}</>
      )}
    </button>
  );
}
