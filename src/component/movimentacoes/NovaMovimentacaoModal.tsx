import {
  MdAddCard,
  MdCallReceived,
  MdCallMade,
  MdSwapHoriz,
} from "react-icons/md";
import Modal from "@/component/ui/modal";
import {
  modalMuted,
  modalTitle,
} from "@/component/ui/modal/modalClasses";

export type NovaMovimentacaoKind = "entradas" | "saidas" | "transferencias";

type Option = {
  kind: NovaMovimentacaoKind;
  title: string;
  description: string;
  icon: typeof MdCallReceived;
  accent: string;
};

const OPTIONS: Option[] = [
  {
    kind: "entradas",
    title: "Receita",
    description: "Dinheiro que entrou na sua conta",
    icon: MdCallReceived,
    accent:
      "border-income/30 bg-income/10 hover:bg-income/15 focus-visible:ring-income/40",
  },
  {
    kind: "saidas",
    title: "Despesa",
    description: "Gastos, contas e pagamentos",
    icon: MdCallMade,
    accent:
      "border-expense/30 bg-expense/10 hover:bg-expense/15 focus-visible:ring-expense/40",
  },
  {
    kind: "transferencias",
    title: "Transferência",
    description: "Envie ou receba dinheiro de pessoas vinculadas no Conta+",
    icon: MdSwapHoriz,
    accent:
      "border-primary/40 bg-primary/10 ring-1 ring-primary/25 hover:bg-primary/15 focus-visible:ring-primary/50",
  },
];

type NovaMovimentacaoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (kind: NovaMovimentacaoKind) => void;
};

export default function NovaMovimentacaoModal({
  isOpen,
  onClose,
  onSelect,
}: NovaMovimentacaoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="flex flex-col gap-4">
        <header className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/25">
            <MdAddCard size={22} />
          </span>
          <div>
            <h2 className={modalTitle}>Nova movimentação</h2>
            <p className={modalMuted}>
              Escolha o tipo de lançamento. Transferência não é receita nem
              despesa — o valor sai de uma conta e entra na outra.
            </p>
          </div>
        </header>

        <div className="grid gap-2">
          {OPTIONS.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.kind}
                type="button"
                onClick={() => onSelect(option.kind)}
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left transition focus-visible:outline-none focus-visible:ring-2 ${option.accent}`}
              >
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cp-base/60 text-white">
                  <Icon size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-white">
                    {option.title}
                  </span>
                  <span className="mt-0.5 block text-xs text-cp-muted">
                    {option.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
