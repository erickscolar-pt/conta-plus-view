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
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => handleSelectType('day')}
                        type="button"
                    >
                        Por Dia
                    </button>
                    <button
                        className={`flex-1 sm:flex-none px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors ${
                            selectedType === 'month'
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => handleSelectType('month')}
                        type="button"
                    >
                        Por Mês
                    </button>
                </div>
            )}
            <div className="relative w-full sm:w-auto">
                <input
                    type={selectedType === 'day' ? 'date' : 'month'}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>
            {!hideButton && (
                <button
                    className="w-full sm:w-auto px-6 py-2 bg-teal-500 text-white rounded-lg shadow-sm hover:bg-teal-600"
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