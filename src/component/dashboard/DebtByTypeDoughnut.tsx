import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/helper";

type Item = { tipo: string; total: number };

export default function DebtByTypeDoughnut({ items }: { items: Item[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: items.map((i) => i.tipo),
        datasets: [
          {
            data: items.map((i) => i.total),
            backgroundColor: [
              "rgba(16, 185, 129, 0.85)",
              "rgba(239, 68, 68, 0.85)",
              "rgba(59, 130, 246, 0.85)",
              "rgba(245, 158, 11, 0.85)",
              "rgba(168, 85, 247, 0.85)",
              "rgba(20, 184, 166, 0.85)",
            ],
            borderColor: "rgba(15,23,42,0.8)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { color: "#cbd5e1", usePointStyle: true },
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${formatCurrency(Number(ctx.raw ?? 0))}`,
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

