import HeaderAviso from "@/component/headeraviso";

export default function TermosDeUso() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <HeaderAviso />
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded">
        <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
        <p>
          Estes Termos de Uso regulamentam o acesso e uso do nosso site e
          serviços. Ao acessar ou usar nosso site, você concorda com estes
          Termos de Uso.
        </p>
        <h2 className="text-2xl font-bold mt-6">Uso do Site</h2>
        <p>
          Você concorda em usar nosso site de acordo com as leis aplicáveis e
          respeitar os direitos de propriedade intelectual de nossos conteúdos.
        </p>
        <h2 className="text-2xl font-bold mt-6">Conteúdo do Usuário</h2>
        <p>
          Você é responsável por qualquer conteúdo que enviar para nosso site e
          deve garantir que não infrinja os direitos de terceiros.
        </p>
        <h2 className="text-2xl font-bold mt-6">Modificações</h2>
        <p>
          Podemos modificar estes Termos de Uso a qualquer momento. Quaisquer
          mudanças serão publicadas nesta página.
        </p>
      </div>
    </div>
  );
}
