import Link from "next/link";
import PublicDocLayout from "@/component/layout/PublicDocLayout";

const CONTACT_EMAIL = "contato@contaplus.app.br";
const LAST_UPDATED = "8 de junho de 2026";

export default function PoliticaDePrivacidade() {
  return (
    <PublicDocLayout title="Política de Privacidade | Conta+">
      <div className="mb-8 rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-cyan-500/10 p-5">
        <span className="mb-3 inline-flex rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
          Versão atualizada
        </span>
        <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">
          Política de Privacidade
        </h1>
        <p className="max-w-3xl text-slate-200">
          Esta política explica como a plataforma Conta+ (contaplus.app.br), operada pela
          Otimafy, coleta, utiliza, armazena e protege seus dados pessoais e financeiros,
          em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
        </p>
        <p className="mt-3 text-sm text-slate-400">Última atualização: {LAST_UPDATED}</p>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">1. Quem somos</h2>
          <p className="mt-2 text-slate-300">
            O Conta+ é um serviço de organização financeira pessoal. O plano gratuito permite
            registrar e acompanhar suas contas sem custo. Planos pagos (Conta+ AI Premium)
            incluem recursos adicionais de consultoria por inteligência artificial, descritos
            nesta política e nos{" "}
            <Link href="/termosdeuso" className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200">
              Termos de Uso
            </Link>
            .
          </p>
          <p className="mt-2 text-slate-300">
            Para questões sobre privacidade e proteção de dados:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">2. Dados que coletamos</h2>
          <p className="mt-2 text-slate-300">Podemos tratar as seguintes categorias de dados:</p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>
              <strong className="text-slate-200">Cadastro:</strong> nome, e-mail, senha
              (armazenada de forma criptografada) e preferências de conta.
            </li>
            <li>
              <strong className="text-slate-200">Dados financeiros inseridos por você:</strong>{" "}
              receitas, despesas, categorias, metas, dívidas, importações de extratos/planilhas
              e demais informações que você registra na plataforma.
            </li>
            <li>
              <strong className="text-slate-200">Uso do serviço:</strong> logs de acesso,
              endereço IP, tipo de navegador/dispositivo, páginas visitadas e registros técnicos
              para segurança e melhoria do produto.
            </li>
            <li>
              <strong className="text-slate-200">Assinatura e pagamento:</strong> plano contratado,
              status da assinatura, identificadores de transação PIX e confirmações de pagamento
              processados por parceiros (ex.: Mercado Pago). Não armazenamos dados completos de
              cartão, pois o pagamento atual é via PIX.
            </li>
            <li>
              <strong className="text-slate-200">Recursos de IA (planos pagos ou amostra grátis):</strong>{" "}
              mensagens enviadas ao chat, histórico de sessões, resultados de análises geradas e
              metadados de consumo (créditos utilizados, tokens processados).
            </li>
            <li>
              <strong className="text-slate-200">Comunicações:</strong> e-mails transacionais
              (confirmação de cadastro, avisos de assinatura, lembretes autorizados).
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">3. Finalidades do tratamento</h2>
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>Criar e gerenciar sua conta e autenticar seu acesso.</li>
            <li>Exibir dashboards, relatórios, metas e demais funcionalidades do plano gratuito.</li>
            <li>Processar assinaturas, pagamentos e suporte relacionado a planos pagos.</li>
            <li>
              Fornecer o consultor financeiro por IA, gerando análises e respostas com base nos
              dados financeiros que você registrou — exclusivamente quando você solicita ou
              utiliza recursos de IA.
            </li>
            <li>Garantir segurança, prevenir fraudes e cumprir obrigações legais.</li>
            <li>Melhorar a plataforma mediante estatísticas agregadas e anônimas, quando aplicável.</li>
            <li>Enviar comunicações essenciais sobre o serviço e, com seu consentimento quando
              exigido, novidades relevantes.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-ai/25 bg-ai/5 p-5">
          <h2 className="text-xl font-semibold text-slate-100">4. Inteligência artificial e terceiros</h2>
          <p className="mt-2 text-slate-300">
            Os recursos de consultor IA do Conta+ AI Premium utilizam provedores de modelos de
            linguagem (atualmente OpenAI) para processar suas perguntas e gerar análises. Para
            isso, enviamos ao provedor apenas o contexto necessário — como resumos financeiros,
            categorias de gasto e a mensagem que você digitou — sempre vinculados à sua solicitação
            explícita de uso da IA.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-300 marker:text-ai">
            <li>
              Não vendemos seus dados financeiros a terceiros para publicidade ou marketing.
            </li>
            <li>
              Provedores de IA e pagamento são contratados como operadores/subprocessadores, com
              obrigações contratuais de confidencialidade e segurança compatíveis com a LGPD.
            </li>
            <li>
              Você pode optar por não contratar o plano Premium e continuar usando apenas as
              funcionalidades gratuitas de organização, sem acionar o processamento por IA.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">5. Base legal (LGPD)</h2>
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>
              <strong className="text-slate-200">Execução de contrato:</strong> prestação do
              serviço gratuito ou pago que você contratou.
            </li>
            <li>
              <strong className="text-slate-200">Consentimento:</strong> quando aplicável a
              comunicações opcionais ou cookies não essenciais.
            </li>
            <li>
              <strong className="text-slate-200">Legítimo interesse:</strong> segurança da
              plataforma, prevenção a abusos e melhoria técnica, respeitando seus direitos.
            </li>
            <li>
              <strong className="text-slate-200">Obrigação legal:</strong> cumprimento de
              exigências fiscais, judiciais ou regulatórias.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">6. Compartilhamento de dados</h2>
          <p className="mt-2 text-slate-300">Seus dados podem ser compartilhados, limitadamente, com:</p>
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>Provedores de hospedagem e infraestrutura em nuvem.</li>
            <li>Processadores de pagamento (Mercado Pago) para confirmação de PIX e assinaturas.</li>
            <li>Provedores de IA para execução das funcionalidades premium solicitadas por você.</li>
            <li>Serviços de e-mail transacional para envio de comunicações do sistema.</li>
            <li>Autoridades públicas, quando houver determinação legal ou ordem judicial.</li>
          </ul>
          <p className="mt-3 text-slate-300">
            Não compartilhamos seus dados financeiros detalhados com parceiros comerciais para
            fins de marketing de terceiros.
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">7. Retenção e exclusão</h2>
          <p className="mt-2 text-slate-300">
            Mantemos seus dados enquanto sua conta estiver ativa ou enquanto forem necessários
            para cumprir as finalidades descritas nesta política, incluindo obrigações legais
            (ex.: registros fiscais de pagamentos). Históricos de chat e análises de IA podem
            ser conservados pelo tempo necessário ao funcionamento do serviço e suporte, podendo
            ser excluídos mediante solicitação quando não houver impedimento legal.
          </p>
          <p className="mt-2 text-slate-300">
            Ao encerrar sua conta, iniciaremos a exclusão ou anonimização dos dados pessoais,
            salvo retenção exigida por lei.
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">8. Segurança</h2>
          <p className="mt-2 text-slate-300">
            Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo
            comunicação criptografada (HTTPS), controle de acesso, senhas com hash e monitoramento
            de incidentes. Nenhum sistema é 100% invulnerável; recomendamos senha forte e não
            compartilhar suas credenciais.
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">9. Seus direitos (titular de dados)</h2>
          <p className="mt-2 text-slate-300">
            Nos termos da LGPD, você pode solicitar, mediante requisição a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
            >
              {CONTACT_EMAIL}
            </a>
            :
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Confirmação da existência de tratamento e acesso aos dados.</li>
            <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em
              desconformidade.</li>
            <li>Portabilidade, quando aplicável.</li>
            <li>Informação sobre compartilhamentos e revogação de consentimento, quando cabível.</li>
            <li>Oposição a tratamentos baseados em legítimo interesse, nos casos previstos em lei.</li>
          </ul>
          <p className="mt-3 text-slate-300">
            Responderemos em prazo razoável. Você também pode registrar reclamação perante a
            Autoridade Nacional de Proteção de Dados (ANPD).
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">10. Cookies e tecnologias similares</h2>
          <p className="mt-2 text-slate-300">
            Utilizamos cookies essenciais para manter sua sessão autenticada e cookies analíticos
            para entender o uso da plataforma. Detalhes adicionais estão na{" "}
            <Link href="/politicadecookies" className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200">
              Política de Cookies
            </Link>
            .
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">11. Menores de idade</h2>
          <p className="mt-2 text-slate-300">
            O Conta+ não se destina a menores de 18 anos. Não coletamos intencionalmente dados
            de crianças ou adolescentes. Se identificarmos cadastro indevido, poderemos excluir
            a conta.
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5">
          <h2 className="text-xl font-semibold text-slate-100">12. Alterações desta política</h2>
          <p className="mt-2 text-slate-300">
            Podemos atualizar esta política para refletir novos recursos (como evoluções do
            consultor IA), parceiros ou exigências legais. A data da última revisão será
            indicada no topo desta página. Alterações relevantes poderão ser comunicadas por
            e-mail ou aviso na plataforma.
          </p>
        </section>

        <section className="rounded-xl border border-amber-300/20 bg-amber-500/10 p-5">
          <h2 className="text-xl font-semibold text-amber-100">Resumo</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-200 marker:text-amber-300">
            <li>Organizar suas contas no plano gratuito não exige pagamento.</li>
            <li>Seus dados financeiros são usados para exibir sua visão financeira e, se você
              contratar IA Premium, para gerar análises personalizadas.</li>
            <li>Compartilhamos dados com provedores estritamente necessários (pagamento, IA,
              infraestrutura).</li>
            <li>Você controla sua conta e pode exercer seus direitos pela LGPD a qualquer momento.</li>
          </ul>
        </section>
      </div>
    </PublicDocLayout>
  );
}
