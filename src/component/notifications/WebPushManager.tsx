import { useEffect } from "react";
import { syncWebPushSubscription } from "@/utils/web-push";

/** Mantém inscrição Web Push sincronizada enquanto o usuário está logado. */
export default function WebPushManager() {
  useEffect(() => {
    void syncWebPushSubscription();
  }, []);

  return null;
}
