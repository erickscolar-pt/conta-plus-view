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

export default function ChartGrafic({
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
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Entradas",
            backgroundColor: "rgba(16, 185, 129, 0.85)",
            data: r,
            borderRadius: 4,
          },
          {
            label: "Dívidas / gastos",
            backgroundColor: "rgba(239, 68, 68, 0.85)",
            data: d,
            borderRadius: 4,
          },
          {
            label: "Objetivos (valor)",
            backgroundColor: "rgba(59, 130, 246, 0.85)",
            data: m,
            borderRadius: 4,
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
              text: "Período",
              color: "#374151",
            },
            ticks: {
              color: "#6B7280",
              maxRotation: 45,
              minRotation: 0,
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
              label: (ctx) => {
                const v = ctx.raw as number;
                return `${ctx.dataset.label}: ${formatCurrency(+v)}`;
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
