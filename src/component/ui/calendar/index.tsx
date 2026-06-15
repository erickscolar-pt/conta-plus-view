import React, { useEffect, useState } from "react";
import { MdCalendarMonth, MdToday } from "react-icons/md";

interface CalendarProps {
  onDateSelect: (date: Date, type: "day" | "month") => void;
  type?: "day" | "month";
  hideType?: boolean;
  hideButton?: boolean;
  textButton?: string;
  colorButton?: string;
}

export default function Calendar({
  colorButton,
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

  const inactiveTab =
    "text-cp-muted hover:bg-white/[0.04] hover:text-white";
  const activeTab =
    "bg-primary text-white shadow-glow";

  return (
    <div className="w-full rounded-2xl border border-white/[0.08] bg-cp-card p-3 shadow-card sm:p-4">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {!hideType && (
          <span className="text-[11px] font-semibold uppercase tracking-wider text-cp-subtle">
            Período
          </span>
        )}
        {!hideType && (
          <div
            className="inline-flex w-full max-w-full rounded-xl border border-white/[0.08] bg-cp-base/80 p-1 sm:w-auto"
            role="group"
            aria-label="Tipo de período"
          >
            <button
              type="button"
              onClick={() => handleSelectType("day")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:flex-initial sm:px-4 ${
                selectedType === "day" ? activeTab : inactiveTab
              }`}
            >
              <MdToday className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
              Por dia
            </button>
            <button
              type="button"
              onClick={() => handleSelectType("month")}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-all sm:flex-initial sm:px-4 ${
                selectedType === "month" ? activeTab : inactiveTab
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
          <span className="mb-1.5 block text-xs font-medium text-cp-subtle">
            {selectedType === "day" ? "Data" : "Mês"}
          </span>
          <input
            type={selectedType === "day" ? "date" : "month"}
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full rounded-xl border border-white/[0.08] bg-cp-base/90 py-2.5 pl-3 pr-3 text-sm text-white shadow-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/25 [color-scheme:dark]"
          />
        </label>
        {!hideButton && (
          <button
            className="w-full shrink-0 rounded-xl bg-gradient-to-r from-dash to-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition hover:brightness-110 active:scale-[0.99] sm:w-auto sm:min-w-[7.5rem]"
            style={colorButton ? { background: colorButton } : undefined}
            onClick={handleSelectDate}
            type="button"
          >
            {textButton || "Filtrar"}
          </button>
        )}
      </div>
      {!hideType && (
        <p className="mt-3 text-[11px] leading-snug text-cp-subtle">
          Defina a data e use{" "}
          <strong className="font-medium text-cp-muted">
            {textButton || "Filtrar"}
          </strong>{" "}
          para atualizar os lançamentos.
        </p>
      )}
    </div>
  );
}
