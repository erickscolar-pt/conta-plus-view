import Link from "next/link";

export default function FloatingButton() {
  return (
    <div className="fixed bottom-4 right-4">
      <Link
        href="/manual"
        className="
                bg-blue-600 
                text-white 
                font-bold 
                py-2 
                px-4 
                rounded-full 
                shadow-lg 
                hover:bg-blue-700 
                transition 
                duration-300 
                ease-in-out
              "
      >
        Sobre
      </Link>
    </div>
  );
}
