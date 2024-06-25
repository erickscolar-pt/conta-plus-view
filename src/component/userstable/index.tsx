import { formatCurrency, formatDate } from '@/helper';
import { Payment, UserMetric } from '@/model/type';

interface UsersTableProps {
    users: UserMetric[]
}
export default function UsersTable({ users }: UsersTableProps) {

    function isEmail(valid: boolean){
        let validado = ''
        switch (valid) {
            case true:
                validado = 'Sim'
                break;
            case false:
                validado = 'Não'
                break;
            default:
                validado = ''
                break;
            }
            return validado;
    }
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4 text-center">Usuarios Registrados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white hidden md:table">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Nome</th>
                <th className="py-2 px-4 border-b text-left">Username</th>
                <th className="py-2 px-4 border-b text-left">E-mail</th>
                <th className="py-2 px-4 border-b text-left">E-mail verificado</th>
                <th className="py-2 px-4 border-b text-left">Código Recomendação</th>
                <th className="py-2 px-4 border-b text-left">Código Referencia</th>
                <th className="py-2 px-4 border-b text-left">Data de criação</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user,index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{user.nome}</td>
                  <td className="py-2 px-4 border-b">{user.username}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{isEmail(user.emailVerified)}</td>
                  <td className="py-2 px-4 border-b">{user.codigoRecomendacao}</td>
                  <td className="py-2 px-4 border-b">{user.codigoReferencia}</td>
                  <td className="py-2 px-4 border-b">{formatDate(String(user.created_at))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="block md:hidden">
            {users.map((user,index) => (
              <div key={index} className="bg-gray-50 mb-4 p-4 rounded-lg shadow-md">
                <p><span className="font-semibold">Nome:</span> {user.nome}</p>
                <p><span className="font-semibold">Username:</span>{user.username}</p>
                <p><span className="font-semibold">E-mail:</span>{user.email}</p>
                <p><span className="font-semibold">E-mail verificado:</span>{user.emailVerified}</p>
                <p><span className="font-semibold">Código Recomendação:</span>{user.codigoRecomendacao}</p>
                <p><span className="font-semibold">Código Referencia:</span>{user.codigoReferencia}</p>
                <p><span className="font-semibold">Data de criação:</span>{formatDate(String(user.created_at))}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  