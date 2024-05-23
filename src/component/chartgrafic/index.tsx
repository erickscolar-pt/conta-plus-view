import { useEffect, useState } from "react";
import { canSSRGuest } from "../../utils/canSSRGuest";
import { Chart } from 'react-google-charts';

export default function ChartGrafic({ data, anos, meses }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const rendas = data.rendas.map(item => [item.mes, item.valortotal, 0, 0]);
    const dividas = data.dividas.map(item => [item.mes, 0, item.valortotal, 0]);
    const metas = data.metas.map(item => [item.mes, 0, 0, item.valortotal]);

    const mergedData = rendas.map((renda, index) => [
      renda[0],
      renda[1],
      dividas[index]?.[2] || 0,
      metas[index]?.[3] || 0,
    ]);

    setChartData([
      ['Mês', 'Rendas', 'Dívidas', 'Metas'],
      ...mergedData,
    ]);
  }, [data]);

  const options = {
    title: `Minhas finanças nos últimos ${anos > 0 ? 'e '+anos+(anos>1?' anos':' ano'): ''} ${meses > 1 ? meses+' meses':meses+'mês'}`,
    chartArea: { width: '50%' },
    hAxis: {
      title: 'Mês',
      minValue: 0,
    },
    vAxis: {
      title: 'Total',
      format: 'R$ #,##0.00'
    },
    seriesType: 'bars',
    series: { 3: { type: 'line' } },
    backgroundColor:'transparent',
    colors:['#5ABB8C', '#BF5252','#138DB4']
  };

  return (
    <Chart
      chartType="ComboChart"
      width="100%"
      height="400px"
      data={chartData}
      options={options}
      chartLanguage="pt-BR"
      formatters={[
        {
          type: "NumberFormat",
          column: 1,
          options: {
            prefix: "R$ ",
            decimalSymbol: ',', 
            fractionDigits: 2, 
            suffix: "",
            negativeColor: "red",
            negativeParens: true,
          }
        },
        {
          type: "NumberFormat",
          column: 2,
          options: {
            prefix: "R$",
            decimalSymbol: ',', 
            fractionDigits: 2, 
            suffix: "",
            negativeColor: "red",
            negativeParens: true,
          }
        },
        {
          type: "NumberFormat",
          column: 3,
          options: {
            prefix: "R$",
            decimalSymbol: ',',
            fractionDigits: 2,
            suffix: "",
            negativeColor: "red",
            negativeParens: true,
          }
        }
      ]}
    />
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {

  return {
    props: {}
  }
})
