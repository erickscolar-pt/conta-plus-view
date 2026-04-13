import { useState, useEffect } from "react";
import Link from "next/link";

const STORAGE_KEY = "contaplus_privacy_consent_v1";

export default function ConsentimentoColetaDados() {
  const [mounted, setMounted] = useState(false);
  const [accepted, setAccepted] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setAccepted(stored === "true");
    } catch {
      setAccepted(false);
    }
    setMounted(true);
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* ignore */
    }
    setAccepted(true);
  };

  if (!mounted || accepted) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-label="Consentimento de privacidade"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-emerald-600/40 bg-emerald-600 px-4 py-3 text-white shadow-lg sm:px-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm leading-relaxed text-white/95 sm:text-[15px]">
          Usamos dados pessoais para melhorar sua experiência. Leia nossa{" "}
          <Link
            href="/politicadeprivacidade"
            className="font-medium underline underline-offset-2 hover:text-white"
          >
            Política de Privacidade
          </Link>
          .
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-50"
          >
            Entendi e aceito
          </button>
        </div>
      </div>
    </div>
  );
}
