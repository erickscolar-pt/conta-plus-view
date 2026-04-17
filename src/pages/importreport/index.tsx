import PublicDocLayout from "@/component/layout/PublicDocLayout";
import { getErrorMessage, setupAPIClient } from "@/services/api";
import { useState } from "react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

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
      link.setAttribute("download", "modelo-conta-plus.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download da planilha concluído.");
    } catch (error) {
      console.error("Erro ao baixar o arquivo:", error);
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Não foi possível baixar o modelo. Faça login e tente de novo.",
      );
    } finally {
      setLoadingDownloadExcel(false);
    }
  };

  return (
    <PublicDocLayout title="Importação de Relatórios">
      <h1 className="mb-3 text-3xl font-bold text-white sm:text-4xl">
        Importação de Relatórios
      </h1>
      <p className="mb-8 max-w-3xl text-slate-300">
        Use o modelo Excel oficial do Conta+ ou envie arquivos bancários em CSV, OFX ou PDF
        (com texto selecionável) para lançar entradas, saídas, metas e movimentações de
        extrato com validação clara e mensagens de erro objetivas.
      </p>

      <div className="grid gap-4">
        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Como funciona</h2>
          <ol className="mt-2 list-inside list-decimal space-y-2 text-slate-300 marker:text-emerald-300">
            <li>
              Baixe o modelo <strong className="text-slate-200">modelo-conta-plus.xlsx</strong>{" "}
              (botão abaixo ou pelo menu lateral, logado).
            </li>
            <li>
              Preencha uma ou mais abas: <strong>Salário</strong>, <strong>Dívidas</strong>,{" "}
              <strong>Metas</strong> e/ou <strong>Extrato</strong>. A primeira linha de cada
              aba é o cabeçalho e não deve ser apagada.
            </li>
            <li>
              A segunda linha do modelo traz <strong>exemplos</strong>; você pode apagá-la ou
              substituir pelos seus dados.
            </li>
            <li>
              No app, abra <strong>Importar arquivo</strong> no menu, envie o arquivo e
              confira a mensagem de sucesso com o resumo de lançamentos importados.
            </li>
          </ol>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Abas do modelo</h2>
          <ul className="mt-2 list-inside list-disc space-y-2 text-slate-300 marker:text-emerald-300">
            <li>
              <strong className="text-slate-200">Salário:</strong> colunas Empresa, Valor, Data.
              Registra <strong>entradas</strong> (rendas).
            </li>
            <li>
              <strong className="text-slate-200">Dívidas:</strong> Dívida, Valor, Data, Status
              (Pago ou Não Pago), Parcela (≥ 1) e <strong>Tipo</strong> (categoria do gasto /
              tipo de saída). O sistema cria ou reutiliza o tipo automaticamente.
            </li>
            <li>
              <strong className="text-slate-200">Metas:</strong> Objetivo, Categoria, Valor,
              Data e Desconta saldo (Sim/Não). A categoria segue as mesmas regras do app (única
              entre metas e não pode repetir um tipo de saída).
            </li>
            <li>
              <strong className="text-slate-200">Extrato:</strong> para importar{" "}
              <strong>extrato bancário</strong>. Colunas: Data, Descrição (ou Histórico), Valor,
              Movimento (Entrada ou Saída) e Tipo saída (obrigatório quando Movimento é Saída).
              Entradas viram rendas; saídas viram dívidas com o tipo informado.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">
            Extrato do banco (CSV, OFX, PDF ou Excel)
          </h2>
          <p className="mt-2 text-slate-300">
            Você pode importar de dois jeitos: diretamente com CSV, OFX ou PDF do banco, ou
            padronizando no modelo Excel. Se o CSV vier com colunas comuns de data,
            histórico/descrição e valor, o sistema tenta mapear automaticamente. O PDF precisa
            ter texto selecionável (não funciona com extrato escaneado); o layout varia entre
            bancos, então em caso de falha use OFX ou CSV exportados pelo internet banking.
          </p>
          <ol className="mt-2 list-inside list-decimal space-y-2 text-slate-300 marker:text-emerald-300">
            <li>Para <strong>OFX</strong>, basta exportar do banco e enviar o arquivo direto.</li>
            <li>
              Para <strong>CSV</strong>, você pode enviar o arquivo direto; o sistema tenta mapear
              colunas comuns como Data, Descrição/Histórico, Valor, Crédito e Débito.
            </li>
            <li>
              Para <strong>PDF</strong>, use o arquivo gerado pelo banco (com texto). A leitura é
              heurística: cada linha deve trazer data no formato dd/mm/aaaa e valor em formato
              brasileiro; não é necessário enviar um arquivo de exemplo para o sistema funcionar.
            </li>
            <li>
              Se preferir controle total, copie os dados para a aba <strong>Extrato</strong> do
              modelo na ordem <strong>Data | Descrição | Valor | Movimento | Tipo saída</strong>.
            </li>
            <li>
              Datas em <strong>dd/mm/aaaa</strong>, ISO (<strong>aaaa-mm-dd</strong>) e células de
              data do Excel são aceitas. Valores aceitam formato brasileiro (
              <strong>1.234,56</strong>).
            </li>
          </ol>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Regras de validação</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-slate-300 marker:text-emerald-300">
            <li>Textos principais (Empresa, Dívida, Objetivo) com pelo menos 3 caracteres.</li>
            <li>Valores numéricos positivos; moeda brasileira é interpretada automaticamente.</li>
            <li>Datas válidas, inclusive em texto dd/mm/aaaa.</li>
            <li>Status em Dívidas: apenas &quot;Pago&quot; ou &quot;Não Pago&quot;.</li>
            <li>Parcela: número inteiro maior ou igual a 1.</li>
            <li>
              Se algo estiver incorreto, a importação falha com mensagem indicando aba e linha; em
              CSV/OFX, a mensagem aponta a linha do arquivo.
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-white/10 bg-slate-800/40 p-5 transition-all duration-200 hover:border-emerald-400/30 hover:bg-slate-800/55">
          <h2 className="text-xl font-semibold text-slate-100">Modelo de planilha</h2>
          <p className="mt-2 text-slate-300">
            O arquivo inclui quatro abas e linhas de exemplo. Mantenha os nomes das abas como no
            modelo para evitar erro de leitura.
          </p>
          <button
            type="button"
            onClick={handleDownloadTemplate}
            disabled={loadingDownloadExcel}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingDownloadExcel ? "Baixando..." : "Baixar modelo-conta-plus.xlsx"}
          </button>
          <p className="mt-3 text-sm text-slate-500">
            Dica: logado no sistema, o mesmo download está disponível no menu lateral em
            Importar planilha.
          </p>
        </section>
      </div>
    </PublicDocLayout>
  );
}
