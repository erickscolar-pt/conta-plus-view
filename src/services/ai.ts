import { setupAPIClient } from './api';
import type {
  AiCreditsStatus,
  ChatResponse,
  CoachResponse,
  ConfirmChatResponse,
  DiagnosticResponse,
  ScoreResponse,
} from '@/types/ai';

const api = () => setupAPIClient();

export async function fetchAiCredits() {
  const { data } = await api().get<AiCreditsStatus>('/ai/credits');
  return data;
}

export async function runCoach() {
  const { data } = await api().post<CoachResponse>('/ai/coach');
  return data;
}

export async function runDiagnostic() {
  const { data } = await api().post<DiagnosticResponse>('/ai/diagnostic');
  return data;
}

export async function runScore() {
  const { data } = await api().post<ScoreResponse>('/ai/score');
  return data;
}

export async function runProjection() {
  const { data } = await api().post<Record<string, unknown>>('/ai/projection');
  return data;
}

export async function runDebtPlan() {
  const { data } = await api().post<Record<string, unknown>>('/ai/debt-plan');
  return data;
}

export async function sendAiChat(message: string, sessionId?: string) {
  const { data } = await api().post<ChatResponse>('/ai/chat', {
    message,
    sessionId,
  });
  return data;
}

export async function confirmAiChatActions(
  sessionId: string,
  actionIds: string[],
  overrides?: { actionId: string; vinculoId?: number }[],
) {
  const { data } = await api().post<ConfirmChatResponse>('/ai/chat/confirm', {
    sessionId,
    actionIds,
    overrides,
  });
  return data;
}

export async function fetchAiNotifications() {
  const { data } = await api().get('/ai/notifications');
  return data;
}

export async function fetchBillingPlans() {
  const { data } = await api().get('/billing/plans');
  return data;
}
