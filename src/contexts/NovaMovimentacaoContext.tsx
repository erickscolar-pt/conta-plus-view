import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import NovaMovimentacaoModal, {
  type NovaMovimentacaoKind,
} from "@/component/movimentacoes/NovaMovimentacaoModal";

type NovaMovimentacaoContextValue = {
  openNovaMovimentacao: () => void;
};

const NovaMovimentacaoContext =
  createContext<NovaMovimentacaoContextValue | null>(null);

export function NovaMovimentacaoProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const openNovaMovimentacao = useCallback(() => setOpen(true), []);

  const handleSelect = useCallback(
    (kind: NovaMovimentacaoKind) => {
      setOpen(false);
      void router.push({
        pathname: "/movimentacoes",
        query: { tab: kind, nova: "1" },
      });
    },
    [router],
  );

  const value = useMemo(
    () => ({ openNovaMovimentacao }),
    [openNovaMovimentacao],
  );

  return (
    <NovaMovimentacaoContext.Provider value={value}>
      {children}
      <NovaMovimentacaoModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onSelect={handleSelect}
      />
    </NovaMovimentacaoContext.Provider>
  );
}

export function useNovaMovimentacao() {
  const ctx = useContext(NovaMovimentacaoContext);
  if (!ctx) {
    return {
      openNovaMovimentacao: () => {
        void import("next/router").then(({ default: Router }) =>
          Router.push("/movimentacoes"),
        );
      },
    };
  }
  return ctx;
}
