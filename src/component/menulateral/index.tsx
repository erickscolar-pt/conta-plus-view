import Image from "next/image";
import { canSSRGuest } from "../../utils/canSSRGuest";
import styles from "./styles.module.scss";
import iconGanhos from "../../../public/icons/icon_ganhos.png";
import iconGastos from "../../../public/icons/icon_gastos.png";
import iconMetas from "../../../public/icons/icon_metas.png";
import iconDashboard from "../../../public/icons/icon_dashboard.png";
import iconExcel from "../../../public/icons/icon_excel.png";
import exit from "../../../public/icons/ci_exit.png";
import { useEffect, useState, useContext, useRef } from "react";
import Router from "next/router";
import { AuthContexts } from "@/contexts/AuthContexts";
import Modal from "../ui/modal";
import { ButtonPages } from "../ui/buttonPages";
import { setupAPIClient } from "@/services/api";
import { toast } from "react-toastify";

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
    setSelectedFile(null); // Reseta o estado do arquivo selecionado ao fechar o modal
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
      console.error("Erro ao baixar o arquivo:", error);
      setLoadingDownloadExcel(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    console.log(file);
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
      console.log("Resposta da importação:", response.data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
        fileInputRef.current.type = "text";
        fileInputRef.current.type = "file";
      }
      if(response.data.error){
        toast.warn(response.data.error, {autoClose: false, delay: 10})
        return;
      }
      toast.success("Arquivo enviado com sucesso!");
    } catch (error) {
      console.error("Erro ao enviar o arquivo:", error);
      toast.success("Erro ao enviar o arquivo. Tente novamente.");
    } finally {
      setLoadingSendFileExcel(false);
      setSelectedFile(null); // Limpa o estado após o envio
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
        fileInputRef.current.type = "text";
        fileInputRef.current.type = "file";
      }
      setIsModalExcel(false);
    }
  };

  return (
    <div className={styles.content}>
      <div className={styles.menuLateral}>
        <div className={styles.listbutton}>
          <button
            className={styles.ganhos}
            onClick={() => {
              Router.push("/ganhos");
            }}
          >
            <Image alt="" src={iconGanhos} />
          </button>

          <button
            className={styles.gastos}
            onClick={() => {
              Router.push("/gastos");
            }}
          >
            <Image alt="" src={iconGastos} />
          </button>

          <button
            className={styles.metas}
            onClick={() => {
              Router.push("/metas");
            }}
          >
            <Image alt="" src={iconMetas} />
          </button>

          <button
            className={styles.dashboard}
            onClick={() => {
              Router.push("/dashboard");
            }}
          >
            <Image alt="" src={iconDashboard} />
          </button>

          <button
            className={styles.excel}
            onClick={() => {
              setIsModalExcel(true);
            }}
          >
            <Image alt="" src={iconExcel} />
          </button>

          <button
            className={styles.exit}
            onClick={() => {
              signOut();
            }}
          >
            <Image alt="" src={exit} />
          </button>
        </div>
      </div>
      <Modal isOpen={isModalExcel} onClose={handleCloseExcel}>
        <div className={styles.containerModal}>
          <h2>Enviar Planilha com Dados</h2>

          {/* Botão para Download da Planilha */}
          <ButtonPages loading={loadingDownloadExcel} onClick={downloadExcel}>
            Baixar modelo de Planilha
          </ButtonPages>

          {/* Selecione o arquivo e envie */}
          <div className={styles.selected}>
            <div className={styles.fileInputWrapper}>
              <input
                type="file"
                accept=".xlsx"
                id="fileInput"
                onChange={handleFileChange}
                disabled={loadingSendFileExcel}
                className={styles.fileInput}
              />
              <label htmlFor="fileInput" className={styles.fileInputLabel}>
                {selectedFile ? selectedFile.name : "Escolher arquivo"}
              </label>
            </div>

            {/* Botão de Enviar o arquivo se houver arquivo selecionado */}
            {selectedFile && (
              <ButtonPages loading={loadingSendFileExcel} onClick={handleSendFile}>
                Enviar Planilha
              </ButtonPages>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});
