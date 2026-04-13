import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/helper";

type Item = { tipo: string; paid: number; open: number };

export default function PaidOpenByTypeBar({ items }: { items: Item[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: items.map((i) => i.tipo),
        datasets: [
          {
            label: "Pago",
            data: items.map((i) => i.paid),
            backgroundColor: "rgba(34, 197, 94, 0.85)",
            borderRadius: 4,
          },
          {
            label: "Em aberto",
            data: items.map((i) => i.open),
            backgroundColor: "rgba(239, 68, 68, 0.85)",
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: { color: "#94a3b8" },
            grid: { display: false },
          },
          y: {
            ticks: {
              color: "#94a3b8",
              callback: (value) => formatCurrency(Number(value)),
            },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#cbd5e1", usePointStyle: true },
          },
          tooltip: {
            callbacks: {
              label: (ctx) =>
                `${ctx.dataset.label}: ${formatCurrency(Number(ctx.raw ?? 0))}`,
            },
          },
        },
      },
    });

    return () => chartRef.current?.destroy();
  }, [items]);

  return (
    <div className="relative h-72 w-full md:h-80">
      <canvas ref={canvasRef} />
    </div>
  );
}

