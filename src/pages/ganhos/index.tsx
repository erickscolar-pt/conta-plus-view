import Head from "next/head";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import GanhosPanel from "@/component/movimentacoes/GanhosPanel";
import { Rendas, Usuario } from "@/model/type";

interface GanhosProps {
  rendas: Rendas[];
  usuario: Usuario;
}

export default function Ganhos({ rendas, usuario }: GanhosProps) {
  return (
    <>
      <Head>
        <title>Ganhos | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-3 py-4 sm:px-6 md:px-10 md:py-8">
          <GanhosPanel rendas={rendas} usuario={usuario} />
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  try {
    const user = await apiClient.get("/user/get");
    const rendas = await apiClient.get("/rendas");
    return {
      props: {
        rendas: rendas.data,
        usuario: user.data,
      },
    };
  } catch {
    return {
      redirect: { destination: "/movimentacoes", permanent: false },
    };
  }
});
