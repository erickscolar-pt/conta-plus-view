import { MdContentPaste } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center m-8">
      <div className="inline-block relative">
        <MdContentPaste
          className="text-gray-300 text-6xl"
          style={{ fontSize: "120px" }}
        />
        <MdContentPaste
          className="text-gray-400 absolute -top-4 -right-4"
          style={{ fontSize: "80px" }}
        />
      </div>
      <span className="mt-4 text-gray-500 text-lg font-medium">
        Nenhum dado encontrado
      </span>
    </div>
  );
}
