import Image from "next/image";
import Link from "next/link";
import avatar from "../../../public/Avatar.png";
import logo from "../../../public/logo_branco.png";
import Router from "next/router";

export default function Header({ usuario }) {
  return (
    <header className="h-16 bg-white shadow-md flex justify-between items-center px-2 sm:px-4 md:px-8">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Image src={logo} alt="Logo" width={80} className="sm:w-[100px]" />
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <Link
          href="/manual"
          className="text-gray-600 hover:text-emerald-600 text-sm sm:text-base"
        >
          Sobre
        </Link>
        <button
          className="flex items-center space-x-2"
          onClick={() => Router.push("/perfil")}
        >
          <Image
            src={avatar}
            alt="Avatar do usuário"
            width={36}
            height={36}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full"
          />
        </button>
      </div>
    </header>
  );
}