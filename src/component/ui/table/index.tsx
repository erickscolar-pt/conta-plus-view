import React from "react";

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
    const keys = path.split(".");
    let value = object;
    for (const key of keys) {
      if (value && typeof value === "object") {
        value = value[key];
      } else {
        return "-";
      }
    }
    return value === undefined ? "-" : value;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-[600px] w-full text-left">
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-xs font-semibold uppercase leading-normal tracking-wide text-slate-400">
            {columns.map((column) => (
              <th key={String(column.key)} className="px-6 py-3">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-sm font-light text-slate-300">
          {data.map((item, index) => (
            <tr
              key={index}
              className="border-b border-white/5 transition-colors hover:bg-white/5"
            >
              {columns.map((column, columnIndex) => (
                <td
                  key={String(column.key)}
                  className={`px-6 py-3 ${
                    columnIndex === columns.length - 1 ? "text-center" : ""
                  }`}
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
