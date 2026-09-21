import { FormEvent, useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { MdAccountBalance, MdDelete, MdRule } from "react-icons/md";
import { getErrorMessage, setupAPIClient } from "@/services/api";
import type { ITipoDivida } from "@/model/type";

export type BankAccount = {
  id: number;
  bankCode: string;
  bankName: string;
  accountId: string;
  accountType: string;
  nickname: string | null;
  label: string;
  lastImportedAt: string | null;
};

export type ImportRule = {
  id: number;
  padrao: string;
  acao: "categoria" | "transferencia_propria" | "ignorar";
  tipoSaida: string | null;
  nomeEntrada: string | null;
  contaDestinoId: number | null;
  contaDestinoLabel: string | null;
};

const ACTION_LABEL: Record<ImportRule["acao"], string> = {
  categoria: "Categoria",
  transferencia_propria: "Entre minhas contas",
  ignorar: "Ignorar na importação",
};

const SUGGESTED = [
  { padrao: "eletropaulo", acao: "categoria" as const, tipoSaida: "Contas — Luz" },
  { padrao: "grupo a telecom", acao: "categoria" as const, tipoSaida: "Contas — Telefone/Internet" },
  { padrao: "claro", acao: "categoria" as const, tipoSaida: "Contas — Telefone/Internet" },
  { padrao: "condominio", acao: "categoria" as const, tipoSaida: "Moradia" },
  { padrao: "gonn", acao: "categoria" as const, tipoSaida: "Moradia" },
  { padrao: "fatura paga itau", acao: "categoria" as const, tipoSaida: "Cartão de crédito" },
];

export default function ImportSettingsPanel() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [rules, setRules] = useState<ImportRule[]>([]);
  const [tipos, setTipos] = useState<ITipoDivida[]>([]);
  const [loading, setLoading] = useState(true);

  const [nicknameEdits, setNicknameEdits] = useState<Record<number, string>>({});

  const [padrao, setPadrao] = useState("");
  const [acao, setAcao] = useState<ImportRule["acao"]>("categoria");
  const [tipoSaida, setTipoSaida] = useState("Contas — Luz");
  const [contaDestinoId, setContaDestinoId] = useState<number | "">("");

  const [cardName, setCardName] = useState("Itaú Multiplo");
  const [cardCode, setCardCode] = useState("341");
  const [cardId, setCardId] = useState("MULTIPLO");

  const load = useCallback(async () => {
    const api = setupAPIClient();
    try {
      const [accRes, ruleRes, tipoRes] = await Promise.all([
        api.get<BankAccount[]>("/files/accounts"),
        api.get<ImportRule[]>("/files/import-rules"),
        api.get<ITipoDivida[]>("/dividas/types"),
      ]);
      setAccounts(accRes.data);
      setRules(ruleRes.data);
      setTipos(tipoRes.data ?? []);
    } catch {
      /* perfil ainda carrega */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveNickname(id: number) {
    const nickname = (nicknameEdits[id] ?? "").trim();
    try {
      await setupAPIClient().patch(`/files/accounts/${id}`, { nickname });
      toast.success("Apelido atualizado.");
      await load();
    } catch (error) {
      toast.error(getErrorMessage((error as AxiosError).response?.data));
    }
  }

  async function removeAccount(id: number) {
    if (!window.confirm("Remover esta conta das configurações?")) return;
    try {
      await setupAPIClient().delete(`/files/accounts/${id}`);
      await load();
    } catch (error) {
      toast.error(getErrorMessage((error as AxiosError).response?.data));
    }
  }

  async function addCard(e: FormEvent) {
    e.preventDefault();
    try {
      await setupAPIClient().post("/files/accounts", {
        bankCode: cardCode,
        bankName: cardName,
        accountId: cardId,
        accountType: "CREDITCARD",
        nickname: cardName,
      });
      toast.success("Cartão/conta adicionado.");
      await load();
    } catch (error) {
      toast.error(getErrorMessage((error as AxiosError).response?.data));
    }
  }

  async function saveRule(e: FormEvent) {
    e.preventDefault();
    try {
      await setupAPIClient().post("/files/import-rules", {
        padrao,
        acao,
        tipoSaida: acao === "categoria" ? tipoSaida : undefined,
        contaDestinoId:
          acao === "transferencia_propria" && contaDestinoId
            ? Number(contaDestinoId)
            : undefined,
      });
      toast.success("Regra salva. Vale na próxima importação OFX.");
      setPadrao("");
      await load();
    } catch (error) {
      toast.error(getErrorMessage((error as AxiosError).response?.data));
    }
  }

  async function applySuggested(item: (typeof SUGGESTED)[number]) {
    try {
      await setupAPIClient().post("/files/import-rules", item);
      await load();
      toast.success(`Regra “${item.padrao}” aplicada.`);
    } catch (error) {
      toast.error(getErrorMessage((error as AxiosError).response?.data));
    }
  }

  async function removeRule(id: number) {
    try {
      await setupAPIClient().delete(`/files/import-rules/${id}`);
      await load();
    } catch (error) {
      toast.error(getErrorMessage((error as AxiosError).response?.data));
    }
  }

  const fieldClass =
    "rounded-xl border border-white/10 bg-cp-card-secondary/60 px-3 py-2 text-sm text-white focus:border-primary focus:outline-none";

  return (
    <section className="space-y-6 rounded-2xl border border-white/10 bg-cp-card/40 p-6 shadow-sm ring-1 ring-white/5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-dash/20 text-dash">
          <MdAccountBalance size={22} />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-white">Bancos e cartões</h2>
          <p className="mt-1 text-sm text-cp-muted">
            Contas reconhecidas nos extratos OFX. Pix da mesma titularidade
            (Itaú → Nubank) vira transferência entre contas, não despesa.
            Lançamentos do OFX entram como <strong className="text-white/80">pagos</strong>.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-cp-muted">Carregando contas…</p>
      ) : accounts.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-4 text-sm text-cp-muted">
          Nenhuma conta ainda. Importe um OFX do Itaú ou Nubank para ela aparecer aqui.
        </p>
      ) : (
        <ul className="space-y-2">
          {accounts.map((acc) => (
            <li
              key={acc.id}
              className="flex flex-col gap-2 rounded-xl border border-white/10 bg-cp-card-secondary/40 px-4 py-3 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {acc.label}
                </p>
                <p className="text-xs text-cp-muted">
                  {acc.bankName} · {acc.accountType === "CREDITCARD" ? "Cartão" : "Conta"} ·{" "}
                  {acc.accountId}
                  {acc.lastImportedAt
                    ? ` · último OFX ${new Date(acc.lastImportedAt).toLocaleDateString("pt-BR")}`
                    : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  className={`${fieldClass} w-36`}
                  placeholder="Apelido"
                  value={nicknameEdits[acc.id] ?? acc.nickname ?? ""}
                  onChange={(e) =>
                    setNicknameEdits((prev) => ({ ...prev, [acc.id]: e.target.value }))
                  }
                />
                <button
                  type="button"
                  className="rounded-lg bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/15"
                  onClick={() => void saveNickname(acc.id)}
                >
                  Salvar
                </button>
                <button
                  type="button"
                  className="rounded-lg bg-red-500/15 p-2 text-red-300 hover:bg-red-500/25"
                  onClick={() => void removeAccount(acc.id)}
                  title="Remover"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addCard} className="grid gap-2 sm:grid-cols-4">
        <input
          className={fieldClass}
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="Nome do cartão"
        />
        <input
          className={fieldClass}
          value={cardCode}
          onChange={(e) => setCardCode(e.target.value)}
          placeholder="Código banco"
        />
        <input
          className={fieldClass}
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          placeholder="Identificador"
        />
        <button
          type="submit"
          className="rounded-xl bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          Adicionar cartão
        </button>
      </form>

      <div className="flex items-start gap-3 border-t border-white/10 pt-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <MdRule size={22} />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-white">Regras de pagamento</h3>
          <p className="mt-1 text-sm text-cp-muted">
            Defina o que é luz, condomínio, internet ou Pix entre as suas contas.
            A regra mais específica vence na próxima importação.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED.filter((s) => !rules.some((r) => r.padrao.includes(s.padrao))).map(
          (s) => (
            <button
              key={s.padrao}
              type="button"
              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80 hover:bg-white/10"
              onClick={() => void applySuggested(s)}
            >
              + {s.tipoSaida}: {s.padrao}
            </button>
          ),
        )}
      </div>

      <form onSubmit={saveRule} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input
          className={fieldClass}
          value={padrao}
          onChange={(e) => setPadrao(e.target.value)}
          placeholder="Padrão do extrato (ex.: eletropaulo)"
          required
        />
        <select
          className={fieldClass}
          value={acao}
          onChange={(e) => setAcao(e.target.value as ImportRule["acao"])}
        >
          <option value="categoria">Categorizar</option>
          <option value="transferencia_propria">Entre minhas contas</option>
          <option value="ignorar">Ignorar</option>
        </select>
        {acao === "categoria" ? (
          <select
            className={fieldClass}
            value={tipoSaida}
            onChange={(e) => setTipoSaida(e.target.value)}
          >
            {[tipoSaida, ...tipos.map((t) => t.nome)]
              .filter((v, i, arr) => arr.indexOf(v) === i)
              .map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
          </select>
        ) : (
          <select
            className={fieldClass}
            value={contaDestinoId}
            onChange={(e) =>
              setContaDestinoId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">Conta destino (opcional)</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        )}
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          Salvar regra
        </button>
      </form>

      {rules.length > 0 ? (
        <ul className="space-y-2">
          {rules.map((rule) => (
            <li
              key={rule.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-2 text-sm"
            >
              <span className="text-white/90">
                <span className="font-mono text-dash">{rule.padrao}</span>
                {" → "}
                {ACTION_LABEL[rule.acao]}
                {rule.tipoSaida ? ` · ${rule.tipoSaida}` : ""}
                {rule.contaDestinoLabel ? ` · ${rule.contaDestinoLabel}` : ""}
              </span>
              <button
                type="button"
                className="rounded-lg bg-red-500/15 p-2 text-red-300 hover:bg-red-500/25"
                onClick={() => void removeRule(rule.id)}
              >
                <MdDelete size={16} />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
