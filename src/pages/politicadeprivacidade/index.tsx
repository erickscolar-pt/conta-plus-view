import PublicDocLayout from "@/component/layout/PublicDocLayout";

export default function PoliticaDePrivacidade() {
  return (
    <PublicDocLayout title="Política de Privacidade">
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Política de Privacidade</h1>
      <p className="mb-8 max-w-3xl text-slate-300">
        Esta política descreve como coletamos, utilizamos e protegemos os seus dados pessoais
        ao usar a plataforma Conta Plus.
      </p>

      <div className="grid gap-4">
        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Dados coletados</h2>
          <p className="mt-2 text-slate-300">Podemos coletar as seguintes informações:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Nome</li>
            <li>E-mail</li>
            <li>Endereço IP</li>
            <li>Outros dados relevantes para o uso dos nossos serviços</li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Finalidade da coleta</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Envio de comunicações relevantes sobre o serviço</li>
            <li>Personalização da experiência de uso</li>
            <li>Melhoria contínua da plataforma e do suporte</li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Compartilhamento de dados</h2>
          <p className="mt-2 text-slate-300">Os dados podem ser compartilhados quando necessário com:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Prestadores de serviço</li>
            <li>Parceiros operacionais</li>
            <li>Autoridades legais, quando exigido por lei</li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Seus direitos</h2>
          <p className="mt-2 text-slate-300">
            Você pode solicitar acesso, correção, exclusão ou limitação de uso dos seus dados.
            Para exercer seus direitos, fale com nosso time:
            <a className="ml-1 font-medium text-emerald-300 underline underline-offset-2 transition hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70" href="mailto:contato@seusite.com">
              contato@seusite.com
            </a>
            .
          </p>
        </section>
      </div>
    </PublicDocLayout>
  );
}

