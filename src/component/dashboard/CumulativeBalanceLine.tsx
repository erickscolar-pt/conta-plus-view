import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { formatCurrency } from "@/helper";

type Item = { day: string; balance: number };

export default function CumulativeBalanceLine({ items }: { items: Item[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    if (chartRef.current) chartRef.current.destroy();

    chartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: items.map((i) => new Date(i.day + "T12:00:00").toLocaleDateString("pt-BR")),
        datasets: [
          {
            label: "Saldo acumulado",
            data: items.map((i) => i.balance),
            borderColor: "rgba(16, 185, 129, 1)",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            tension: 0.25,
            fill: true,
            pointRadius: 2,
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
            ticks: { color: "#94a3b8", callback: (v) => formatCurrency(Number(v)) },
            grid: { color: "rgba(255,255,255,0.08)" },
          },
        },
        plugins: {
          legend: { position: "bottom", labels: { color: "#cbd5e1" } },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.dataset.label}: ${formatCurrency(Number(ctx.raw ?? 0))}`,
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

