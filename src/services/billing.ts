import { setupAPIClient } from './api';

const api = () => setupAPIClient();

export type BillingCycle = 'monthly' | 'annual';

export type BillingPlan = {
  id: number;
  code: string;
  name: string;
  monthly_analysis_limit: number | null;
  monthly_chat_limit: number | null;
  price_cents: number;
  annual_price_cents: number | null;
  currency: string;
};

export type UserSubscription = {
  id: number;
  status: string;
  start_date: string;
  end_date: string | null;
  billing_cycle: BillingCycle | null;
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
  billingCycle: BillingCycle;
  createdAt: string;
  updatedAt: string;
  plan?: {
    id: number;
    code: string;
    name: string;
    priceCents: number;
    annualPriceCents: number | null;
  };
  paymentPurpose?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
}

function parseCycle(raw: unknown): BillingCycle {
  return String(raw || 'monthly').toLowerCase() === 'annual' ? 'annual' : 'monthly';
}

export function planPriceForCycle(plan: BillingPlan, cycle: BillingCycle): number {
  if (cycle === 'annual') {
    return plan.annual_price_cents ?? plan.price_cents * 10;
  }
  return plan.price_cents;
}

export function cycleLabel(cycle: BillingCycle): string {
  return cycle === 'annual' ? 'Anual' : 'Mensal';
}

function normalizePlan(raw: unknown): BillingPlan {
  const r = asRecord(raw);
  return {
    id: Number(r.id ?? 0),
    code: String(r.code ?? ''),
    name: String(r.name ?? 'Plano'),
    monthly_analysis_limit:
      r.monthly_analysis_limit === null || r.monthly_analysis_limit === undefined
        ? null
        : Number(r.monthly_analysis_limit),
    monthly_chat_limit:
      r.monthly_chat_limit === null || r.monthly_chat_limit === undefined
        ? null
        : Number(r.monthly_chat_limit),
    price_cents: Number(r.price_cents ?? r.priceCents ?? 0),
    annual_price_cents:
      r.annual_price_cents != null
        ? Number(r.annual_price_cents)
        : r.annualPriceCents != null
          ? Number(r.annualPriceCents)
          : null,
    currency: String(r.currency ?? 'BRL'),
  };
}

function normalizeSubscription(raw: unknown): UserSubscription | null {
  if (!raw) return null;
  const r = asRecord(raw);
  const planRaw = r.plan;
  if (!planRaw) return null;
  return {
    id: Number(r.id ?? 0),
    status: String(r.status ?? 'active'),
    start_date: String(r.start_date ?? r.startDate ?? ''),
    end_date:
      r.end_date != null
        ? String(r.end_date)
        : r.endDate != null
          ? String(r.endDate)
          : null,
    billing_cycle:
      r.billing_cycle != null || r.billingCycle != null
        ? parseCycle(r.billing_cycle ?? r.billingCycle)
        : null,
    plan: normalizePlan(planRaw),
  };
}

function normalizePixPayment(raw: unknown): PixPayment {
  const r = asRecord(raw);
  const planRaw = r.plan;
  return {
    id: Number(r.id ?? 0),
    usuarioId: Number(r.usuarioId ?? r.usuario_id ?? 0),
    planId: Number(r.planId ?? r.plan_id ?? 0),
    amount: Number(r.amount ?? 0),
    status: String(r.status ?? 'pending'),
    provider: String(r.provider ?? ''),
    paymentMethod: String(r.paymentMethod ?? r.payment_method ?? 'PIX'),
    description: r.description != null ? String(r.description) : null,
    externalPaymentId:
      r.externalPaymentId != null
        ? String(r.externalPaymentId)
        : r.external_payment_id != null
          ? String(r.external_payment_id)
          : null,
    qrCode: r.qrCode != null ? String(r.qrCode) : r.qr_code != null ? String(r.qr_code) : null,
    qrCodeBase64:
      r.qrCodeBase64 != null
        ? String(r.qrCodeBase64)
        : r.qr_code_base64 != null
          ? String(r.qr_code_base64)
          : null,
    expiresAt:
      r.expiresAt != null
        ? String(r.expiresAt)
        : r.expires_at != null
          ? String(r.expires_at)
          : null,
    paidAt:
      r.paidAt != null ? String(r.paidAt) : r.paid_at != null ? String(r.paid_at) : null,
    billingCycle: parseCycle(r.billingCycle ?? r.billing_cycle),
    createdAt: String(r.createdAt ?? r.created_at ?? ''),
    updatedAt: String(r.updatedAt ?? r.updated_at ?? ''),
    plan: planRaw
      ? {
          id: Number(asRecord(planRaw).id ?? 0),
          code: String(asRecord(planRaw).code ?? ''),
          name: String(asRecord(planRaw).name ?? ''),
          priceCents: Number(
            asRecord(planRaw).priceCents ?? asRecord(planRaw).price_cents ?? 0,
          ),
          annualPriceCents:
            asRecord(planRaw).annualPriceCents != null
              ? Number(asRecord(planRaw).annualPriceCents)
              : asRecord(planRaw).annual_price_cents != null
                ? Number(asRecord(planRaw).annual_price_cents)
                : null,
        }
      : undefined,
    paymentPurpose:
      r.paymentPurpose != null ? String(r.paymentPurpose) : undefined,
  };
}

export async function fetchBillingPlans() {
  const { data } = await api().get<unknown[]>('/billing/plans');
  return (data ?? []).map(normalizePlan);
}

export async function fetchMySubscription() {
  const { data } = await api().get<unknown>('/billing/me');
  return normalizeSubscription(data);
}

export async function createPlanPixPayment(
  planCode: string,
  payload?: {
    billingCycle?: BillingCycle;
    payerEmail?: string;
    payerName?: string;
  },
) {
  const { data } = await api().post<unknown>('/billing/pix', {
    planCode,
    billingCycle: payload?.billingCycle ?? 'monthly',
    ...(payload ?? {}),
  });
  return normalizePixPayment(data);
}

export async function getPixPaymentStatus(paymentId: number) {
  const { data } = await api().get<unknown>(`/billing/payments/${paymentId}/status`);
  return normalizePixPayment(data);
}

export async function listBillingPayments(limit = 10) {
  const { data } = await api().get<unknown[]>(`/billing/payments?limit=${limit}`);
  return (data ?? []).map(normalizePixPayment);
}

/** @deprecated use createPlanPixPayment('AI_PREMIUM') */
export async function createPremiumPixPayment(payload?: {
  billingCycle?: BillingCycle;
  payerEmail?: string;
  payerName?: string;
}) {
  return createPlanPixPayment('AI_PREMIUM', payload);
}
