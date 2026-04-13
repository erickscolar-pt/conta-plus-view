import Head from "next/head";
import LoggedLayout from "@/component/layout/LoggedLayout";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import GastosPanel from "@/component/movimentacoes/GastosPanel";
import { Dividas, ITipoDivida, Rendas, Usuario } from "@/model/type";

interface GastosProps {
  dividas: Dividas[];
  rendas: Rendas[];
  usuario: Usuario;
  tipodivida: ITipoDivida[];
}

export default function Gastos({
  dividas,
  rendas,
  usuario,
  tipodivida,
}: GastosProps) {
  return (
    <>
      <Head>
        <title>Gastos | Conta+</title>
      </Head>
      <LoggedLayout usuario={usuario}>
        <main className="relative flex-1 overflow-y-auto px-3 py-4 sm:px-6 md:px-10 md:py-8">
          <GastosPanel
            dividas={dividas}
            rendas={rendas}
            usuario={usuario}
            tipodivida={tipodivida}
          />
        </main>
      </LoggedLayout>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  try {
    const user = await apiClient.get("/user/get");
    const dividas = await apiClient.get("/dividas");
    const tipodivida = await apiClient.get("/dividas/types");
    const rendas = await apiClient.get("/rendas");

    return {
      props: {
        dividas: dividas.data,
        rendas: rendas.data,
        usuario: user.data,
        tipodivida: tipodivida.data,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar as dividas:", error);
    return {
      redirect: { destination: "/movimentacoes", permanent: false },
    };
  }
});
