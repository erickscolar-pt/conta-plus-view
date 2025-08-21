import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { Title } from "@/component/ui/title";
import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";
import ChartGrafic from "@/component/chartgrafic";
import NotFound from "@/component/notfound";
import Head from "next/head";
import { formatCurrency } from "@/helper";
import {
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaPiggyBank,
} from "react-icons/fa";
import ChartGraficLine from "@/component/chartgraficline";
import MetricCard from "@/component/metriccard";
import { Usuario } from "@/model/type";
import Chat from "@/component/chat";

interface DashboardChartProps {
  dashboarddata: DashboardData;
  usuario: Usuario;
}

export interface DashboardData {
  rendas: DataItem[];
  dividas: DataItem[];
  metas: DataItem[];
}

export interface DataItem {
  mes: string;
  valortotal: number;
}

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function Dashboard({
  dashboarddata,
  usuario,
}: DashboardChartProps) {
  const date = new Date();
  const [graficoBarra, setGraficoBarra] = useState<DashboardData | null>(null);
  const [monthRange, setMonthRange] = useState([0, 11]);
  const [yearRange, setYearRange] = useState([
    date.getFullYear() - 1,
    date.getFullYear(),
  ]);
  const [anosText, setAnosText] = useState(0);
  const [mesesText, setMesesText] = useState(0);

  useEffect(() => {
    setGraficoBarra(dashboarddata);
  }, [dashboarddata]);

  const handleRangeChange = async () => {
    const apiClient = setupAPIClient();

    const initialDate = new Date(yearRange[0], monthRange[0], 1)
      .toISOString()
      .split("T")[0];
    const finalDate = new Date(yearRange[1], monthRange[1] + 1, 0)
      .toISOString()
      .split("T")[0];
    setAnosText(yearRange[1] - yearRange[0]);
    setMesesText(monthRange[1] - monthRange[0]);
    const response = await apiClient.post(
      `/dashboard?initial=${initialDate}&final=${finalDate}`
    );
    setGraficoBarra(response.data);
  };

  const totalRendas =
    graficoBarra?.rendas.reduce((acc, item) => acc + item.valortotal, 0) || 0;
  const totalDividas =
    graficoBarra?.dividas.reduce((acc, item) => acc + item.valortotal, 0) || 0;
  const totalMetas =
    graficoBarra?.metas.reduce((acc, item) => acc + item.valortotal, 0) || 0;

  return (
    <>
      <Head>
        <title>Conta Plus - Dashboard</title>
      </Head>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <MenuLateral />
        <div className="flex-1 flex flex-col md:ml-20">
          <Header usuario={usuario} />
          <main className="flex-1 p-2 sm:p-4 md:p-8 overflow-y-auto">
            <div className="bg-white rounded-2xl p-2 sm:p-4 md:p-6 mb-6 sm:mb-8 shadow-lg">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                <h2 className="text-xl font-semibold text-gray-700">
                  Filtro Geral
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-600 mb-2"
                    htmlFor="meses"
                  >
                    Meses:
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      max="11"
                      min="0"
                      type="range"
                      value={monthRange[0]}
                      onChange={(e) =>
                        setMonthRange([Number(e.target.value), monthRange[1]])
                      }
                    />
                    <input
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                      max="11"
                      min="0"
                      type="range"
                      value={monthRange[1]}
                      onChange={(e) =>
                        setMonthRange([monthRange[0], Number(e.target.value)])
                      }
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{months[monthRange[0]]}</span>
                      <span>{months[monthRange[1]]}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-600 mb-2"
                    htmlFor="anos"
                  >
                    Anos:
                  </label>
                  <div className="relative">
                    <input
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      max={2060}
                      min={1990}
                      type="range"
                      value={yearRange[0]}
                      onChange={(e) =>
                        setYearRange([Number(e.target.value), yearRange[1]])
                      }
                    />
                    <input
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
                      max={2060}
                      min={1990}
                      type="range"
                      value={yearRange[1]}
                      onChange={(e) =>
                        setYearRange([yearRange[0], Number(e.target.value)])
                      }
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>{yearRange[0]}</span>
                      <span>{yearRange[1]}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-end">
                  <button
                    className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                    onClick={handleRangeChange}
                  >
                    Filtrar
                  </button>
                </div>
              </div>
            </div>
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-6 sm:mb-8">
              <MetricCard
                title="Salário Recebido"
                value={formatCurrency(totalRendas)}
                icon={FaMoneyBillWave}
              />
              <MetricCard
                title="Contas Pagas"
                value={formatCurrency(totalDividas)}
                icon={FaFileInvoiceDollar}
              />
              <MetricCard
                title="Dinheiro Guardado"
                value={formatCurrency(totalMetas)}
                icon={FaPiggyBank}
              />
            </div>
            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
              <div className="bg-white rounded-2xl p-2 sm:p-4 md:p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Gráfico Referente aos Últimos Meses
                </h3>
                {graficoBarra ? (
                  <ChartGrafic
                    data={graficoBarra}
                    anos={anosText}
                    meses={mesesText}
                  />
                ) : (
                  <NotFound />
                )}
              </div>
              <div className="bg-white rounded-2xl p-2 sm:p-4 md:p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Linha Financeira
                </h3>
                {graficoBarra ? (
                  <ChartGraficLine
                    data={graficoBarra}
                    anos={anosText}
                    meses={mesesText}
                  />
                ) : (
                  <NotFound />
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
      <Chat usuario={usuario} />
    </>
  );
}


export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const dateInitial = new Date();
  const dateFinal = new Date();
  dateInitial.setMonth(dateFinal.getMonth() - 3);
  dateInitial.setDate(dateInitial.getDate() - dateInitial.getDate() + 1);

  const formattedInitial = dateInitial.toISOString().split("T")[0];
  const formattedFinal = dateFinal.toISOString().split("T")[0];

  try {
    const dashboarddata = await apiClient.post(
      `/dashboard?initial=${formattedInitial}&final=${formattedFinal}`
    );
    const user = await apiClient.get("/user/get");

    return {
      props: {
        dashboarddata: dashboarddata.data,
        usuario: user.data,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar as rendas:", error.message);
    return {
      props: {
        dashboarddata: [],
        usuario: [],
      },
    };
  }
});
