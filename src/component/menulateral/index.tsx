import { useEffect, useState, useContext, useRef } from "react";
import Router, { useRouter } from "next/router";
import { AuthContexts } from "@/contexts/AuthContexts";
import Modal from "../ui/modal";
import { ButtonPages } from "../ui/buttonPages";
import { getErrorMessage, setupAPIClient } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  MdAccountBalance,
  MdTrackChanges,
  MdPieChart,
  MdPerson,
  MdLogout,
  MdImportExport,
} from "react-icons/md";

export default function MenuLateral() {
  const router = useRouter();
  const [id, setId] = useState(0);
  const { signOut } = useContext(AuthContexts);
  const [loadingDownloadExcel, setLoadingDownloadExcel] = useState(false);
  const [loadingSendFileExcel, setLoadingSendFileExcel] = useState(false);
  const [isModalExcel, setIsModalExcel] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (window) {
      setId(parseInt(sessionStorage.getItem("id")));
    }
  }, []);

  const handleCloseExcel = () => {
    setIsModalExcel(false);
    setSelectedFile(null);
  };

  const downloadExcel = async () => {
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
      toast.success("Download da planilha concluído.");
      setLoadingDownloadExcel(false);
    } catch (error) {
      setLoadingDownloadExcel(false);
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Não foi possível baixar o modelo.",
      );
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSendFile = async () => {
    if (!selectedFile) return;

    setLoadingSendFileExcel(true);
    const apiClient = setupAPIClient();
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await apiClient.post(`/files/import-file`, formData);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
        fileInputRef.current.type = "text";
        fileInputRef.current.type = "file";
      }
      const data = response.data as {
        message?: string;
        counts?: {
          rendas?: number;
          dividas?: number;
          metas?: number;
        };
      };
      const c = data.counts;
      const detail =
        c != null
          ? ` (${c.rendas ?? 0} entrada(s) registradas, ${c.dividas ?? 0} saída(s), ${c.metas ?? 0} meta(s)).`
          : "";
      toast.success((data.message ?? "Importação concluída.") + detail);
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Erro ao enviar o arquivo. Tente novamente.",
        { autoClose: 9000 },
      );
    } finally {
      setLoadingSendFileExcel(false);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
        fileInputRef.current.type = "text";
        fileInputRef.current.type = "file";
      }
      setIsModalExcel(false);
    }
  };

  const navBtn = (active: boolean) =>
    `p-3 rounded-xl transition-colors ${
      active
        ? "bg-emerald-500/20 text-emerald-300 shadow-inner shadow-emerald-500/10"
        : "text-slate-400 hover:bg-white/10 hover:text-white"
    }`;

  const path = router.pathname;

  // Responsivo: vertical em md+, horizontal fixo em baixo no mobile
  return (
    <div>
      <aside
        className="
      fixed
        md:top-0 md:left-0
        md:h-screen
        md:w-20
        w-full
        bottom-0
        border-t border-white/10 bg-slate-950/95 backdrop-blur-xl
        text-white
        flex
        md:flex-col
        flex-row
        items-center
        justify-between
        md:justify-start
        md:border-t-0 md:border-r md:border-white/10
        py-2 md:py-4
        z-40
        md:space-y-6
      "
        style={{ right: "auto" }}
      >
        <nav className="flex w-full flex-1 flex-row items-center justify-around md:flex-col md:justify-start md:space-y-3">
          <button
            type="button"
            className={navBtn(path === "/dashboard")}
            onClick={() => Router.push("/dashboard")}
            title="Visão geral"
          >
            <MdPieChart size={24} />
          </button>
          <button
            type="button"
            className={navBtn(
              path === "/movimentacoes" ||
                path === "/ganhos" ||
                path === "/gastos",
            )}
            onClick={() => Router.push("/movimentacoes")}
            title="Movimentações (entradas e saídas)"
          >
            <MdAccountBalance size={24} />
          </button>
          <button
            type="button"
            className={navBtn(path === "/metas")}
            onClick={() => Router.push("/metas")}
            title="Metas"
          >
            <MdTrackChanges size={24} />
          </button>
          <button
            type="button"
            className={navBtn(path === "/perfil")}
            onClick={() => Router.push("/perfil")}
            title="Perfil"
          >
            <MdPerson size={24} />
          </button>
          <button
            type="button"
            className={navBtn(false)}
            onClick={() => setIsModalExcel(true)}
            title="Importar/Exportar"
          >
            <MdImportExport size={24} />
          </button>
        </nav>
        <div className="md:mt-auto">
          <button
            type="button"
            className="p-3 rounded-xl text-slate-400 transition-colors hover:bg-red-500/15 hover:text-red-300"
            onClick={signOut}
            title="Sair"
          >
            <MdLogout size={24} />
          </button>
        </div>
      </aside>
      <Modal isOpen={isModalExcel} onClose={handleCloseExcel} size="md">
        <div className="flex w-full flex-col gap-5 text-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">
              Importar arquivo
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Envie um arquivo{" "}
              <span className="text-slate-300">.xlsx, .xls, .csv, .ofx ou .pdf</span>.
              Para planilha, use o modelo oficial; para extrato bancário, você também pode enviar
              CSV, OFX ou PDF com texto (extratos só com imagem não são lidos).
            </p>
          </div>
          <ButtonPages loading={loadingDownloadExcel} onClick={downloadExcel}>
            Baixar modelo-conta-plus.xlsx
          </ButtonPages>
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-medium text-slate-400" htmlFor="file_input">
              Arquivo (.xlsx, .xls, .csv, .ofx ou .pdf)
            </label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.ofx,.pdf"
              id="file_input"
              onChange={handleFileChange}
              disabled={loadingSendFileExcel}
              ref={fileInputRef}
              className="block w-full cursor-pointer rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-200 hover:file:bg-emerald-500/30"
            />
            {selectedFile && (
              <ButtonPages
                loading={loadingSendFileExcel}
                onClick={handleSendFile}
              >
                Enviar arquivo
              </ButtonPages>
            )}
          </div>
          <div className="text-center text-sm">
            <Link
              href="/importreport"
              className="text-emerald-400 underline underline-offset-2 hover:text-emerald-300"
            >
              Como funciona a importação
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
