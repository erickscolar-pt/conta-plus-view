import PublicDocLayout from "@/component/layout/PublicDocLayout";
import Link from "next/link";

export default function Manual() {
  return (
    <PublicDocLayout title="Manual de instrucoes">
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
        Manual de Instruções
      </h1>
      <p className="mb-8 max-w-3xl text-slate-300">
        Guia rápido para começar no Conta+ e aproveitar melhor as funcionalidades de controle
        financeiro, incluindo importação por planilha e extrato bancário.
      </p>

      <div className="grid gap-4">
        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Primeiros passos</h2>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Cadastre-se ou faça login.</li>
            <li>Cadastre rendas e saídas (ou importe pelo Excel).</li>
            <li>Acompanhe o saldo no dashboard.</li>
            <li>Defina metas financeiras com categoria e opção de descontar do saldo.</li>
          </ol>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Importação Excel e extrato</h2>
          <p className="mt-2 text-slate-300">
            Você pode lançar vários registros de uma vez com o arquivo oficial{" "}
            <strong className="text-slate-200">modelo-conta-plus.xlsx</strong>.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>
              <strong>Onde baixar:</strong> menu lateral (logado) em Importar planilha, ou a página{" "}
              <Link href="/importreport" className="text-emerald-400 underline hover:text-emerald-300">
                Importação de relatórios
              </Link>
              .
            </li>
            <li>
              <strong>Abas:</strong> Salário (entradas), Dívidas (saídas com tipo), Metas (com
              categoria) e Extrato (créditos e débitos como no banco).
            </li>
            <li>
              <strong>Extrato bancário:</strong> exporte o extrato do seu banco (CSV/Excel),
              copie colunas para a aba Extrato: Data, descrição, valor, se é entrada ou saída, e
              o tipo do gasto nas saídas. Veja o passo a passo detalhado na página de importação.
            </li>
            <li>
              <strong>Validação:</strong> datas em dd/mm/aaaa, valores em real, tipos de saída
              criados automaticamente quando necessário. Erros mostram aba e linha do problema.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Funcionalidades principais</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>
              <strong>Rendas:</strong> registre entradas por data.
            </li>
            <li>
              <strong>Saídas e dívidas:</strong> controle pagamentos, status, parcelas e tipos.
            </li>
            <li>
              <strong>Metas:</strong> objetivos com categoria única e opção de descontar do saldo.
            </li>
            <li>
              <strong>Dashboard:</strong> gráficos, filtros e saldo do período (entradas menos
              saídas e metas que descontam).
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Dúvidas frequentes</h2>
          <div className="mt-2 space-y-4 text-slate-300">
            <div>
              <p className="font-semibold text-slate-100">Como redefinir minha senha?</p>
              <p>Clique em &quot;Esqueci minha senha&quot; na tela de login e siga as instruções.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-100">A importação Excel falhou. O que fazer?</p>
              <p>
                Leia a mensagem de erro (ela indica aba e linha). Confira cabeçalhos na primeira
                linha, datas e valores. Use sempre o modelo atual baixado pelo sistema.
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-100">Onde vejo alertas e lembretes?</p>
              <p>As notificações aparecem no sino no topo da aplicação.</p>
            </div>
          </div>
        </section>
      </div>
    </PublicDocLayout>
  );
}
