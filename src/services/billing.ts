import { setupAPIClient } from './api';

const api = () => setupAPIClient();

export type BillingPlan = {
  id: number;
  code: string;
  name: string;
  monthly_analysis_limit: number | null;
  monthly_chat_limit: number | null;
  price_cents: number;
  currency: string;
};

export type UserSubscription = {
  id: number;
  status: string;
  start_date: string;
  end_date: string | null;
  plan: BillingPlan;
};

export type PixPayment = {
  id: number;
  usuarioId: number;
  planId: number;
  amount: number;
  status: string;
  provider: string;
  paymentMethod: string;
  description: string | null;
  externalPaymentId: string | null;
  qrCode: string | null;
  qrCodeBase64: string | null;
  expiresAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  plan?: {
    id: number;
    code: string;
    name: string;
    priceCents: number;
  };
  paymentPurpose?: string;
};

export async function fetchBillingPlans() {
  const { data } = await api().get<BillingPlan[]>('/billing/plans');
  return data;
}

export async function fetchMySubscription() {
  const { data } = await api().get<UserSubscription | null>('/billing/me');
  return data;
}

export async function createPlanPixPayment(
  planCode: string,
  payload?: {
    payerEmail?: string;
    payerName?: string;
  },
) {
  const { data } = await api().post<PixPayment>('/billing/pix', {
    planCode,
    ...(payload ?? {}),
  });
  return data;
}

/** @deprecated use createPlanPixPayment('AI_PREMIUM') */
export async function createPremiumPixPayment(payload?: {
  payerEmail?: string;
  payerName?: string;
}) {
  return createPlanPixPayment('AI_PREMIUM', payload);
}

export async function getPixPaymentStatus(paymentId: number) {
  const { data } = await api().get<PixPayment>(`/billing/payments/${paymentId}/status`);
  return data;
}

export async function listBillingPayments(limit = 10) {
  const { data } = await api().get<PixPayment[]>(`/billing/payments?limit=${limit}`);
  return data;
}
