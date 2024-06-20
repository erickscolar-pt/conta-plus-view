import Link from "next/link";
import {
  FaUserCircle,
  FaSignOutAlt,
  FaHome,
  FaChartPie,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useContext, useState } from "react";
import { AuthContexts } from "@/contexts/AuthContexts";

export default function HeaderAdmin() {
  const { usuario, signOut } = useContext(AuthContexts);

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
          <span>Dashboard</span>
        </Link>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <nav className="flex space-x-4">
          <Link className="flex items-center space-x-1" href="/perfil">
            <FaUserCircle />
            <span>Perfil</span>
          </Link>
        </nav>
        <span className="flex items-center space-x-1">
          <span>Olá {usuario.name}</span>
        </span>
        <button
          onClick={() => signOut()}
          className="flex items-center space-x-1 bg-red-400 hover:bg-red-700 text-white px-3 py-2 rounded"
        >
          <FaSignOutAlt />
        </button>
      </div>
      <div className="md:hidden flex items-center">
        <button onClick={toggleMenu} className="text-2xl">
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-primary border-t border-gray-700 rounded-b-xl md:hidden">
          <nav className="flex flex-col space-y-4 p-4">
            <span className="flex items-center space-x-1">
              <span>Olá {usuario.name}</span>
            </span>
            <Link className="flex items-center space-x-1" href="/perfil">
              <FaUserCircle />
              <span>Perfil</span>
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-1 bg-red-400 hover:bg-red-700 text-white px-3 py-2 rounded"
            >
              <FaSignOutAlt />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
