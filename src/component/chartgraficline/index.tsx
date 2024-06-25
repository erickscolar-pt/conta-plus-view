import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/helper";

export default function ChartGraficLine({ data, anos, meses }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const rendas = data.rendas.map((item) => ({
      x: item.mes,
      y: item.valortotal,
    }));
    const dividas = data.dividas.map((item) => ({
      x: item.mes,
      y: item.valortotal,
    }));
    const metas = data.metas.map((item) => ({
      x: item.mes,
      y: item.valortotal,
    }));

    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.rendas.map((item) => item.mes),
        datasets: [
          {
            label: "Rendas",
            backgroundColor: "#5ABB8C",
            borderColor: "#5ABB8C",
            data: rendas,
            fill: false,
            tension: 0.2
          },
          {
            label: "Dívidas",
            backgroundColor: "#BF5252",
            borderColor: "#BF5252",
            data: dividas,
            fill: false,
            tension: 0.2

          },
          {
            label: "Metas",
            backgroundColor: "#138DB4",
            borderColor: "#138DB4",
            data: metas,
            fill: false,
            tension: 0.2

          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: "Mês",
              color: "white",
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
            },
            grid: {
              display: false,
              color: "rgba(33, 37, 41, 0.3)",
            },
            display: true
          },
          y: {
            title: {
              display: true,
              text: "Total",
              color: "white",
            },
            ticks: {
              callback: (value) => `${formatCurrency(+value)}`,
              color: "rgba(255, 255, 255, 0.7)",
            },
            grid: {
              color: "rgba(255, 255, 255, 0.15)",

            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "white",
            },
          },
          tooltip: {
            mode: 'index',
            intersect:false,
            callbacks: {
              label: (context: any) => {
                const value = context.raw ? context.raw.y : 0;
                return `${formatCurrency(+value)}`;
              },
            },
            
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
      <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
        <div className="flex flex-wrap items-center">
          <div className="relative w-full max-w-full flex-grow flex-1">
            <h6 className="uppercase text-white mb-1 text-xs font-semibold">
              Curva Financeira
            </h6>
          </div>
        </div>
      </div>
      <div className="p-4 flex-auto">
        <div className="relative h-96">
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
}
