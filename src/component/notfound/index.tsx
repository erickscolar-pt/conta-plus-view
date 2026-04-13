import { MdContentPaste } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <div className="relative inline-block">
        <MdContentPaste
          className="text-slate-700"
          style={{ fontSize: "120px" }}
        />
        <MdContentPaste
          className="absolute -right-4 -top-4 text-slate-500"
          style={{ fontSize: "80px" }}
        />
      </div>
      <span className="mt-4 text-lg font-medium text-slate-500">
        Nenhum dado encontrado
      </span>
    </div>
  );
}
