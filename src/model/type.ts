// types.ts
export interface Metrics {
  registeredUsers: number;
  pendingPayments: {
    count: number;
    total: number;
  };
  approvedPayments: {
    count: number;
    total: number;
  };
  activePlans: number;
}

export interface Payment {
  id: number;
  user: string;
  amount: number;
  status: string;
}

export interface DashboardAdminProps {
  metrics?: Metrics;
  payments?: Payment[];
}
