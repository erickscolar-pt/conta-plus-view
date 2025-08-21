import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/helper";

export default function ChartGrafic({ data, anos, meses }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
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
            data: data.rendas.map((item) => item.valortotal),
          },
          {
            label: "Dívidas",
            backgroundColor: "#BF5252",
            data: data.dividas.map((item) => item.valortotal),
          },
          {
            label: "Metas",
            backgroundColor: "#138DB4",
            data: data.metas.map((item) => item.valortotal),
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
            callbacks: {
              label: (context: any) => {
                return `${formatCurrency(context.raw)}`;
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