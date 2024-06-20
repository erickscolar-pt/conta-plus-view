import { FaUser, FaMoneyCheckAlt, FaChartLine, FaDollarSign } from 'react-icons/fa';
import { DashboardAdminProps, Metrics, Payment } from '@/model/type';
import HeaderAdmin from '@/component/headeradmin';
import MetricCard from '@/component/metriccard';
import PaymentTable from '@/component/paymenttable';
import { formatCurrency } from "@/helper";


export default function DashboardAdmin({ metrics, payments }: DashboardAdminProps) {

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <HeaderAdmin />
      <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard icon={<FaUser />} title="Usuários Registrados" value={metrics.registeredUsers} additional={undefined} />
        <MetricCard icon={<FaMoneyCheckAlt />} title="Pagamentos Pendentes" value={metrics.pendingPayments.count} additional={`Total: ${formatCurrency(metrics.pendingPayments.total)}`} />
        <MetricCard icon={<FaChartLine />} title="Pagamentos Aprovados" value={metrics.approvedPayments.count} additional={`Total: ${formatCurrency(metrics.approvedPayments.total)}`} />
        <MetricCard icon={<FaDollarSign />} title="Planos Ativos" value={metrics.activePlans} additional={undefined} />
      </div>
      <div className="mt-8">
        <PaymentTable payments={payments} />
      </div>
    </div>
  );
}
