import { Dividas, Objetivos, Rendas } from '@/model/type';
import React from 'react';

interface Column {
    title: string;
    key: string;
    render?: (item: any) => React.ReactNode;
    formatter?: (value: any) => string;
}

interface TableProps {
    columns: Column[];
    color?: string;
    data: [] | Rendas[] | Dividas[] | Objetivos[];
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
        <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-2">
                <thead>
                    <tr>
                        {columns.map(column => (
                            <th key={String(column.key)} className="text-black text-center text-lg font-bold p-2 rounded-md">{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {columns.map((column, columnIndex) => (
                                <td key={String(column.key)} className="p-2 text-center text-sm font-normal text-white rounded-md " style={{ background: column.render ? 'none' : color || '#FFF' }}>
                                    {column.render ? (
                                        column.render(item)
                                    ) : column.formatter ? (
                                        column.formatter(item[column.key])
                                    ) : (
                                        getValue(item, column.key)
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
