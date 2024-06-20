import {
  FaUser,
  FaMoneyCheckAlt,
  FaChartLine,
  FaDollarSign,
} from "react-icons/fa";
import { DashboardAdminProps, Metrics, Payment } from "@/model/type";
import HeaderAdmin from "@/component/headeradmin";
import MetricCard from "@/component/metriccard";
import PaymentTable from "@/component/paymenttable";
import { formatCurrency } from "@/helper";

export default function DashboardAdmin({
  metrics,
  payments,
}: DashboardAdminProps) {
  const registeredUsers = metrics.registeredUsers || 0;
  const pendingPaymentsCount = metrics.pendingPayments?.count || 0;
  const pendingPaymentsTotal = formatCurrency(metrics.pendingPayments?.total) || "R$ 0,00";
  const approvedPaymentsCount = metrics.approvedPayments?.count || 0;
  const approvedPaymentsTotal = formatCurrency(metrics.approvedPayments?.total) || "R$ 0,00";
  const activePlans = metrics.activePlans || 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <HeaderAdmin />
      <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<FaUser />}
          title="Usuários Registrados"
          value={registeredUsers}
          additional={undefined}
        />
        <MetricCard
          icon={<FaMoneyCheckAlt />}
          title="Pagamentos Pendentes"
          value={pendingPaymentsCount}
          additional={`Total: ${pendingPaymentsTotal}`}
        />
        <MetricCard
          icon={<FaChartLine />}
          title="Pagamentos Aprovados"
          value={approvedPaymentsCount}
          additional={`Total: ${approvedPaymentsTotal}`}
        />
        <MetricCard
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
