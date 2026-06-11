import Link from "next/link";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { MdArrowForward, MdAutoAwesome, MdDashboard, MdUploadFile } from "react-icons/md";
import SignupLayout from "@/component/layout/SignupLayout";

interface PaymentsProps {
  userData?: Usuario;
}

type Usuario = {
  id: number;
  nome: string;
  username: string;
  email: string;
  senha?: string;
  codigoReferencia: string | null;
  codigoRecomendacao: string | null;
  created_at: string | Date | null;
  updated_at: string | Date | null;
};

const NEXT_STEPS = [
  { icon: MdDashboard, label: "Veja seu dashboard financeiro" },
  { icon: MdUploadFile, label: "Importe extratos em segundos" },
  { icon: MdAutoAwesome, label: "Converse com o coach IA" },
];

export default function PaymentPage({ userData }: PaymentsProps) {
  const firstName = userData?.nome?.trim().split(/\s+/)[0] || "você";

  return (
    <SignupLayout
      title="Conta criada!"
      description="Sua jornada financeira começa agora."
      step={3}
      totalSteps={3}
      hideFooter
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center"
        >
          <span className="absolute inset-0 animate-pulse-slow rounded-full bg-primary/20 blur-md" />
          <FaCheckCircle className="relative text-5xl text-primary drop-shadow-[0_0_24px_rgba(0,208,132,0.45)]" />
        </motion.div>

        <h3 className="text-xl font-bold text-white sm:text-2xl">
          {firstName}, confirme seu e-mail
        </h3>
        <p className="mt-2 text-sm text-cp-muted">
          Enviamos um link para <strong className="text-white">{userData?.email}</strong>.
          Só depois da confirmação você poderá entrar.
        </p>

        <ul className="mt-8 space-y-3 text-left">
          {NEXT_STEPS.map(({ icon: Icon, label }, i) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08 }}
              className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-cp-base/50 px-4 py-3 text-sm text-slate-300"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <Icon size={18} />
              </span>
              {label}
            </motion.li>
          ))}
        </ul>

        <p className="mt-4 text-xs text-cp-subtle">
          Confirme seu e-mail antes de entrar.{" "}
          <Link href="/verificar-email" className="text-primary underline underline-offset-2">
            Reenviar confirmação
          </Link>
        </p>
        <Link
          href="/login"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-cp-card-secondary px-6 py-3.5 text-sm font-semibold text-white transition hover:border-primary/30 sm:w-auto"
        >
          Ir para login
        </Link>
      </div>
    </SignupLayout>
  );
}
