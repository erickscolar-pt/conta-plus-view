import {
  MdCookie,
  MdDescription,
  MdHelpOutline,
  MdPolicy,
  MdTrackChanges,
  MdUploadFile,
} from "react-icons/md";
import type { IconType } from "react-icons";

export type LegalNavItem = {
  href: string;
  label: string;
  description: string;
  icon: IconType;
};

export const LEGAL_NAV: LegalNavItem[] = [
  {
    href: "/termosdeuso",
    label: "Termos de Uso",
    description: "Regras de uso da plataforma",
    icon: MdDescription,
  },
  {
    href: "/politicadeprivacidade",
    label: "Privacidade",
    description: "Como tratamos seus dados (LGPD)",
    icon: MdPolicy,
  },
  {
    href: "/politicadecookies",
    label: "Cookies",
    description: "Cookies e preferências",
    icon: MdCookie,
  },
  {
    href: "/tecnologiasderastreamento",
    label: "Rastreamento",
    description: "Pixels e analytics",
    icon: MdTrackChanges,
  },
  {
    href: "/manual",
    label: "Manual",
    description: "Guia rápido do Conta+",
    icon: MdHelpOutline,
  },
  {
    href: "/importreport",
    label: "Importação",
    description: "Planilha e extratos",
    icon: MdUploadFile,
  },
];

export const CONTACT_EMAIL = "contato@contaplus.app.br";

export const docLinkClass =
  "font-medium text-primary underline underline-offset-2 transition hover:text-primary-hover";
