type Props = {
  password: string;
};

const RULES = [
  { key: "len", label: "8+ caracteres", test: (p: string) => p.length >= 8 },
  { key: "upper", label: "1 letra maiúscula", test: (p: string) => /[A-Z]/.test(p) },
  { key: "num", label: "1 número", test: (p: string) => /\d/.test(p) },
  { key: "special", label: "1 caractere especial", test: (p: string) => /[!@#$%^&*]/.test(p) },
] as const;

function score(password: string) {
  return RULES.filter((r) => r.test(password)).length;
}

export function isPasswordValid(password: string) {
  return score(password) === RULES.length;
}

export default function PasswordStrength({ password }: Props) {
  const points = score(password);
  const pct = password ? (points / RULES.length) * 100 : 0;
  const barColor =
    points <= 1 ? "bg-red-500" : points <= 2 ? "bg-amber-500" : points <= 3 ? "bg-yellow-400" : "bg-primary";

  return (
    <div className="space-y-3 rounded-xl border border-white/[0.06] bg-cp-base/50 p-4">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-cp-muted">Força da senha</span>
        <span className={points === 4 ? "text-primary" : "text-cp-subtle"}>
          {password ? (points === 4 ? "Forte" : points >= 2 ? "Média" : "Fraca") : "—"}
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="grid gap-1.5 sm:grid-cols-2">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.key}
              className={`flex items-center gap-2 text-xs ${ok ? "text-primary" : "text-cp-subtle"}`}
            >
              <span
                className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] ${
                  ok ? "bg-primary/20" : "bg-white/[0.06]"
                }`}
              >
                {ok ? "✓" : "·"}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
