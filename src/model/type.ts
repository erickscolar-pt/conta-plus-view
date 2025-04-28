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
  usersActives: UserMetric[];
}

export interface UserMetric {
  created_at: Date;
  nome: string;
  username: string;
  email: string;
  codigoReferencia: string;
  codigoRecomendacao: string;
  emailVerified: boolean;
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

export interface Rendas {
  id: number;
  nome_renda: string;
  valor: number;
  valor_pagamento_vinculo: number;
  data_inclusao: string;
  vinculo_id?: number;
  vinculo?: ContaVinculo
}
export interface Dividas {
  id: number;
  nome_divida: string;
  valor: number;
  valor_debito_vinculo: number;
  quantoVouPagar: number;
  data_inclusao: string;
  username?: string;
  vinculo_id?: number;
  is_edit?: boolean;
  vinculo?: ContaVinculo
  ref_debt?: number;
  payment?: boolean;
  installments?: number;
  n_installments?: number;
  plot?: string;
  tipo_divida_id?: number;
}
export interface Objetivos {
  id: number;
  nome_objetivo: string;
  valor: number;
  meta_valor_vinculo: number;
  data_inclusao: string;
  vinculo_id?: number;
  vinculo?: ContaVinculo
}

export interface ContaVinculo {
  id: number;
  id_usuario_vinculado: number;
  usuario_id: number;
  codigo_vinculado: string;
  tipo_calculo: string;
  valor: number;
  username: string;
}

export interface Usuario {
  id: number;
  nome: string;
  username: string;
  codigoRecomendacao: string;
  codigoReferencia: string;
  email: string;
  created_at: string;
  updated_at: string;
  dividas: Dividas[];
  rendas: Rendas[];
  objetivos: Objetivos[];
  contavinculo: ContaVinculo[];
  emailVerified: boolean
  acceptMail: boolean
}

export interface Plano {
  id: number;
  usuario_id: number;
  plano_id: number;
  payment_id: string;
  status: string;
  expiry_date: Date;
  plan_duration: string;
  created_at: Date;
  updated_at: Date;
}

export interface ITipoDivida {
  id: number;
  nome: string;
  createdAt: string;
  updatedAt: string;
}
