import { useState } from "react";

export default function ConsentimentoColetaDados() {
  const [isConsented, setIsConsented] = useState(false);

  const handleConsent = () => {
    setIsConsented(true);
    // Aqui você pode adicionar a lógica para armazenar o consentimento
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-primary border-t border-gray-700 rounded-b-xl p-4 text-white flex justify-between items-center">
      <p>Usamos dados pessoais para melhorar sua experiência. Leia nossa <a href="/politica-de-privacidade" className="underline">Política de Privacidade</a>.</p>
      {!isConsented && (
        <button onClick={handleConsent} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Aceitar
        </button>
      )}
    </div>
  );
}
