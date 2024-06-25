import { useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  FaUser,
  FaMoneyCheckAlt,
  FaChartLine,
  FaDollarSign,
} from 'react-icons/fa';
import HeaderAdmin from '@/component/headeradmin';
import MetricCardAdmin from '@/component/metriccardadmin';
import PaymentTable from '@/component/paymenttable';
import { DashboardAdminProps, Metrics, Payment } from '@/model/type';
import { formatCurrency } from '@/helper';

export default function DashboardAdmin({
  metrics,
  payments,
}: DashboardAdminProps) {
  const router = useRouter();

  useEffect(() => {
    // Verifica se os dados de metrics são válidos, caso contrário, redireciona
    if (!metrics || !metrics.registeredUsers) {
      router.push('/'); // Redireciona para a página inicial se metrics não estiver definido corretamente
    }
  }, [metrics, router]);

  // Se metrics ainda não estiver carregado, exibe um componente de carregamento
  if (!metrics || !metrics.registeredUsers) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="text-xl font-bold text-gray-600">Loading...</div>
      </div>
    );
  }

  // Extrai valores de metrics ou define valores padrão se estiverem ausentes
  const registeredUsers = metrics.registeredUsers || 0;
  const pendingPaymentsCount = metrics.pendingPayments?.count || 0;
  const pendingPaymentsTotal =
    formatCurrency(metrics.pendingPayments?.total) || 'R$ 0,00';
  const approvedPaymentsCount = metrics.approvedPayments?.count || 0;
  const approvedPaymentsTotal =
    formatCurrency(metrics.approvedPayments?.total) || 'R$ 0,00';
  const activePlans = metrics.activePlans || 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <HeaderAdmin />
      <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCardAdmin
          icon={<FaUser />}
          title="Usuários Registrados"
          value={registeredUsers}
          additional={undefined}
        />
        <MetricCardAdmin
          icon={<FaMoneyCheckAlt />}
          title="Pagamentos Pendentes"
          value={pendingPaymentsCount}
          additional={`Total: ${pendingPaymentsTotal}`}
        />
        <MetricCardAdmin
          icon={<FaChartLine />}
          title="Pagamentos Aprovados"
          value={approvedPaymentsCount}
          additional={`Total: ${approvedPaymentsTotal}`}
        />
        <MetricCardAdmin
          icon={<FaDollarSign />}
          title="Planos Ativos"
          value={activePlans}
          additional={undefined}
        />
      </div>
      <div className="mt-8">
        <PaymentTable payments={payments} />
      </div>
    </div>
  );
}
