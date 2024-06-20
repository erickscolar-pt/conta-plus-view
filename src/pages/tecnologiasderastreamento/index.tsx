import HeaderAviso from "@/component/headeraviso";

export default function TecnologiasDeRastreamento() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <HeaderAviso />
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded my-8">
        <h1 className="text-3xl font-bold mb-6">Tecnologias de Rastreamento</h1>
        <p>
          Usamos tecnologias de rastreamento, como pixels e web beacons, para
          coletar informações sobre sua atividade em nosso site e personalizar
          sua experiência.
        </p>
        <h2 className="text-2xl font-bold mt-6">
          Como Usamos Tecnologias de Rastreamento
        </h2>
        <ul className="list-disc list-inside">
          <li>Para análise de comportamento do usuário</li>
          <li>Para personalização de conteúdo e publicidade</li>
        </ul>
        <h2 className="text-2xl font-bold mt-6">Suas Opções</h2>
        <p>
          Você pode gerenciar suas preferências de rastreamento nas
          configurações do seu navegador ou utilizando ferramentas de
          gerenciamento de cookies.
        </p>
      </div>
    </div>
  );
}
