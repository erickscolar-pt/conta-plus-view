import { canSSRAuth } from "@/utils/canSSRAuth";

export default function GanhosRedirect() {
  return null;
}

export const getServerSideProps = canSSRAuth(async () => ({
  redirect: { destination: "/movimentacoes?tab=entradas", permanent: false },
}));
