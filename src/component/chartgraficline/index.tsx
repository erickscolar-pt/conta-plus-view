import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/helper";

type DashboardLike = {
  rendas: { mes: string; valortotal: number }[];
  dividas: { mes: string; valortotal: number }[];
  metas: { mes: string; valortotal: number }[];
  aligned?: {
    labels: string[];
    rendas: number[];
    dividas: number[];
    metas: number[];
  };
};

export default function ChartGraficLine({
  data,
  anos,
  meses,
}: {
  data: DashboardLike;
  anos: number;
  meses: number;
}) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const labels = data.aligned?.labels ?? data.rendas.map((item) => item.mes);
    const r = data.aligned?.rendas ?? data.rendas.map((item) => item.valortotal);
    const d = data.aligned?.dividas ?? data.dividas.map((item) => item.valortotal);
    const m = data.aligned?.metas ?? data.metas.map((item) => item.valortotal);

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Entradas",
            borderColor: "rgb(16, 185, 129)",
            backgroundColor: "rgba(16, 185, 129, 0.1)",
            data: r,
            fill: true,
            tension: 0.25,
            pointRadius: 3,
          },
          {
            label: "Dívidas / gastos",
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.05)",
            data: d,
            fill: true,
            tension: 0.25,
            pointRadius: 3,
          },
          {
            label: "Objetivos (valor)",
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.05)",
            data: m,
            fill: true,
            tension: 0.25,
            pointRadius: 3,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Período",
              color: "#374151",
            },
            ticks: {
              color: "#6B7280",
              maxRotation: 45,
            },
            grid: {
              display: false,
            },
          },
          y: {
            title: {
              display: true,
              text: "Valor (R$)",
              color: "#374151",
            },
            ticks: {
              callback: (value) => `${formatCurrency(+value)}`,
              color: "#6B7280",
            },
            grid: {
              color: "rgba(15, 23, 42, 0.06)",
            },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#374151",
              usePointStyle: true,
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const v = context.parsed.y ?? 0;
                return `${context.dataset.label}: ${formatCurrency(+v)}`;
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
  }, [data, anos, meses]);

  return (
    <div className="relative w-full h-80 md:h-96">
      <canvas ref={chartRef} />
    </div>
  );
}
