export interface AiCreditsStatus {
  plan: string;
  period: string;
  premium: boolean;
  aiReady: boolean;
  canUseChat: boolean;
  canUseAnalysis: boolean;
  analyses: { limit: number | null; used: number; remaining: number | null };
  chat: { limit: number | null; used: number; remaining: number | null };
}

export interface CoachResponse {
  resumo: string;
  pontosFortes: string[];
  problemas: string[];
  recomendacoes: string[];
  economiaPotencial: number;
}

export interface ScoreResponse {
  score: number;
  nivel: string;
  explicacao: string;
  dicas?: string[];
  factors?: Record<string, number>;
}

export interface DiagnosticResponse {
  resumo: string;
  alertas: string[];
  categoriasProblematicas: { categoria: string; observacao: string }[];
  tendencias: string[];
}

export type AiActionType =
  | 'create_renda'
  | 'create_divida'
  | 'create_objetivo'
  | 'update_renda'
  | 'update_divida'
  | 'update_objetivo'
  | 'delete_renda'
  | 'delete_divida'
  | 'delete_objetivo'
  | 'mark_divida_paid'
  | 'create_expense_category';

export interface PendingActionInputOption {
  id: number;
  label: string;
}

export interface PendingActionRequiredInput {
  field: 'vinculoId';
  label: string;
  options: PendingActionInputOption[];
}

export interface PendingActionView {
  id: string;
  type: AiActionType;
  summary: string;
  payload: Record<string, unknown>;
  requiredInput?: PendingActionRequiredInput;
}

export interface SharedAccountOption {
  id: number;
  username: string;
}

export interface ChatResponse {
  sessionId: string;
  reply: string;
  tokens: number;
  pendingActions?: PendingActionView[];
  sharedAccounts?: SharedAccountOption[];
}

export interface ConfirmChatResponse {
  reply: string;
  results: {
    id: string;
    type: AiActionType;
    success: boolean;
    message: string;
    entityId?: number;
  }[];
}

export interface AiNotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
