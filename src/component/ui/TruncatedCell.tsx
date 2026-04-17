/**
 * Uma linha, reticências quando couber; texto completo no atributo title (hover / foco nativo).
 */
export function TruncatedCell({
  text,
  className = "",
  empty = "—",
}: {
  text: string | null | undefined;
  className?: string;
  empty?: string;
}) {
  const raw = text != null ? String(text).trim() : "";
  const display = raw.length > 0 ? raw : empty;
  const showTitle = raw.length > 0 && raw !== empty;

  return (
    <span
      className={`block truncate text-left align-middle ${className}`}
      title={showTitle ? raw : undefined}
    >
      {display}
    </span>
  );
}
