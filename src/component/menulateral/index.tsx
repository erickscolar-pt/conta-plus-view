import { useEffect, useState, useContext, useRef } from "react";
import Router from "next/router";
import { AuthContexts } from "@/contexts/AuthContexts";
import Modal from "../ui/modal";
import { ButtonPages } from "../ui/buttonPages";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  MdTrendingUp,
  MdTrendingDown,
  MdTrackChanges,
  MdPieChart,
  MdPerson,
  MdLogout,
  MdImportExport,
} from "react-icons/md";

export default function MenuLateral() {
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
      link.setAttribute("download", "modelo.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download da planilha concluído.");
      setLoadingDownloadExcel(false);
    } catch (error) {
      setLoadingDownloadExcel(false);
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
      const response = await apiClient.post(`/files/import-excel`, formData);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
        fileInputRef.current.type = "text";
        fileInputRef.current.type = "file";
      }
      if (response.data.error) {
        toast.warn(response.data.error, { autoClose: false, delay: 10 });
        return;
      }
      toast.success("Arquivo enviado com sucesso!");
    } catch (error) {
      toast.success("Erro ao enviar o arquivo. Tente novamente.");
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
        bg-emerald-600
        text-white
        flex
        md:flex-col
        flex-row
        items-center
        justify-between
        md:justify-start
        py-2 md:py-4
        z-40
        md:space-y-6
      "
        style={{ right: "auto" }}
      >
        <nav className="flex flex-1 flex-row md:flex-col items-center justify-around md:justify-start w-full md:space-y-4">
          <button
            className="p-3 hover:bg-emerald-700 rounded-lg"
            onClick={() => Router.push("/ganhos")}
            title="Ganhos"
          >
            <MdTrendingUp size={24} />
          </button>
          <button
            className="p-3 hover:bg-emerald-700 rounded-lg"
            onClick={() => Router.push("/gastos")}
            title="Gastos"
          >
            <MdTrendingDown size={24} />
          </button>
          <button
            className="p-3 hover:bg-emerald-700 rounded-lg"
            onClick={() => Router.push("/metas")}
            title="Metas"
          >
            <MdTrackChanges size={24} />
          </button>
          <button
            className="p-3 hover:bg-emerald-700 rounded-lg"
            onClick={() => Router.push("/dashboard")}
            title="Dashboard"
          >
            <MdPieChart size={24} />
          </button>
          <button
            className="p-3 hover:bg-emerald-700 rounded-lg"
            onClick={() => Router.push("/perfil")}
            title="Perfil"
          >
            <MdPerson size={24} />
          </button>
          <button
            className="p-3 hover:bg-emerald-700 rounded-lg"
            onClick={() => setIsModalExcel(true)}
            title="Importar/Exportar"
          >
            <MdImportExport size={24} />
          </button>
        </nav>
        <div className="md:mt-auto">
          <button
            className="p-3 hover:bg-emerald-700 rounded-lg"
            onClick={signOut}
            title="Sair"
          >
            <MdLogout size={24} />
          </button>
        </div>
      </aside>
      <Modal isOpen={isModalExcel} onClose={handleCloseExcel}>
        <div className="flex flex-col gap-4 p-4 bg-emerald-600 rounded-2xl text-white w-full max-w-md">
          <h2 className="text-xl font-bold mb-2">Enviar Planilha com Dados</h2>
          <ButtonPages loading={loadingDownloadExcel} onClick={downloadExcel}>
            Baixar modelo de Planilha
          </ButtonPages>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              accept=".xlsx"
              id="fileInput"
              onChange={handleFileChange}
              disabled={loadingSendFileExcel}
              ref={fileInputRef}
              className="block w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
            />
            {selectedFile && (
              <ButtonPages
                loading={loadingSendFileExcel}
                onClick={handleSendFile}
              >
                Enviar Planilha
              </ButtonPages>
            )}
          </div>
          <div className="w-full justify-center text-center">
            <Link href="/importreport" className="underline">
              Click para saber mais sobre importar dados.
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
