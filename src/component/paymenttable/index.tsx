export default function PaymentTable({ payments }) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-medium mb-4 text-center">Registros de pagamentos Pendentes e Aprovados</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white hidden md:table">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Usuário</th>
                <th className="py-2 px-4 border-b text-left">Valor</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b">{payment.id}</td>
                  <td className="py-2 px-4 border-b">{payment.user}</td>
                  <td className="py-2 px-4 border-b">{payment.amount}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-white ${payment.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="block md:hidden">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-gray-50 mb-4 p-4 rounded-lg shadow-md">
                <p><span className="font-semibold">ID:</span> {payment.id}</p>
                <p><span className="font-semibold">Usuário:</span> {payment.user}</p>
                <p><span className="font-semibold">Valor:</span> {payment.amount}</p>
                <p>
                  <span className="font-semibold">Status:</span>
                  <span className={`px-2 py-1 ml-2 rounded-full text-white ${payment.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                    {payment.status}
                  </span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  