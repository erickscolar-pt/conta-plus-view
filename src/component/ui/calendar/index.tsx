import React, { useEffect, useState } from 'react';

interface CalendarProps {
    onDateSelect: (date: Date, type?: 'day' | 'month') => void;
    type?: 'day' | 'month';
    hideType?: boolean;
    hideButton?: boolean;
    textButton?: string;
    colorButton?: string;
}

export default function Calendar({
    colorButton = '#14b8a6',
    textButton,
    onDateSelect,
    hideType = false,
    hideButton = false,
    type,
}: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedType, setSelectedType] = useState<'day' | 'month'>(type || 'day');

    const handleSelectType = (t: 'day' | 'month') => {
        setSelectedType(t);
        setSelectedDate('');
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
        setSelectedType(type || 'day');
        setSelectedDate('');
    }, [type]);

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full">
            {!hideType && (
                <div className="flex flex-row gap-2 w-full sm:w-auto">
                    <button
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors ${
                            selectedType === 'day'
                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                : 'bg-white/10 text-slate-300 hover:bg-white/15'
                        }`}
                        onClick={() => handleSelectType('day')}
                        type="button"
                    >
                        Por Dia
                    </button>
                    <button
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors ${
                            selectedType === 'month'
                                ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                                : 'bg-white/10 text-slate-300 hover:bg-white/15'
                        }`}
                        onClick={() => handleSelectType('month')}
                        type="button"
                    >
                        Por Mês
                    </button>
                </div>
            )}
            <div className="w-full sm:w-auto">
                <input
                    type={selectedType === 'day' ? 'date' : 'month'}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 py-2.5 pl-4 pr-4 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 [color-scheme:dark]"
                />
            </div>
            {!hideButton && (
                <button
                    className="w-full rounded-xl px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 sm:w-auto"
                    style={{ background: colorButton }}
                    onClick={handleSelectDate}
                    type="button"
                >
                    {textButton || 'Filtrar'}
                </button>
            )}
        </div>
    );
}