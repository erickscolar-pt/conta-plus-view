import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/helper";

export default function ChartGrafic({ data, anos, meses }) {
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
      type: "bar",
      data: {
        labels: data.rendas.map((item) => item.mes),
        datasets: [
          {
            label: "Rendas",
            backgroundColor: "#5ABB8C",
            borderColor: "#5ABB8C",
            data: rendas,
          },
          {
            label: "Dívidas",
            backgroundColor: "#BF5252",
            borderColor: "#BF5252",
            data: dividas,
          },
          {
            label: "Metas",
            backgroundColor: "#138DB4",
            borderColor: "#138DB4",
            data: metas,
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
              color: "rgba(33, 37, 41, 0.3)",
            },
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
            callbacks: {
              label: (context) => {
                const value: any = context.raw ? context.raw : 0;

                return `${formatCurrency(value.y)}`;
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
              Grafico referente aos últimos meses
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
