import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import { formatCurrency } from '@/helper';

export default function ChartGrafic({ data, anos, meses }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const rendas = data.rendas.map(item => ({ x: item.mes, y: item.valortotal }));
    const dividas = data.dividas.map(item => ({ x: item.mes, y: item.valortotal }));
    const metas = data.metas.map(item => ({ x: item.mes, y: item.valortotal }));

    const ctx = chartRef.current.getContext('2d');

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.rendas.map(item => item.mes),
        datasets: [
          {
            label: 'Rendas',
            backgroundColor: '#5ABB8C',
            borderColor: '#5ABB8C',
            data: rendas,
          },
          {
            label: 'Dívidas',
            backgroundColor: '#BF5252',
            borderColor: '#BF5252',
            data: dividas,
          },
          {
            label: 'Metas',
            backgroundColor: '#138DB4',
            borderColor: '#138DB4',
            data: metas,
          }
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Mês',
              color: 'white'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)',
            },
            grid: {
              color: 'rgba(33, 37, 41, 0.3)',
            }
          },
          y: {
            title: {
              display: true,
              text: 'Total',
              color: 'white'
            },
            ticks: {
              callback: (value) => `${formatCurrency(+value) }`,
              color: 'rgba(255, 255, 255, 0.7)',
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.15)',
            }
          }
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'white'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value: any = context.raw ? context.raw : 0;

                return `${formatCurrency(value.y)}`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="relative h-96 bg-blueGray-700 p-4 rounded-lg shadow-lg">
      <canvas ref={chartRef} />
    </div>
  );
}
