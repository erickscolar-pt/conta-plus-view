import type { GetServerSidePropsContext } from "next";
import { setupAPIClient } from "@/services/api";
import type {
  PessoaConectada,
  Transferencia,
  TransferenciasTotais,
} from "@/model/type";

export type ListarTransferenciasParams = {
  periodStart?: string;
  periodEnd?: string;
  direcao?: "todas" | "enviadas" | "recebidas";
  limit?: number;
};

export type CriarTransferenciaPayload = {
  destinatarioId: number;
  valor: number;
  /** ISO `YYYY-MM-DD` */
  data: string;
  descricao?: string;
};

export async function listarPessoasConectadas(
  ctx?: GetServerSidePropsContext,
): Promise<PessoaConectada[]> {
  const api = setupAPIClient(ctx);
  const response = await api.get<{ items: PessoaConectada[] }>(
    "/transferencias/conectados",
  );
  return response.data.items ?? [];
}

export async function listarTransferencias(
  params: ListarTransferenciasParams = {},
  ctx?: GetServerSidePropsContext,
): Promise<{ items: Transferencia[]; totals: TransferenciasTotais }> {
  const api = setupAPIClient(ctx);
  const response = await api.get<{
    items: Transferencia[];
    totals: TransferenciasTotais;
  }>("/transferencias", { params });

  return {
    items: response.data.items ?? [],
    totals:
      response.data.totals ?? { enviadas: 0, recebidas: 0, saldo: 0 },
  };
}

export async function criarTransferencia(
  payload: CriarTransferenciaPayload,
): Promise<Transferencia> {
  const api = setupAPIClient();
  const response = await api.post<Transferencia>("/transferencias", payload);
  return response.data;
}

export async function cancelarTransferencia(
  id: number,
): Promise<Transferencia> {
  const api = setupAPIClient();
  const response = await api.post<Transferencia>(`/transferencias/${id}/cancel`);
  return response.data;
}
