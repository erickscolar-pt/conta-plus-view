import type { BillingCycle, BillingPlan, PixPayment, UserSubscription } from "@/services/billing";

export function isPendingPayment(status?: string | null) {
  return String(status || "").toLowerCase() === "pending";
}

export function isApprovedPayment(status?: string | null) {
  return String(status || "").toLowerCase() === "approved";
}

export function isPremiumPlan(code?: string | null) {
  return code === "AI_PREMIUM";
}

export function canSelectFreePlan(subscription: UserSubscription | null) {
  return !isPremiumPlan(subscription?.plan?.code);
}

export function canChangeBillingCycle(
  subscription: UserSubscription | null,
  pending: PixPayment | null,
) {
  if (pending && isPendingPayment(pending.status)) return false;
  return true;
}

export function canUpgradeToPremium(
  subscription: UserSubscription | null,
  pending: PixPayment | null,
) {
  if (pending && isPendingPayment(pending.status)) return false;
  return !isPremiumPlan(subscription?.plan?.code);
}

export function canSwitchPremiumCycle(
  subscription: UserSubscription | null,
  pending: PixPayment | null,
  targetCycle: BillingCycle,
) {
  if (!isPremiumPlan(subscription?.plan?.code)) return false;
  if (pending && isPendingPayment(pending.status)) return false;
  return subscription?.billing_cycle !== targetCycle;
}

export function freePlanBlockedMessage(subscription: UserSubscription | null) {
  if (!subscription?.end_date) {
    return "O plano gratuito será aplicado automaticamente quando seu Premium expirar.";
  }
  return `O plano gratuito será aplicado automaticamente em ${new Date(subscription.end_date).toLocaleDateString("pt-BR")}, após o vencimento do Premium.`;
}

export function planActionLabel(
  plan: BillingPlan,
  subscription: UserSubscription | null,
  billingCycle: BillingCycle,
) {
  const isCurrent =
    plan.code === subscription?.plan?.code &&
    (plan.code === "FREE" || subscription?.billing_cycle === billingCycle);

  if (isCurrent) return "Plano ativo";
  if (plan.code === "FREE") return "Incluso após vencimento";
  if (isPremiumPlan(subscription?.plan?.code) && plan.code === "AI_PREMIUM") {
    return "Alterar ciclo via PIX";
  }
  return "Assinar com PIX";
}

export function isPlanActionDisabled(
  plan: BillingPlan,
  subscription: UserSubscription | null,
  billingCycle: BillingCycle,
  pending: PixPayment | null,
  creating: boolean,
) {
  const isCurrent =
    plan.code === subscription?.plan?.code &&
    (plan.code === "FREE" || subscription?.billing_cycle === billingCycle);

  if (creating) return true;
  if (isCurrent) return true;
  if (plan.code === "FREE") return true;
  if (pending && isPendingPayment(pending.status)) return true;
  if (isPremiumPlan(subscription?.plan?.code) && plan.code === "FREE") return true;
  return false;
}
