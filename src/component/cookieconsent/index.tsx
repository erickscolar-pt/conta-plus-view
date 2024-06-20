import { useState, useEffect } from 'react';

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
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 z-50 flex flex-col md:flex-row items-center justify-between">
      <div className="mb-2 md:mb-0">
        Este site utiliza cookies para melhorar a experiência do usuário. Ao continuar navegando, você concorda com a nossa{' '}
        <a href="/politicadecookies" className="underline text-blue-400">
          Política de Cookies
        </a>.
      </div>
      <button
        onClick={handleAccept}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Aceitar
      </button>
    </div>
  );
}
