import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem('cookieConsent');
    if (consentStatus === 'true') {
      setConsent(true);
    }
  }, []);

  const handleAccept = () => {
    setConsent(true);
    localStorage.setItem('cookieConsent', 'true');
  };

  if (consent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 flex flex-col items-center justify-between border-t border-primary/30 bg-cp-card p-4 text-white md:flex-row">
      <div className="mb-2 md:mb-0 text-sm leading-relaxed">
        Este site utiliza cookies para melhorar a experiência do usuário. Ao continuar navegando, você concorda com a nossa{" "}
        <Link href="/politicadecookies" className="font-medium underline text-brand-300 hover:text-brand-200">
          Política de Cookies
        </Link>.
      </div>
      <button
        onClick={handleAccept}
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-hover"
      >
        Aceitar
      </button>
    </div>
  );
}
