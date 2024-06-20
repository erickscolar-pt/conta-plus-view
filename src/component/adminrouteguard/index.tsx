import { AuthContexts } from '@/contexts/AuthContexts';
import { useRouter } from 'next/router';
import { useEffect, useContext } from 'react';
import { FaExclamationCircle } from 'react-icons/fa'; // Ícone de aviso do react-icons

export default function AdminRouteGuard({ children }){
  const router = useRouter();
  const { usuario } = useContext(AuthContexts);

  useEffect(() => {
    if (!usuario || !usuario.role || usuario.role !== true) {
      router.push('/'); // Redireciona para a página inicial se não for admin
    }
  }, [usuario, router]);

  if (!usuario || !usuario.role || usuario.role !== true) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-500 p-8 rounded-lg shadow-lg text-white flex items-center space-x-4">
          <FaExclamationCircle className="h-6 w-6" />
          <span>Você não tem permissão para acessar esta página.</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};