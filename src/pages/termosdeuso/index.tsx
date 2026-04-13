import PublicDocLayout from "@/component/layout/PublicDocLayout";

export default function TermosDeUso() {
  return (
    <PublicDocLayout title="Termos de Uso">
      <div className="mb-8 rounded-2xl border border-emerald-400/20 bg-gradient-to-r from-emerald-500/15 via-emerald-500/5 to-cyan-500/10 p-5 shadow-lg shadow-emerald-500/10">
        <span className="mb-3 inline-flex rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
          Versao atualizada
        </span>
        <h1 className="mb-2 text-3xl font-bold text-white sm:text-4xl">Termos de Uso</h1>
        <p className="max-w-3xl text-slate-200">
          Estes termos regulam o acesso e o uso da plataforma Conta Plus. Ao navegar,
          cadastrar-se ou utilizar os recursos disponiveis, voce concorda com as
          condicoes descritas neste documento.
        </p>
      </div>

      <div className="grid gap-4">
        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Uso da plataforma</h2>
          <p className="mt-2 text-slate-300">
            Voce concorda em utilizar a plataforma em conformidade com as leis
            aplicaveis, sem praticas abusivas, fraudulentas ou que comprometam a
            seguranca do sistema.
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Conteudo enviado pelo usuario</h2>
          <p className="mt-2 text-slate-300">
            Qualquer informacao inserida no sistema e de responsabilidade do usuario,
            que deve garantir a veracidade dos dados e o respeito aos direitos de
            terceiros.
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Atualizacoes dos termos</h2>
          <p className="mt-2 text-slate-300">
            Os termos podem ser atualizados periodicamente para refletir melhorias
            no produto, mudancas legais ou ajustes operacionais. A versao vigente
            sempre estara publicada nesta pagina.
          </p>
        </section>

        <section className="rounded-xl border border-amber-300/20 bg-amber-500/10 p-5">
          <h2 className="text-xl font-semibold text-amber-100">Resumo rapido</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-200 marker:text-amber-300">
            <li>Use a plataforma com responsabilidade e em conformidade com a lei.</li>
            <li>Os dados inseridos sao de responsabilidade do usuario.</li>
            <li>Podemos atualizar estes termos para manter o servico seguro e atual.</li>
          </ul>
        </section>
      </div>
    </PublicDocLayout>
  );
}

