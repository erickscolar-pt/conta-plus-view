import Link from "next/link";
import PublicDocLayout from "@/component/layout/PublicDocLayout";
import DocSection from "@/component/doc/DocSection";
import { CONTACT_EMAIL } from "@/component/doc/legalNav";

const LAST_UPDATED = "8 de junho de 2026";

export default function TermosDeUso() {
  return (
    <PublicDocLayout
      title="Termos de Uso | Conta+"
      heading="Termos de Uso"
      lastUpdated={LAST_UPDATED}
      description={
        <>
          Estes termos regulam o acesso e o uso da plataforma Conta+ (contaplus.app.br). Ao criar conta, navegar ou utilizar qualquer recurso, você declara ter lido e concordado com as condições abaixo, bem como com a <Link href="/politicadeprivacidade">Política de Privacidade</Link>.
        </>
      }
    >
        <DocSection title="1. O serviço Conta+">
          <p className="mt-2 text-slate-300">
            O Conta+ é uma plataforma de organização financeira pessoal que permite registrar
            receitas, despesas, metas, dívidas, importar extratos e acompanhar relatórios.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>
              <strong className="text-slate-200">Plano Grátis:</strong> inclui dashboard,
              movimentações, metas, dívidas, relatórios e importação de arquivos, sem cobrança
              mensal e sem prazo de expiração forçado para uso básico.
            </li>
            <li>
              <strong className="text-slate-200">Conta+ AI Premium (plano pago):</strong> inclui
              consultor financeiro online por inteligência artificial — chat, análises, score,
              projeções e funcionalidades descritas na página de planos no momento da contratação.
            </li>
          </ul>
          <p className="mt-3 text-slate-300">
            Recursos, limites e preços dos planos pagos podem ser consultados em{" "}
            <Link href="/planos" >
              /planos
            </Link>{" "}
            ou na landing page do site. O plano gratuito pode incluir amostra limitada de
            recursos de IA, conforme divulgado na plataforma.
          </p>
        </DocSection>

        <DocSection title="2. Cadastro e conta">
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>Você deve ter 18 anos ou mais para utilizar o serviço.</li>
            <li>
              As informações de cadastro devem ser verdadeiras, completas e mantidas atualizadas.
            </li>
            <li>
              Você é responsável pela confidencialidade da sua senha e por todas as atividades
              realizadas na sua conta.
            </li>
            <li>
              Notifique-nos imediatamente em{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                
              >
                {CONTACT_EMAIL}
              </a>{" "}
              caso suspeite de acesso não autorizado.
            </li>
          </ul>
        </DocSection>

        <DocSection title="3. Uso aceitável">
          <p className="mt-2 text-slate-300">Ao utilizar o Conta+, você concorda em:</p>
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>Respeitar a legislação brasileira aplicável.</li>
            <li>Não utilizar a plataforma para fins ilícitos, fraudulentos ou abusivos.</li>
            <li>
              Não tentar acessar áreas restritas, interferir no funcionamento do sistema ou
              realizar engenharia reversa não autorizada.
            </li>
            <li>
              Não sobrecarregar a infraestrutura com uso automatizado excessivo ou fora dos
              limites do plano contratado.
            </li>
            <li>Não compartilhar credenciais ou revender o acesso sem autorização expressa.</li>
          </ul>
          <p className="mt-3 text-slate-300">
            O descumprimento pode resultar em suspensão ou encerramento da conta, sem prejuízo
            de medidas legais cabíveis.
          </p>
        </DocSection>

        <DocSection title="
            4. Conteúdo e dados inseridos por você
          ">
          <p className="mt-2 text-slate-300">
            Todas as informações financeiras, textos, arquivos importados e mensagens enviadas
            ao chat são de sua responsabilidade. Você declara possuir direito sobre os dados
            inseridos e que eles não violam direitos de terceiros.
          </p>
          <p className="mt-2 text-slate-300">
            Você nos concede licença limitada para armazenar, processar e exibir esses dados
            exclusivamente para prestar o serviço contratado (incluindo geração de análises de IA
            quando você solicitar recursos premium), conforme a Política de Privacidade.
          </p>
        </DocSection>

        <DocSection title="5. Consultor IA e natureza informativa
          " variant="ai">
          <p className="mt-2 text-slate-300">
            O consultor financeiro por inteligência artificial do Conta+ AI Premium utiliza os
            dados que você registrou na plataforma para gerar respostas e análises automatizadas.
            <strong className="text-slate-200">
              {" "}
              Essas informações têm caráter educativo e informativo
            </strong>
            , não constituem consultoria financeira, contábil, jurídica ou de investimentos
            regulada, nem recomendação personalizada para compra ou venda de ativos.
          </p>
          <ul className="mt-3 list-inside list-disc space-y-2 text-slate-300 marker:text-ai">
            <li>
              Decisões financeiras são de sua exclusiva responsabilidade. Consulte profissionais
              habilitados quando necessário.
            </li>
            <li>
              Respostas de IA podem conter imprecisões. Verifique informações críticas antes de
              agir.
            </li>
            <li>
              O serviço de IA depende de provedores terceiros e pode sofrer indisponibilidade
              temporária.
            </li>
          </ul>
        </DocSection>

        <DocSection title="
            6. Planos pagos, assinatura e pagamento
          ">
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>
              A contratação do Conta+ AI Premium é opcional. O plano gratuito permanece
              disponível independentemente da assinatura paga.
            </li>
            <li>
              Pagamentos são processados via PIX por parceiros (ex.: Mercado Pago). Ao gerar um
              PIX, você concorda com os valores e o ciclo (mensal ou anual) selecionados na
              interface.
            </li>
            <li>
              A assinatura entra em vigor após confirmação do pagamento. O período contratado
              segue a data de confirmação (renovação mensal ou anual conforme escolha).
            </li>
            <li>
              Preços vigentes são exibidos antes da confirmação. Alterações de preço para novas
              contratações serão comunicadas na plataforma; assinaturas já ativas seguem as
              regras divulgadas no momento da compra, salvo aviso prévio quando exigido por lei.
            </li>
            <li>
              Não há downgrade automático de Premium para plano pago inferior oferecido pela
              plataforma; ao término da assinatura, o acesso retorna ao plano gratuito com os
              limites correspondentes.
            </li>
          </ul>
        </DocSection>

        <DocSection title="7. Cancelamento e reembolso">
          <p className="mt-2 text-slate-300">
            Você pode deixar de renovar a assinatura Premium simplesmente não efetuando novo
            pagamento ao final do ciclo. O acesso aos recursos pagos permanece até o fim do
            período já pago.
          </p>
          <p className="mt-2 text-slate-300">
            Solicitações de cancelamento ou reembolso devem ser enviadas a{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              
            >
              {CONTACT_EMAIL}
            </a>
            , analisadas conforme o Código de Defesa do Consumidor e a política comercial
            vigente. Em caso de falha comprovada do serviço pago por período prolongado, poderemos
            conceder crédito ou reembolso proporcional, a nosso critério e dentro dos prazos legais.
          </p>
        </DocSection>

        <DocSection title="
            8. Disponibilidade e alterações do serviço
          ">
          <p className="mt-2 text-slate-300">
            Buscamos manter a plataforma disponível de forma contínua, mas não garantimos
            funcionamento ininterrupto. Manutenções, atualizações e eventos de força maior podem
            causar indisponibilidade temporária.
          </p>
          <p className="mt-2 text-slate-300">
            Podemos incluir, modificar ou descontinuar funcionalidades do plano gratuito ou pago,
            comunicando mudanças relevantes quando apropriado. Recursos experimentais podem ser
            oferecidos em caráter beta.
          </p>
        </DocSection>

        <DocSection title="
            9. Propriedade intelectual
          ">
          <p className="mt-2 text-slate-300">
            A marca Conta+, interface, software, textos e demais elementos da plataforma são
            protegidos por direitos de propriedade intelectual. É vedada a cópia, reprodução ou
            exploração comercial não autorizada. Seus dados financeiros permanecem seus; a
            estrutura tecnológica do serviço é de titularidade do Conta+ e seus licenciadores.
          </p>
        </DocSection>

        <DocSection title="10. Limitação de responsabilidade">
          <p className="mt-2 text-slate-300">
            Na máxima extensão permitida pela lei, o Conta+ não se responsabiliza por perdas
            financeiras, lucros cessantes ou danos indiretos decorrentes do uso ou impossibilidade
            de uso da plataforma, inclusive decisões tomadas com base em análises ou respostas de
            IA. Nossa responsabilidade total, quando aplicável, limita-se ao valor pago por você
            nos últimos 12 meses pelo plano pago, exceto em casos de dolo ou culpa grave.
          </p>
        </DocSection>

        <DocSection title="11. Encerramento de conta">
          <p className="mt-2 text-slate-300">
            Você pode solicitar o encerramento da sua conta a qualquer momento pelo canal de
            contato. Reservamo-nos o direito de suspender ou encerrar contas que violem estes
            termos ou representem risco à segurança. Após o encerramento, seus dados serão
            tratados conforme a Política de Privacidade.
          </p>
        </DocSection>

        <DocSection title="12. Alterações destes termos">
          <p className="mt-2 text-slate-300">
            Estes termos podem ser atualizados para refletir novos recursos (como evoluções do
            consultor IA), ajustes de planos ou exigências legais. A versão vigente estará sempre
            publicada nesta página, com a data de atualização no topo. O uso continuado após
            alterações relevantes implica concordância com a nova versão, salvo quando a lei
            exigir consentimento específico.
          </p>
        </DocSection>

        <DocSection title="13. Lei aplicável e foro">
          <p className="mt-2 text-slate-300">
            Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o
            foro da comarca do domicílio do consumidor para dirimir controvérsias, quando
            aplicável o Código de Defesa do Consumidor, ou o foro da comarca de São Paulo/SP na
            ausência de disposição específica em contrário.
          </p>
          <p className="mt-3 text-slate-300">
            Dúvidas sobre estes termos:{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </DocSection>

        <DocSection title="Resumo" variant="summary">
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-200 marker:text-amber-300">
            <li>Organizar suas contas no plano grátis não exige pagamento.</li>
            <li>O AI Premium é opcional e inclui o consultor financeiro online por IA.</li>
            <li>Você é responsável pelos dados que insere e pelas decisões que tomar.</li>
            <li>Análises de IA são informativas — não substituem orientação profissional.</li>
            <li>Pagamento via PIX; assinatura válida pelo período contratado.</li>
          </ul>
        </DocSection>
    </PublicDocLayout>
  );
}
