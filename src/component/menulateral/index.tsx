import { useContext, useEffect, useState, useRef, type ChangeEvent } from "react";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { AuthContexts } from "@/contexts/AuthContexts";
import Modal from "../ui/modal";
import { ButtonPages } from "../ui/buttonPages";
import { getErrorMessage, setupAPIClient } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import logoBranco from "../../../public/logo_branco.png";
import {
  MdDashboard,
  MdSwapHoriz,
  MdTrackChanges,
  MdInsights,
  MdCreditCard,
  MdAssessment,
  MdUploadFile,
  MdAutoAwesome,
  MdLogout,
  MdAdd,
  MdHome,
} from "react-icons/md";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: MdDashboard },
  { href: "/movimentacoes", label: "Movimentações", icon: MdSwapHoriz, match: ["/movimentacoes", "/ganhos", "/gastos"] },
  { href: "/metas", label: "Metas", icon: MdTrackChanges },
  { href: "/dashboard", label: "Planejamento", icon: MdInsights },
  { href: "/dividas", label: "Dívidas", icon: MdCreditCard },
  { href: "/relatorios", label: "Relatórios", icon: MdAssessment },
  { href: "/importacao", label: "Importar Extrato", icon: MdUploadFile },
  { href: "/ai", label: "IA Financeira", icon: MdAutoAwesome, ai: true },
] as const;

const MOBILE_NAV = [
  { href: "/dashboard", label: "Início", icon: MdHome },
  { href: "/movimentacoes", label: "Mov.", icon: MdSwapHoriz, action: null },
  { href: "/movimentacoes", label: "Nova", icon: MdAdd, primary: true },
  { href: "/metas", label: "Metas", icon: MdTrackChanges },
  { href: "/ai", label: "IA", icon: MdAutoAwesome },
] as const;

function isActive(path: string, href: string, match?: readonly string[]) {
  if (match?.some((m) => path === m || path.startsWith(`${m}/`))) return true;
  if (href === "/dashboard" && path === "/dashboard") return true;
  if (href === "/dashboard" && path !== "/dashboard") return false;
  return path === href || path.startsWith(`${href}/`);
}

type NavItem = (typeof NAV_ITEMS)[number];

function getMatch(item: NavItem): readonly string[] | undefined {
  return "match" in item ? item.match : undefined;
}

function isAiItem(item: NavItem): boolean {
  return "ai" in item && Boolean(item.ai);
}

export default function MenuLateral() {
  const router = useRouter();
  const { signOut } = useContext(AuthContexts);
  const [loadingDownloadExcel, setLoadingDownloadExcel] = useState(false);
  const [loadingSendFileExcel, setLoadingSendFileExcel] = useState(false);
  const [isModalExcel, setIsModalExcel] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (router.pathname === "/importacao") {
      setIsModalExcel(true);
    }
  }, [router.pathname]);

  const handleCloseExcel = () => {
    setIsModalExcel(false);
    setSelectedFile(null);
    if (router.pathname === "/importacao") {
      void Router.push("/dashboard");
    }
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
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Não foi possível baixar o modelo.",
      );
    } finally {
      setLoadingDownloadExcel(false);
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
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
        fileInputRef.current.value = "";
      }
      const data = response.data as {
        message?: string;
        counts?: { rendas?: number; dividas?: number; metas?: number };
      };
      const c = data.counts;
      const detail =
        c != null
          ? ` (${c.rendas ?? 0} entrada(s), ${c.dividas ?? 0} saída(s), ${c.metas ?? 0} meta(s)).`
          : "";
      toast.success((data.message ?? "Importação concluída.") + detail);
      setIsModalExcel(false);
    } catch (error) {
      toast.error(
        getErrorMessage((error as AxiosError).response?.data) ||
          "Erro ao enviar o arquivo.",
        { autoClose: 9000 },
      );
    } finally {
      setLoadingSendFileExcel(false);
      setSelectedFile(null);
      setIsModalExcel(false);
    }
  };

  const path = router.pathname;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/[0.08] bg-cp-card/95 backdrop-blur-xl lg:flex">
        <div className="border-b border-white/[0.08] px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-dash/30 to-brand-600/20 ring-1 ring-dash/20">
              <Image
                src={logoBranco}
                alt="Conta+"
                width={28}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight text-white">
                Conta<span className="text-dash">+</span>
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-cp-subtle">
                Finance Premium
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const { href, label, icon: Icon } = item;
            const match = getMatch(item);
            const ai = isAiItem(item);
            const active = isActive(path, href, match);
            return (
              <button
                key={label}
                type="button"
                onClick={() => {
                  if (label === "Importar Extrato") {
                    setIsModalExcel(true);
                    return;
                  }
                  void Router.push(href);
                }}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 ${
                  active
                    ? ai
                      ? "bg-ai-active text-ai shadow-glow-ai ring-1 ring-ai/25"
                      : "bg-sidebar-active text-dash shadow-glow ring-1 ring-dash/20"
                    : "text-cp-muted hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon
                  size={20}
                  className={active ? (ai ? "text-ai" : "text-dash") : "text-cp-subtle group-hover:text-white"}
                />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.08] p-3">
          <Link
            href="/planos"
            className="mb-2 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-cp-muted transition hover:bg-white/[0.04] hover:text-white"
          >
            <span className="text-xs uppercase tracking-wider">Premium</span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-cp-muted transition hover:bg-expense/10 hover:text-expense"
          >
            <MdLogout size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-white/[0.08] bg-cp-card/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        {MOBILE_NAV.map((item) => {
          const { href, label, icon: Icon } = item;
          const primary = "primary" in item && item.primary;
          return (
          <button
            key={label}
            type="button"
            onClick={() => void Router.push(href)}
            className={
              primary
                ? "relative -mt-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-dash to-brand-600 text-white shadow-glow"
                : `flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] ${
                    isActive(path, href)
                      ? "text-dash"
                      : "text-cp-subtle"
                  }`
            }
          >
            <Icon size={primary ? 24 : 20} />
            {!primary && <span>{label}</span>}
          </button>
          );
        })}
      </nav>

      <Modal isOpen={isModalExcel} onClose={handleCloseExcel} size="md">
        <div className="flex w-full flex-col gap-5 text-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-white">Importar extrato</h2>
            <p className="mt-1 text-sm text-cp-muted">
              Envie <span className="text-slate-300">.xlsx, .xls, .csv, .ofx ou .pdf</span>.
            </p>
          </div>
          <ButtonPages loading={loadingDownloadExcel} onClick={downloadExcel}>
            Baixar modelo-conta-plus.xlsx
          </ButtonPages>
          <div className="flex flex-col gap-3">
            <label className="block text-sm font-medium text-cp-muted" htmlFor="file_input">
              Arquivo
            </label>
            <input
              type="file"
              accept=".xlsx,.xls,.csv,.ofx,.pdf"
              id="file_input"
              onChange={handleFileChange}
              disabled={loadingSendFileExcel}
              ref={fileInputRef}
              className="block w-full cursor-pointer rounded-xl border border-white/[0.08] bg-cp-base px-3 py-2 text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-dash/20 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-emerald-200"
            />
            {selectedFile && (
              <ButtonPages loading={loadingSendFileExcel} onClick={handleSendFile}>
                Enviar arquivo
              </ButtonPages>
            )}
          </div>
          <div className="text-center text-sm">
            <Link href="/importreport" className="text-dash underline underline-offset-2">
              Como funciona a importação
            </Link>
          </div>
        </div>
      </Modal>
    </>
  );
}
