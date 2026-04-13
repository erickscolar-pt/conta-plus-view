import {
  ReactNode,
  useEffect,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

const sizeClass: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Largura máxima do painel */
  size?: keyof typeof sizeClass;
};

export default function Modal({
  isOpen,
  onClose,
  children,
  size = "lg",
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener("keydown", onEscape);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onEscape);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onEscape]);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Fechar modal"
      />
      <div
        className={`relative z-10 flex w-full ${sizeClass[size]} max-h-[90vh] flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 text-slate-100 shadow-2xl ring-1 ring-white/5`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="absolute right-2 top-2 z-20 rounded-xl p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
          onClick={onClose}
          aria-label="Fechar"
        >
          <MdClose size={22} />
        </button>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-12 sm:px-8 sm:pb-8">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
}
