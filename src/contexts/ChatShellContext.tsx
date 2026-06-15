import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";

type ChatShellContextValue = {
  open: boolean;
  seedMessage?: string;
  openChat: (seed?: string) => void;
  closeChat: () => void;
};

const ChatShellContext = createContext<ChatShellContextValue | null>(null);

export function ChatShellProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | undefined>();

  const openChat = useCallback((seed?: string) => {
    setSeedMessage(seed);
    setOpen(true);
  }, []);

  const closeChat = useCallback(() => {
    setOpen(false);
    setSeedMessage(undefined);
  }, []);

  const value = useMemo(
    () => ({ open, seedMessage, openChat, closeChat }),
    [open, seedMessage, openChat, closeChat],
  );

  return <ChatShellContext.Provider value={value}>{children}</ChatShellContext.Provider>;
}

export function useChatShell() {
  const ctx = useContext(ChatShellContext);
  if (!ctx) {
    throw new Error("useChatShell must be used within ChatShellProvider");
  }
  return ctx;
}

/** Safe hook for optional chat shell (returns null actions if outside provider). */
export function useChatShellOptional() {
  return useContext(ChatShellContext);
}
