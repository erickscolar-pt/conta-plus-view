import { canSSRAuth } from "@/utils/canSSRAuth";

export default function GastosRedirect() {
  return null;
}

export const getServerSideProps = canSSRAuth(async () => ({
  redirect: { destination: "/movimentacoes?tab=saidas", permanent: false },
}));
