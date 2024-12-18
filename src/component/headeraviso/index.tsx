import Link from "next/link";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContexts } from "@/contexts/AuthContexts";

export default function HeaderAviso() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-primary border rounded-xl text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-2xl font-bold flex items-center space-x-2"
        >
          <FaHome />
          <span>Voltar</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center space-x-4">
        <nav className="flex space-x-4">
          <Link
            href="/politicadeprivacidade"
            className="flex items-center space-x-1"
          >
            <span>Política de Privacidade</span>
          </Link>
          <Link href="/termosdeuso" className="flex items-center space-x-1">
            <span>Termos de Uso</span>
          </Link>
          <Link
            href="/politicadecookies"
            className="flex items-center space-x-1"
          >
            <span>Política de Cookies</span>
          </Link>
          <Link
            href="/tecnologiasderastreamento"
            className="flex items-center space-x-1"
          >
            <span>Tecnologias de Rastreamento</span>
          </Link>
          <Link
            href="/manual"
            className="flex items-center space-x-1"
          >
            <span>Sobre Conta Plus</span>
          </Link>

          <Link
            href="/importreport"
            className="flex items-center space-x-1"
          >
            <span>Excel</span>
          </Link>
        </nav>
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-2xl">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-primary border-t border-gray-700 rounded-b-xl md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            <Link
              href="/politicadeprivacidade"
              className="flex items-center space-x-1"
            >
              <span>Política de Privacidade</span>
            </Link>
            <Link href="/termosdeuso" className="flex items-center space-x-1">
              <span>Termos de Uso</span>
            </Link>
            <Link
              href="/politicadecookies"
              className="flex items-center space-x-1"
            >
              <span>Política de Cookies</span>
            </Link>
            <Link
              href="/tecnologiasderastreamento"
              className="flex items-center space-x-1"
            >
              <span>Tecnologias de Rastreamento</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
