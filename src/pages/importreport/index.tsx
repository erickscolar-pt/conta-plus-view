import Header from "@/component/header";
import HeaderAviso from "@/component/headeraviso";
import { setupAPIClient } from "@/services/api";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ImportReport() {
  const router = useRouter();
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
    <div>
      <div className="p-6 bg-gray-100 min-h-screen">
        <Head>
          <title>Importação de Relatórios</title>
        </Head>
        <HeaderAviso />

        {/* Header */}
        <header className="bg-primary text-white py-6 mt-5">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Importação de Relatórios</h1>
            <p className="text-lg mt-2">
              Entenda como funciona o processo de importação e organize suas
              finanças de forma eficiente.
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-10">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary">Como funciona?</h2>
            <p className="mt-4 text-lg">
              Para importar seus dados de relatórios financeiros, siga os passos
              abaixo:
            </p>
            <ul className="list-disc ml-6 mt-4 text-lg space-y-3">
              <li>Baixe o arquivo Excel de exemplo disponível nesta página.</li>
              <li>
                Preencha as abas <strong>Salário</strong>,{" "}
                <strong>Dívidas</strong> e <strong>Metas</strong> com os dados
                necessários.
              </li>
              <li>
                Certifique-se de que todos os campos estão preenchidos
                corretamente:
                <ul className="list-disc ml-6 mt-2 space-y-2">
                  <li>
                    Os nomes (Empresa, Dívida, Objetivo) devem conter mais de 3
                    caracteres.
                  </li>
                  <li>Os campos de Data deve estar formatado em data.</li>
                  <li>Os valores devem ser números válidos e positivos.</li>
                  <li>
                    O campo <strong>Status</strong> na aba{" "}
                    <strong>Dívidas</strong> deve ser "Pago" ou "Não Pago".
                  </li>
                  <li>
                    O campo <strong>Parcela</strong> deve ser um número maior ou
                    igual a 1.
                  </li>
                </ul>
              </li>
              <li>
                Envie o arquivo preenchido através do formulário de importação
                no sistema.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-primary">
              Modelo de Arquivo Excel
            </h2>
            <p className="mt-4 text-lg">
              Utilize o modelo de planilha para garantir que os dados sejam
              importados corretamente. Ele já está formatado com as colunas
              necessárias.
            </p>
            <button
              onClick={handleDownloadTemplate}
              className="mt-6 bg-primary text-white py-3 px-6 rounded-lg hover:bg-ganhos transition-colors"
            >
              Baixar Modelo de Planilha
            </button>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-primary">
              Dúvidas Frequentes
            </h2>
            <ul className="list-disc ml-6 mt-4 text-lg space-y-3">
              <li>
                <strong>
                  O que acontece se eu enviar o arquivo com erros?
                </strong>{" "}
                O sistema irá alertar sobre os erros e solicitar correções antes
                de salvar os dados.
              </li>
              <li>
                <strong>Posso importar mais de um arquivo?</strong> Sim, você
                pode importar vários arquivos, mas certifique-se de que os dados
                estão corretos.
              </li>
              <li>
                <strong>Preciso preencher todas as abas?</strong> Não, você pode
                preencher apenas as abas que desejar importar.
              </li>
            </ul>
          </section>
        </main>

        {/* Footer */}
      </div>
      <footer className="bg-primary text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Conta Plus - Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
