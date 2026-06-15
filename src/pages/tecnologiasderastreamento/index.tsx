import Link from "next/link";
import PublicDocLayout from "@/component/layout/PublicDocLayout";
import DocSection from "@/component/doc/DocSection";

export default function TecnologiasDeRastreamento() {
  return (
    <PublicDocLayout
      title="Tecnologias de Rastreamento | Conta+"
      heading="Tecnologias de Rastreamento"
      description={
        <>
          Além de cookies, podemos utilizar pixels, tags e ferramentas de analytics para entender
          como a plataforma é usada e melhorar a experiência — sempre em conformidade com a{" "}
          <Link href="/politicadeprivacidade">Política de Privacidade</Link>.
        </>
      }
    >
      <DocSection title="O que são essas tecnologias?">
        <p>
          Pixels e tags são fragmentos de código que registram eventos como visita a uma página,
          clique em botão ou conclusão de cadastro. Servem para estatísticas agregadas e
          melhorias de produto, não para vender seus dados financeiros.
        </p>
      </DocSection>

      <DocSection title="Como utilizamos">
        <ul>
          <li>Análise de comportamento de uso da aplicação e da landing page</li>
          <li>Medição de desempenho de páginas e funcionalidades</li>
          <li>Entender funis de cadastro e conversão para planos pagos</li>
          <li>Detectar erros técnicos e gargalos de performance</li>
        </ul>
      </DocSection>

      <DocSection title="Ferramentas comuns">
        <ul>
          <li>
            <strong>Google Analytics</strong> — estatísticas de visitas e origem de tráfego
          </li>
          <li>
            <strong>Logs de servidor</strong> — endereço IP, user-agent e timestamps para
            segurança
          </li>
        </ul>
        <p>
          Não compartilhamos o conteúdo das suas movimentações financeiras com redes de
          publicidade.
        </p>
      </DocSection>

      <DocSection title="Suas opções">
        <p>
          Você pode gerenciar preferências nas configurações do navegador, usar extensões de
          bloqueio de rastreadores ou recusar cookies não essenciais no banner de consentimento.
        </p>
        <p>
          Dúvidas: consulte a{" "}
          <Link href="/politicadecookies">Política de Cookies</Link> ou entre em contato pelo
          e-mail indicado na política de privacidade.
        </p>
      </DocSection>
    </PublicDocLayout>
  );
}
