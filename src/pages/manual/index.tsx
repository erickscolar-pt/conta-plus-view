import PublicDocLayout from "@/component/layout/PublicDocLayout";

export default function Manual() {
  return (
    <PublicDocLayout title="Manual de instrucoes">
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Manual de Instrucoes</h1>
      <p className="mb-8 max-w-3xl text-slate-300">
        Guia rapido para comecar no Conta Plus e aproveitar melhor as funcionalidades
        de controle financeiro.
      </p>

      <div className="grid gap-4">
        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Primeiros passos</h2>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Cadastre-se ou faca login.</li>
            <li>Cadastre rendas e saidas.</li>
            <li>Acompanhe o saldo no dashboard.</li>
            <li>Defina metas financeiras para seu planejamento.</li>
          </ol>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Funcionalidades principais</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>
              <strong>Rendas:</strong> registre entradas por data e categoria.
            </li>
            <li>
              <strong>Saidas e dividas:</strong> controle pagamentos, status e tipos.
            </li>
            <li>
              <strong>Metas:</strong> acompanhe objetivos e progresso mensal.
            </li>
            <li>
              <strong>Dashboard:</strong> visualize graficos, filtros e indicadores.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Duvidas frequentes</h2>
          <div className="mt-2 space-y-4 text-slate-300">
            <div>
              <p className="font-semibold text-slate-100">Como redefinir minha senha?</p>
              <p>Clique em "Esqueci minha senha" na tela de login e siga as instrucoes.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-100">Como adicionar uma nova divida?</p>
              <p>Na tela de saidas, clique em "Nova divida" e preencha os dados.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-100">Onde vejo alertas e lembretes?</p>
              <p>As notificacoes aparecem no sino no topo da aplicacao.</p>
            </div>
          </div>
        </section>
      </div>
    </PublicDocLayout>
  );
}

