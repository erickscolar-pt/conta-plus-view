import React from 'react';
import styles from './styles.module.scss'; // Importe o arquivo de estilos CSS
import { Rendas } from '@/type';

interface Column {
    title: string;
    key: string;
    render?: (item: any) => React.ReactNode;
    formatter?: (value: any) => string;
}

interface TableProps {
    columns: Column[];
    color?: string;
    data: [] | Rendas[];
}

export function Table({ columns, data, color }: TableProps) {
    const getValue = (object: any, path: string) => {
        const keys = path.split('.');
        let value = object;
        for (const key of keys) {
            if (value && typeof value === 'object') {
                value = value[key];
            } else {
                return '-';
            }
        }
        return value === undefined ? '-' : value;
    };
    return (
        <table className={styles.table}>
            <thead>
                <tr>
                    {columns.map(column => (
                        <th key={String(column.key)} className={styles.headerCell}>{column.title}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => (
                        <tr key={index}  >
                            {columns.map((column, columnIndex) => (
                                <td key={String(column.key)} className={styles.dataCell} style={{ background: column.render ? 'none' : color || '#FFF', boxShadow: column.render ? 'none' : '0px 4px 4px 0px rgba(0, 0, 0, 0.25)' }}>
                                    {column.render ? (
                                        column.render ? column.render(item) : String(item[column.key])
                                    ) : column.formatter ? (
                                        column.formatter(item[column.key])
                                    ) : (
                                        //item[column.key] === undefined ? '-' : String(item[column.key]) 
                                        getValue(item, column.key)
                                    )}
                                </td>
                            ))}
                        </tr>
                ))}
            </tbody>
        </table>
    );
};
