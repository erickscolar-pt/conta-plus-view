import MenuLateral from "@/component/menulateral";
import Header from "@/component/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import styles from "./styles.module.scss";
import { Title } from "@/component/ui/title";
import { setupAPIClient } from "@/services/api";
import { useEffect, useState } from "react";
import ChartGrafic from "@/component/chartgrafic";
import NotFound from "@/component/notfound";
import { toast } from "react-toastify";
import Head from "next/head";
import { formatCurrency } from "@/helper";
import {
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaPiggyBank,
} from "react-icons/fa";
import ChartGraficLine from "@/component/chartgraficline";
import MetricCard from "../../component/metriccard";

interface DashboardChartProps {
  dashboarddata: DashboardData;
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

export default function Dashboard({ dashboarddata }: DashboardChartProps) {
  const date = new Date();
  const [graficoBarra, setGraficoBarra] = useState<DashboardData | null>(null);
  const [monthRange, setMonthRange] = useState([0, 11]);
  const [yearRange, setYearRange] = useState([
    date.getFullYear() - 1,
    date.getFullYear(),
  ]);
  const [anosText, setAnosText] = useState(0);
  const [mesesText, setMesesText] = useState(0);

  console.log({ anos: anosText, meses: mesesText });
  useEffect(() => {
    const fetchData = async () => {
      setGraficoBarra(dashboarddata);
    };

    fetchData();
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
      <div className={styles.component}>
        <Header />
        <div className={styles.dashboardComponent}>
          <MenuLateral />
          <div className={styles.dashboard}>
            <Title
              textColor="#400E57"
              color="#DAB7D8"
              icon="dashboard"
              text="GRÀFICO GERAL"
            />
            <div className={styles.content}>
              <div className={styles.filter}>
                <label htmlFor="monthRangeStart">Meses:</label>
                <input
                  type="range"
                  id="monthRangeStart"
                  min="0"
                  max="11"
                  value={monthRange[0]}
                  onChange={(e) =>
                    setMonthRange([Number(e.target.value), monthRange[1]])
                  }
                />
                <input
                  type="range"
                  id="monthRangeEnd"
                  min="0"
                  max="11"
                  value={monthRange[1]}
                  onChange={(e) =>
                    setMonthRange([monthRange[0], Number(e.target.value)])
                  }
                />
                <div className={styles.infomeses}>
                  {months[monthRange[0]]} - {months[monthRange[1]]}
                </div>

                <label htmlFor="yearRangeStart">Anos:</label>
                <input
                  type="range"
                  id="yearRangeStart"
                  min={1990}
                  max={2060}
                  value={yearRange[0]}
                  onChange={(e) =>
                    setYearRange([Number(e.target.value), yearRange[1]])
                  }
                />
                <input
                  type="range"
                  id="yearRangeEnd"
                  min={1990}
                  max={2060}
                  value={yearRange[1]}
                  onChange={(e) =>
                    setYearRange([yearRange[0], Number(e.target.value)])
                  }
                />
                <div className={styles.infoanos}>
                  {yearRange[0]} - {yearRange[1]}
                </div>

                <div className={styles.buttonFilter}>
                  <button onClick={handleRangeChange}>Filtrar</button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                <MetricCard
                  title="Salário Recebido"
                  value={`${formatCurrency(totalRendas)}`}
                  icon={FaMoneyBillWave}
                />
                <MetricCard
                  title="Contas Pagas"
                  value={`${formatCurrency(totalDividas)}`}
                  icon={FaFileInvoiceDollar}
                />
                <MetricCard
                  title="Dinheiro Guardado"
                  value={`${formatCurrency(totalMetas)}`}
                  icon={FaPiggyBank}
                />
              </div>
              {graficoBarra ? (
                <>
                  <ChartGrafic
                    data={graficoBarra}
                    anos={anosText}
                    meses={mesesText}
                  />

                  <ChartGraficLine
                    data={graficoBarra}
                    anos={anosText}
                    meses={mesesText}
                  />
                </>
              ) : (
                <NotFound />
              )}
            </div>
          </div>
        </div>
      </div>
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
    return {
      props: {
        dashboarddata: dashboarddata.data,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar as rendas:", error.message);
    return {
      props: {
        dashboarddata: [],
      },
    };
  }
});
