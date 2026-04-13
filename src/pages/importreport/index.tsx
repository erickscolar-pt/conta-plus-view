import PublicDocLayout from "@/component/layout/PublicDocLayout";
import { setupAPIClient } from "@/services/api";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ImportReport() {
  const [loadingDownloadExcel, setLoadingDownloadExcel] = useState(false);

  const handleDownloadTemplate = async () => {
    setLoadingDownloadExcel(true);
    const apiClient = setupAPIClient();

    try {
      const response = await apiClient.get(`/files/download-template`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "modelo.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download da planilha concluído.");
      setLoadingDownloadExcel(false);
    } catch (error) {
      console.error("Erro ao baixar o arquivo:", error);
      setLoadingDownloadExcel(false);
    }
  };

  return (
    <PublicDocLayout title="Importação de Relatórios">
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">Importação de Relatórios</h1>
      <p className="mb-8 max-w-3xl text-slate-300">
        Entenda como funciona o processo de importação e organize suas finanças
        de forma eficiente usando o modelo de planilha.
      </p>

      <div className="grid gap-4">
        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Como funciona</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Baixe o arquivo Excel de exemplo nesta página.</li>
            <li>Preencha as abas Salário, Dívidas e Metas com seus dados.</li>
            <li>Revise os campos antes de enviar para importação.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Regras de preenchimento</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Nomes (Empresa, Dívida e Objetivo) devem conter mais de 3 caracteres.</li>
            <li>Campos de data devem estar em formato de data válido.</li>
            <li>Valores monetários devem ser numéricos e positivos.</li>
            <li>Status de Dívidas deve ser "Pago" ou "Não Pago".</li>
            <li>Parcela deve ser número maior ou igual a 1.</li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Modelo de planilha</h2>
          <p className="mt-2 text-slate-300">
            Use o modelo oficial para garantir importação correta dos dados.
          </p>
          <button
            onClick={handleDownloadTemplate}
            disabled={loadingDownloadExcel}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingDownloadExcel ? "Baixando..." : "Baixar modelo de planilha"}
          </button>
        </section>
      </div>
    </PublicDocLayout>
  );
}
