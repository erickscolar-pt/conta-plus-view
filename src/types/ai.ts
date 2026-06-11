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

export interface ChatResponse {
  sessionId: string;
  reply: string;
  tokens: number;
}

export interface AiNotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}
