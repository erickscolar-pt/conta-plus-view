import PublicDocLayout from "@/component/layout/PublicDocLayout";

export default function PoliticaDeCookies() {
  return (
    <PublicDocLayout title="Política de Cookies">
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Política de Cookies</h1>
      <p className="mb-8 max-w-3xl text-slate-300">
        Utilizamos cookies e tecnologias semelhantes para melhorar a sua experiência, analisar
        o uso da plataforma e oferecer conteúdos mais relevantes.
      </p>

      <div className="grid gap-4">
        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">O que são cookies?</h2>
          <p className="mt-2 text-slate-300">
            Cookies são pequenos arquivos de texto armazenados no seu dispositivo para lembrar
            preferências e melhorar sua navegação.
          </p>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Como usamos cookies</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Salvar preferências de uso</li>
            <li>Analisar comportamento de navegação e desempenho</li>
            <li>Suportar comunicações e campanhas relevantes</li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Suas opções</h2>
          <p className="mt-2 text-slate-300">
            Você pode aceitar, recusar ou remover cookies a qualquer momento pelas configurações
            do seu navegador.
          </p>
        </section>
      </div>
    </PublicDocLayout>
  );
}

