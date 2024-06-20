import Head from "next/head";
import HeaderAviso from "../../component/headeraviso";

export default function PoliticaDePrivacidade() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <Head>
        <title>Política de Privacidade</title>
      </Head>
      <HeaderAviso />
      <div className="max-w-4xl mt-4 text-black mx-auto bg-white p-8 shadow-lg rounded">
        <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
        <p>
          Esta Política de Privacidade descreve como coletamos, usamos,
          processamos e compartilhamos suas informações pessoais ao acessar
          nosso site e utilizar nossos serviços.
        </p>
        <h2 className="text-2xl font-bold mt-6">Dados Coletados</h2>
        <p>Coletamos os seguintes dados pessoais:</p>
        <ul className="list-disc list-inside">
          <li>Nome</li>
          <li>E-mail</li>
          <li>Endereço IP</li>
          <li>Outros dados relevantes para o uso de nossos serviços</li>
        </ul>
        <h2 className="text-2xl font-bold mt-6">Finalidade da Coleta</h2>
        <p>Usamos seus dados pessoais para as seguintes finalidades:</p>
        <ul className="list-disc list-inside">
          <li>Envio de newsletters e comunicações promocionais</li>
          <li>Personalização da sua experiência no site</li>
          <li>Melhoria dos nossos serviços e atendimento ao cliente</li>
        </ul>
        <h2 className="text-2xl font-bold mt-6">Compartilhamento de Dados</h2>
        <p>
          Seus dados podem ser compartilhados com terceiros para as finalidades
          descritas acima, tais como:
        </p>
        <ul className="list-disc list-inside">
          <li>Provedores de serviços de marketing</li>
          <li>Parceiros de negócios</li>
          <li>Autoridades legais, se necessário</li>
        </ul>
        <h2 className="text-2xl font-bold mt-6">Seus Direitos</h2>
        <p>
          Você tem o direito de acessar, corrigir, excluir ou restringir o uso
          de seus dados pessoais. Para exercer esses direitos, entre em contato
          conosco pelo e-mail{" "}
          <a href="mailto:contato@seusite.com">contato@seusite.com</a>.
        </p>
      </div>
    </div>
  );
}
