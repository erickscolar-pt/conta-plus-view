/**
 * Gera candidatos a nome de usuário (mín. 10 caracteres, alfanumérico + _ e -).
 * Usado no cadastro para não exigir que o usuário invente um @ manualmente.
 */

function normalizeNameToSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 28);
}

function emailLocalPart(email: string): string {
  const local = email.split("@")[0] || "";
  return local.replace(/[^a-z0-9]/gi, "").toLowerCase().slice(0, 14);
}

export function buildUsernameCandidates(nome: string, email: string): string[] {
  const local = emailLocalPart(email);
  const fromName = normalizeNameToSlug(nome);
  const merged = [fromName, local].filter(Boolean).join("_").replace(/_+/g, "_");

  const raw: string[] = [];

  if (merged.length >= 10) raw.push(merged);
  if (fromName.length >= 10) raw.push(fromName);
  if (fromName && local) raw.push(`${fromName}_${local}`);
  if (local.length >= 10) raw.push(local);

  let base = merged || fromName || local || "contaplus";
  let guard = 0;
  while (base.length < 10 && guard++ < 40) {
    base = `${base}_${local || "user"}`;
  }
  if (base.length < 10) {
    base = `${base}_contaplus`.slice(0, 64);
  }
  raw.push(base.slice(0, 64));

  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of raw) {
    const s = c.slice(0, 64);
    if (s.length >= 10 && /^[a-zA-Z0-9_-]+$/.test(s) && !seen.has(s)) {
      seen.add(s);
      out.push(s);
    }
  }
  return out;
}

export async function reserveUniqueUsername(
  nome: string,
  email: string,
  isUsernameAvailable: (username: string) => Promise<boolean>,
): Promise<string> {
  const candidates = buildUsernameCandidates(nome.trim(), email.trim());

  for (const candidate of candidates) {
    if (await isUsernameAvailable(candidate)) {
      return candidate;
    }
  }

  const base =
    normalizeNameToSlug(nome) || emailLocalPart(email) || "usuario";

  for (let i = 0; i < 40; i++) {
    const suffix = `${Date.now()}`.slice(-6) + Math.floor(Math.random() * 1000);
    const attempt = `${base}_${suffix}`.slice(0, 64);
    if (attempt.length >= 10 && (await isUsernameAvailable(attempt))) {
      return attempt;
    }
  }

  throw new Error("Não foi possível gerar um nome de usuário disponível.");
}
