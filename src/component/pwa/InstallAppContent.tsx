import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MdDownload, MdInstallMobile, MdIosShare } from "react-icons/md";
import { FaChrome } from "react-icons/fa";
import {
  ANDROID_APK_URL,
  isAndroid,
  isBeforeInstallPromptEvent,
  isIos,
  isMobileBrowser,
  type BeforeInstallPromptEvent,
} from "@/utils/pwa";

type Props = {
  variant?: "banner" | "card" | "page";
  onDismiss?: () => void;
  deferred?: BeforeInstallPromptEvent | null;
  onInstallClick?: () => void;
};

export function InstallAppContent({
  variant = "card",
  onDismiss,
  deferred,
  onInstallClick,
}: Props) {
  const [platform, setPlatform] = useState<"unknown" | "android" | "ios" | "mobile">("unknown");

  useEffect(() => {
    if (isAndroid()) setPlatform("android");
    else if (isIos()) setPlatform("ios");
    else if (isMobileBrowser()) setPlatform("mobile");
    else setPlatform("unknown");
  }, []);

  const canNativeInstall = Boolean(deferred);
  const titleClass =
    variant === "page" ? "text-xl font-bold text-white" : "text-sm font-semibold text-white";
  const bodyClass = "mt-2 text-sm leading-relaxed text-cp-muted";

  return (
    <div className={variant === "page" ? "space-y-6" : "space-y-3"}>
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cp-card ring-1 ring-white/[0.08]">
          <Image src="/icon-192.png" alt="Conta+" width={48} height={48} className="h-10 w-10" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={titleClass}>Instale o Conta+ no celular</p>
          <p className={bodyClass}>
            Atalho na tela inicial (PWA) ou APK para Android — mesma conta da web.
          </p>
        </div>
      </div>

      {canNativeInstall ? (
        <button
          type="button"
          onClick={onInstallClick}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-4 py-3 text-sm font-semibold text-white shadow-glow"
        >
          <MdInstallMobile size={20} />
          Instalar app (PWA)
        </button>
      ) : null}

      {platform === "android" ? (
        <div className="rounded-xl border border-white/[0.08] bg-cp-base/50 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-dash">
            <FaChrome size={14} />
            Android — atalho no navegador
          </p>
          <ol className={`${bodyClass} mt-2 list-decimal space-y-1.5 pl-4 text-xs sm:text-sm`}>
            <li>
              Abra no <strong className="text-white/90">Chrome</strong> (recomendado).
            </li>
            <li>
              Menu <strong className="text-white/90">⋮</strong> →{" "}
              <strong className="text-white/90">Instalar app</strong> ou{" "}
              <strong className="text-white/90">Adicionar à tela inicial</strong>.
            </li>
          </ol>
          <a
            href={ANDROID_APK_URL}
            download="conta-plus.apk"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-cp-card px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/[0.04]"
          >
            <MdDownload size={18} />
            Baixar APK (Android)
          </a>
        </div>
      ) : null}

      {platform === "ios" ? (
        <div className="rounded-xl border border-white/[0.08] bg-cp-base/50 p-4">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-dash">
            <MdIosShare size={16} />
            iPhone — adicionar à tela inicial
          </p>
          <ol className={`${bodyClass} mt-2 list-decimal space-y-1.5 pl-4 text-xs sm:text-sm`}>
            <li>
              Use o <strong className="text-white/90">Safari</strong>.
            </li>
            <li>
              <strong className="text-white/90">Compartilhar</strong>{" "}
              <MdIosShare className="inline align-text-bottom" size={14} /> →{" "}
              <strong className="text-white/90">Adicionar à Tela de Início</strong>.
            </li>
          </ol>
        </div>
      ) : null}

      {platform === "mobile" ? (
        <p className={bodyClass}>
          No menu do navegador: <strong className="text-white/90">Instalar app</strong> ou{" "}
          <strong className="text-white/90">Adicionar à tela inicial</strong>.
        </p>
      ) : null}

      {variant !== "page" && onDismiss ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onDismiss}
            className="rounded-xl border border-white/[0.08] px-3 py-2 text-sm font-medium text-cp-muted hover:text-white"
          >
            Agora não
          </button>
          <Link
            href="/instalar-app"
            className="rounded-xl px-3 py-2 text-sm font-medium text-brand-300 hover:text-white"
          >
            Ver guia completo →
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export { isBeforeInstallPromptEvent };
