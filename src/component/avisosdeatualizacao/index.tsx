import { useState, useEffect } from "react";

export default function AvisosDeAtualizacao() {
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    // Lógica para verificar se houve atualização nas políticas
    const checkForUpdates = () => {
      // Exemplo de verificação
      const hasUpdates = true; // substituir pela lógica real
      if (hasUpdates) {
        setIsUpdated(true);
      }
    };
    checkForUpdates();
  }, []);

  return (
    isUpdated && (
      <div className="fixed bottom-0 left-0 w-full bg-yellow-500 border-t border-gray-700 rounded-b-xl p-4 text-white flex justify-between items-center">
        <p>Nossas políticas foram atualizadas. Leia as novas políticas <a href="/politica-de-privacidade" className="underline">aqui</a>.</p>
        <button onClick={() => setIsUpdated(false)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Fechar
        </button>
      </div>
    )
  );
}
