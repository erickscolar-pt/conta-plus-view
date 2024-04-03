import React, { useEffect, useState } from 'react';
import styles from './styles.module.scss'; // Importe o arquivo de estilos CSS
import { ButtonPages } from '../buttonPages';

interface CalendarProps {
    onDateSelect: (date: Date) => void;
}
export default function Calendar({onDateSelect}:CalendarProps) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [selectedYear, setSelectedYear] = useState(0);
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const toggleCalendar = () => {
        setIsVisible(!isVisible);
    };

    const handleDateSelect = (day) => {
        const date = new Date();

        date.setDate(day);
        date.setMonth(selectedMonth);
        date.setFullYear(selectedYear);

        setSelectedDay(day);
        setSelectedDate(`${day < 10 ? '0'+day : day}/${selectedMonth < 10 ? '0'+selectedMonth : selectedMonth}/${selectedYear}`);
        onDateSelect(date)
    };



    const handlePrevMonth = () => {
        let newMonth = selectedMonth - 1;
        let newYear = selectedYear;

        if (newMonth < 1) {
            newMonth = 12;
            newYear--;
        }

        setSelectedMonth(newMonth);
        setSelectedYear(newYear);
    };

    const renderDays = () => {
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        const days = [];
        const startingDayOfWeek = new Date(selectedYear, selectedMonth - 1, 1).getDay();

        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<span key={`empty-${i}`} className={styles.emptyDay}></span>);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const isSelected = i === selectedDay;
            const dayClass = isSelected ? `${styles.day} ${styles.selected}` : styles.day;

            days.push(
                <button key={i} onClick={() => handleDateSelect(i)} className={dayClass}>
                    {i}
                </button>
            );
        }

        return days;
    };

    const getDaysInMonth = (month, year) => {
        return new Date(year, month, 0).getDate();
    };

    const getMonthName = (month) => {
        const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return months[month - 1];
    };

    const renderMonths = () => {
        const months = [];

        for (let i = 1; i <= 12; i++) {
            months.push(<option key={i} value={i}>{getMonthName(i)}</option>);
        }

        return months;
    };



    const renderYears = () => {
        const years = [];
        const currentYear = new Date().getFullYear();

        for (let i = currentYear - 10; i <= currentYear + 50; i++) {
            years.push(<option key={i} value={i}>{i}</option>);
        }

        return years;
    };

    return (
        <div className={styles.calendar}>
            <input type="text" onFocus={toggleCalendar} placeholder="Selecione a data" defaultValue={selectedDate || ''} />
            {isVisible && (
                <div className={styles.container}>
                    <div className={styles.header}>
                        <select value={selectedMonth} onChange={(e) => setSelectedMonth(+e.target.value)}>
                            {renderMonths()}
                        </select>
                        <select value={selectedYear} onChange={(e) => setSelectedYear(+e.target.value)}>
                            {renderYears()}
                        </select>
                    </div>
                    <div className={styles.weekdays}>
                        <span>D</span>
                        <span>S</span>
                        <span>T</span>
                        <span>Q</span>
                        <span>Q</span>
                        <span>S</span>
                        <span>S</span>
                    </div>
                    <div className={styles.days}>
                        {renderDays()}
                    </div>
                    <ButtonPages style={{marginTop: '1em'}} onClick={() => toggleCalendar()}>Selecionar</ButtonPages>
                </div>
            )}
        </div>
    );
};

