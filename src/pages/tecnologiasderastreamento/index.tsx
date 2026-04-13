import PublicDocLayout from "@/component/layout/PublicDocLayout";

export default function TecnologiasDeRastreamento() {
  return (
    <PublicDocLayout title="Tecnologias de Rastreamento">
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Tecnologias de Rastreamento</h1>
      <p className="mb-8 max-w-3xl text-slate-300">
        Podemos utilizar pixels, tags e outras tecnologias para entender melhor o uso da
        plataforma e evoluir a experiência de forma contínua.
      </p>

      <div className="grid gap-4">
        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Como utilizamos</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Análise de comportamento de uso da aplicação</li>
            <li>Personalização de conteúdo e comunicações</li>
            <li>Medição de desempenho de páginas e funcionalidades</li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Suas opções</h2>
          <p className="mt-2 text-slate-300">
            Você pode gerenciar suas preferências nas configurações do navegador e em
            ferramentas de gestão de cookies.
          </p>
        </section>
      </div>
    </PublicDocLayout>
  );
}

