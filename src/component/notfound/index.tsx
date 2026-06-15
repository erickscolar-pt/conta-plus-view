import { MdContentPaste } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="m-8 flex flex-col items-center justify-center">
      <div className="relative inline-block">
        <MdContentPaste
          className="text-cp-card-secondary"
          style={{ fontSize: "120px" }}
        />
        <MdContentPaste
          className="absolute -right-4 -top-4 text-cp-subtle"
          style={{ fontSize: "80px" }}
        />
      </div>
      <span className="mt-4 text-lg font-medium text-cp-muted">
        Nenhum dado encontrado
      </span>
    </div>
  );
}
