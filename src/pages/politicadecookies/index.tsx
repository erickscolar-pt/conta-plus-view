import Link from "next/link";
import PublicDocLayout from "@/component/layout/PublicDocLayout";
import DocSection from "@/component/doc/DocSection";

export default function PoliticaDeCookies() {
  return (
    <PublicDocLayout
      title="Política de Cookies | Conta+"
      heading="Política de Cookies"
      description={
        <>
          Utilizamos cookies e tecnologias semelhantes para manter sua sessão, entender o uso da
          plataforma e melhorar sua experiência. Saiba o que coletamos e como gerenciar suas
          preferências. Consulte também a{" "}
          <Link href="/politicadeprivacidade">Política de Privacidade</Link>.
        </>
      }
    >
      <DocSection title="O que são cookies?">
        <p>
          Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você visita
          um site. Eles ajudam a lembrar preferências, manter você autenticado e entender como a
          plataforma é utilizada.
        </p>
      </DocSection>

      <DocSection title="Cookies que utilizamos">
        <ul>
          <li>
            <strong>Essenciais:</strong> necessários para login, segurança e funcionamento básico
            do Conta+ (inclui o cookie de sessão <code className="text-slate-300">@nextauth.token</code>
            ).
          </li>
          <li>
            <strong>Preferências:</strong> lembram escolhas como consentimento de cookies e avisos
            já visualizados.
          </li>
          <li>
            <strong>Analíticos:</strong> medem páginas visitadas e desempenho para melhorar o
            produto (ex.: Google Analytics, quando habilitado).
          </li>
        </ul>
      </DocSection>

      <DocSection title="Como usamos cookies">
        <ul>
          <li>Manter sua sessão autenticada com segurança</li>
          <li>Salvar preferências de uso e consentimentos</li>
          <li>Analisar comportamento agregado de navegação</li>
          <li>Medir conversão de cadastro e uso de funcionalidades</li>
        </ul>
      </DocSection>

      <DocSection title="Suas opções">
        <p>
          Você pode aceitar cookies pelo banner exibido na primeira visita ou gerenciar/remover
          cookies a qualquer momento nas configurações do seu navegador. Desabilitar cookies
          essenciais pode impedir o login e o uso de partes da plataforma.
        </p>
        <p>
          Para mais detalhes sobre rastreamento, veja{" "}
          <Link href="/tecnologiasderastreamento">Tecnologias de Rastreamento</Link>.
        </p>
      </DocSection>
    </PublicDocLayout>
  );
}
