import React, { useEffect, useState } from "react";
import { MdCalendarMonth, MdToday } from "react-icons/md";

interface CalendarProps {
  onDateSelect: (date: Date, type?: "day" | "month") => void;
  type?: "day" | "month";
  hideType?: boolean;
  hideButton?: boolean;
  textButton?: string;
  colorButton?: string;
}

export default function Calendar({
  colorButton = "#14b8a6",
  textButton,
  onDateSelect,
  hideType = false,
  hideButton = false,
  type,
}: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedType, setSelectedType] = useState<"day" | "month">(
    type || "day",
  );

  const handleSelectType = (t: "day" | "month") => {
    setSelectedType(t);
    setSelectedDate("");
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleSelectDate = () => {
    if (!selectedDate) return;
    const date = new Date(selectedDate);
    onDateSelect(date, selectedType);
  };

  useEffect(() => {
    setSelectedType(type || "day");
    setSelectedDate("");
  }, [type]);

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-900/40 p-3 shadow-inner shadow-black/20 ring-1 ring-white/[0.04] sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {!hideType && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Período
          </span>
        )}
        {!hideType && (
          <div
            className="inline-flex w-full max-w-full rounded-xl bg-slate-950/80 p-1 ring-1 ring-white/10 sm:w-auto"
            role="group"
            aria-label="Tipo de período"
          >
            <button
              type="button"
              onClick={() => handleSelectType("day")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:flex-initial sm:px-4 ${
                selectedType === "day"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/40"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <MdToday className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              Por dia
            </button>
            <button
              type="button"
              onClick={() => handleSelectType("month")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:flex-initial sm:px-4 ${
                selectedType === "month"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-900/40"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              <MdCalendarMonth
                className="h-4 w-4 shrink-0 opacity-90"
                aria-hidden
              />
              Por mês
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="block min-w-0 flex-1">
          <span className="mb-1.5 block text-xs font-medium text-slate-500">
            {selectedType === "day" ? "Data" : "Mês"}
          </span>
          <input
            type={selectedType === "day" ? "date" : "month"}
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full rounded-xl border border-white/10 bg-slate-950/90 py-2.5 pl-3 pr-3 text-sm text-slate-100 shadow-sm focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/25 [color-scheme:dark]"
          />
        </label>
        {!hideButton && (
          <button
            className="w-full shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99] sm:w-auto sm:min-w-[7.5rem]"
            style={{ background: colorButton }}
            onClick={handleSelectDate}
            type="button"
          >
            {textButton || "Filtrar"}
          </button>
        )}
      </div>
      {!hideType && (
        <p className="mt-3 text-[11px] leading-snug text-slate-500">
          Defina a data e use{" "}
          <strong className="font-medium text-slate-400">
            {textButton || "Filtrar"}
          </strong>{" "}
          para atualizar os lançamentos.
        </p>
      )}
    </div>
  );
}
