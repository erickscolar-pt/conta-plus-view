import { useEffect, useState } from "react";
import Link from "next/link";

const POLICY_UPDATE_KEY = "contaplus_policy_update_seen_v2";
const PRIVACY_CONSENT_KEY = "contaplus_privacy_consent_v1";
const COOKIE_CONSENT_KEY = "cookieConsent";

export default function AvisosDeAtualizacao() {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const alreadySeen = localStorage.getItem(POLICY_UPDATE_KEY) === "true";
      const privacyAccepted = localStorage.getItem(PRIVACY_CONSENT_KEY) === "true";
      const cookiesAccepted = localStorage.getItem(COOKIE_CONSENT_KEY) === "true";
      setIsVisible(!(alreadySeen && privacyAccepted && cookiesAccepted));
    } catch {
      setIsVisible(true);
    }
    setMounted(true);
  }, []);

  const handleClose = () => {
    try {
      localStorage.setItem(POLICY_UPDATE_KEY, "true");
      localStorage.setItem(PRIVACY_CONSENT_KEY, "true");
      localStorage.setItem(COOKIE_CONSENT_KEY, "true");
    } catch {
      // ignore storage failures
    }
    setIsVisible(false);
  };

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 bottom-3 z-[110] px-3 sm:bottom-4 sm:px-6"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 rounded-2xl border border-emerald-400/25 bg-slate-900/95 p-4 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5">
        <p className="text-sm leading-relaxed text-slate-200 sm:text-[15px]">
          Usamos cookies e dados pessoais para melhorar sua experiencia. Confira{" "}
          <Link
            href="/politicadeprivacidade"
            className="font-semibold text-emerald-300 underline underline-offset-2 transition hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
          >
            Política de Privacidade
          </Link>
          {" "}e{" "}
          <Link
            href="/termosdeuso"
            className="font-semibold text-emerald-300 underline underline-offset-2 transition hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
          >
            Termos de Uso
          </Link>
          {" "}e{" "}
          <Link
            href="/politicadecookies"
            className="font-semibold text-emerald-300 underline underline-offset-2 transition hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
          >
            Política de Cookies
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={handleClose}
          className="inline-flex shrink-0 items-center justify-center rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
        >
          Entendi e aceito
        </button>
      </div>
    </div>
  );
}
