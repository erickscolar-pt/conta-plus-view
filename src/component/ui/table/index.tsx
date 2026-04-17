import React from "react";

interface Column {
  title: string;
  key: string;
  render?: (item: any) => React.ReactNode;
  formatter?: (value: any) => string;
  /** Classes extras no <th> desta coluna */
  headerClassName?: string;
  /** Classes extras no <td> desta coluna */
  cellClassName?: string;
}

interface TableProps {
  columns: Column[];
  color?: string;
  data: any[];
  /** Largura mínima da tabela (tabelas largas: use min-w-[1100px] ou similar) */
  minWidthClassName?: string;
  /** Chave estável por linha (recomendado: id do registro) */
  rowKey?: (item: any, index: number) => string | number;
}

export function Table({
  columns,
  data,
  minWidthClassName = "min-w-[640px]",
  rowKey,
}: TableProps) {
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
    <div
      className="w-full max-w-full overflow-x-auto rounded-xl [-webkit-overflow-scrolling:touch] [scrollbar-color:rgba(71,85,105,0.9)_rgba(15,23,42,0.9)] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600/90 [&::-webkit-scrollbar-thumb]:hover:bg-slate-500 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-900/60"
    >
      <table className={`w-full text-left ${minWidthClassName}`}>
        <thead>
          <tr className="border-b border-white/10 bg-white/5 text-[10px] font-semibold uppercase leading-normal tracking-wide text-slate-400 sm:text-xs">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`whitespace-nowrap px-3 py-2.5 sm:px-5 sm:py-3 ${column.headerClassName ?? ""}`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs font-light text-slate-300 sm:text-sm">
          {data.map((item, index) => (
            <tr
              key={rowKey ? rowKey(item, index) : index}
              className="border-b border-white/5 transition-colors hover:bg-white/5"
            >
              {columns.map((column, columnIndex) => (
                <td
                  key={String(column.key)}
                  className={`align-top px-3 py-2.5 sm:px-5 sm:py-3 ${
                    columnIndex === columns.length - 1 ? "text-center" : ""
                  } ${column.cellClassName ?? ""}`}
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
