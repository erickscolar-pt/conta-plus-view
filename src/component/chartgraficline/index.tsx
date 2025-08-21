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
            tension: 0.2,
          },
          {
            label: "Dívidas",
            backgroundColor: "#BF5252",
            borderColor: "#BF5252",
            data: dividas,
            fill: false,
            tension: 0.2,
          },
          {
            label: "Metas",
            backgroundColor: "#138DB4",
            borderColor: "#138DB4",
            data: metas,
            fill: false,
            tension: 0.2,
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
              color: "#374151",
            },
            ticks: {
              color: "#6B7280",
            },
            grid: {
              display: false,
              color: "rgba(33, 37, 41, 0.1)",
            },
            display: true,
          },
          y: {
            title: {
              display: true,
              text: "Total",
              color: "#374151",
            },
            ticks: {
              callback: (value) => `${formatCurrency(+value)}`,
              color: "#6B7280",
            },
            grid: {
              color: "rgba(33, 37, 41, 0.07)",
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#374151",
            },
          },
          tooltip: {
            mode: "index",
            intersect: false,
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
    <div className="relative w-full h-96">
      <canvas ref={chartRef} />
    </div>
  );
}