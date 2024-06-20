import HeaderAviso from "@/component/headeraviso";
import Head from "next/head";

export default function PoliticaDeCookies() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Head>
        <title>Política de Cookies</title>
      </Head>
      <HeaderAviso />
      <div className="max-w-4xl mt-4 mx-auto bg-white p-8 shadow-lg rounded">
        <h1 className="text -3xl font-bold mb-6">Política de Cookies</h1>
        <p>
          Usamos cookies e tecnologias semelhantes para melhorar a sua
          experiência em nosso site. Esta Política de Cookies explica o que são
          cookies, como os usamos e suas opções em relação a eles.
        </p>
        <h2 className="text-2xl font-bold mt-6">O que são Cookies?</h2>
        <p>
          Cookies são pequenos arquivos de texto armazenados no seu dispositivo
          quando você visita nosso site. Eles nos ajudam a entender como você
          usa nosso site e melhorar sua experiência.
        </p>
        <h2 className="text-2xl font-bold mt-6">Como Usamos Cookies</h2>
        <ul className="list-disc list-inside">
          <li>Para lembrar suas preferências</li>
          <li>Para análise e melhoria do site</li>
          <li>Para fins de marketing</li>
        </ul>
        <h2 className="text-2xl font-bold mt-6">Suas Opções</h2>
        <p>
          Você pode gerenciar e desativar cookies nas configurações do seu
          navegador. No entanto, isso pode afetar a funcionalidade do site.
        </p>
      </div>
    </div>
  );
}
