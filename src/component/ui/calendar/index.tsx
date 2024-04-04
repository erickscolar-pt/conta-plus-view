import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss';
import { ButtonPages } from '../buttonPages';

interface CalendarProps {
    onDateSelect: (date: Date, type?: 'day' | 'month') => void;
    type?: 'day' | 'month';
    hideType?: boolean;
    hideButton?: boolean;
    textButton?: string;
    colorButton?:string;
}

export default function Calendar({ colorButton = '#0E5734' ,textButton ,onDateSelect, hideType = false, hideButton = false, type }: CalendarProps) {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedType, setSelectedType] = useState<'day' | 'month'>(type);

    const handleSelectType = (type: 'day' | 'month') => {
        setSelectedType(type);
        type === type
        setSelectedDate('');
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleSelectDate = () => {
        const date = new Date(selectedDate);
        onDateSelect(date, selectedType);
    };

    useEffect(() => {
        const date = new Date()
        const formattedDate = date.toISOString().split('T')[0] + 'T03:00:00Z';
        setSelectedType(type)
        setSelectedDate(formattedDate)
    }, []);

    return (
        <div className={styles.calendar}>
            {!hideType &&
                <div className={styles.filter}>
                    <button
                        className={`${styles.filterButton}`}
                        style={{ background: selectedType === 'day' ? colorButton : '#FFF', color: selectedType === 'day' ?  '#FFF'  : colorButton }}
                        onClick={() => handleSelectType('day')}
                    >
                        Por Dia
                    </button>
                    <button
                        className={`${styles.filterButton}`}
                        style={{ background: selectedType === 'month' ? colorButton : '#FFF', color: selectedType === 'month' ?  '#FFF'  : colorButton }}
                        onClick={() => handleSelectType('month')}
                    >
                        Por Mês
                    </button>
                </div>
            }

            {selectedType === 'day'  ? (
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={styles.input}
                />
            ) : (
                <input
                    type="month"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className={styles.input}
                />
            )}
            {!hideButton &&

            <ButtonPages bg={colorButton} onClick={handleSelectDate}>{textButton ? textButton : 'Selecionar'}</ButtonPages>
            }
        </div>
    );
}
