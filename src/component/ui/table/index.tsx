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
    data: any[];
}

export function Table({ columns, data }: TableProps) {
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
        <div className="overflow-x-auto w-full">
            <table className="min-w-[600px] w-full text-left">
                <thead>
                    <tr className="bg-gray-50 text-gray-600 uppercase text-sm leading-normal">
                        {columns.map(column => (
                            <th key={String(column.key)} className="py-3 px-6">{column.title}</th>
                        ))}
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {data.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                            {columns.map((column, columnIndex) => (
                                <td
                                    key={String(column.key)}
                                    className={`py-3 px-6 ${columnIndex === columns.length - 1 ? 'text-center' : ''}`}
                                >
                                    {column.render
                                        ? column.render(item)
                                        : column.formatter
                                        ? column.formatter(item[column.key])
                                        : getValue(item, column.key)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}