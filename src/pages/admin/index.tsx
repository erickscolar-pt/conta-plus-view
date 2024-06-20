import AdminRouteGuard from "@/component/adminrouteguard";
import { AuthContexts } from "@/contexts/AuthContexts";
import { useContext, useEffect } from "react";
import DashboardAdmin from "./dashboard";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { setupAPIClient } from "@/services/api";
import { formatCurrency } from "@/helper";
import { DashboardAdminProps, Metrics, Payment } from "@/model/type";
import { useRouter } from "next/router";
import { FaSpinner } from "react-icons/fa";

export default function Admin({ metrics, payments }: DashboardAdminProps) {
  const { usuario } = useContext(AuthContexts);
  const router = useRouter();

  useEffect(() => {
    if (!usuario || !usuario.role) {
      router.push("/"); // Redireciona se o usuário não for admin
    }
  }, [usuario, router]);

  <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
    <div className="text-xl font-bold text-gray-600">Loading...</div>
    <div className="flex items-center justify-center">
      <FaSpinner className="animate-spin text-4xl text-gray-700" />
    </div>
  </div>;
  return (
    <AdminRouteGuard>
      <DashboardAdmin metrics={metrics} payments={payments} />
    </AdminRouteGuard>
  );
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);

  try {
    const response = await apiClient.get("/dashboard-admin/metrics");
    const {
      totalUsuarios,
      totalPagamentosPendentes,
      somaPagamentosPendentes,
      totalPagamentosAprovados,
      somaPagamentosAprovados,
      totalPlanosAtivos,
      usuariosComPlanos,
    } = response.data;

    const metrics: Metrics = {
      registeredUsers: totalUsuarios,
      pendingPayments: {
        count: totalPagamentosPendentes,
        total: somaPagamentosPendentes,
      },
      approvedPayments: {
        count: totalPagamentosAprovados,
        total: somaPagamentosAprovados,
      },
      activePlans: totalPlanosAtivos,
    };

    const payments: Payment[] = usuariosComPlanos.map((user: any) => ({
      id: user.id,
      user: user.nome,
      amount: user.valorPlano,
      status: user.status,
    }));

    return {
      props: {
        metrics,
        payments,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar os dados do dashboard:", error.message);
    return {
      props: {
        metrics: {
          registeredUsers: 0,
          pendingPayments: { count: 0, total: 0 },
          approvedPayments: { count: 0, total: 0 },
          activePlans: 0,
        },
        payments: [],
      },
    };
  }
});
