import Image from "next/image";
import Link from "next/link";
import imgLogo from "../../../public/adaptive-icon.png";

/** Proporção original do arquivo adaptive-icon.png */
const LOGO_WIDTH = 560;
const LOGO_HEIGHT = 503;

type Props = {
  href?: string;
  /**
   * full = tamanho original (560×503)
   * hero / lead / default / compact = mesma imagem, escala proporcional
   */
  size?: "compact" | "default" | "lead" | "hero" | "full";
  className?: string;
};

const sizes: Record<NonNullable<Props["size"]>, string> = {
  compact: "h-9 w-auto",
  default: "h-11 w-auto sm:h-12",
  lead: "h-16 w-auto sm:h-20",
  hero: "h-24 w-auto sm:h-28",
  full: "h-auto w-[560px] max-w-full",
};

export default function BrandLogo({
  href = "/",
  size = "default",
  className = "",
}: Props) {
  const image = (
    <Image
      src={imgLogo}
      alt="Conta+"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={sizes[size]}
      priority={size === "full" || size === "hero"}
    />
  );

  const wrapped = <span className={`inline-flex shrink-0 ${className}`}>{image}</span>;

  if (!href) {
    return wrapped;
  }

  return (
    <Link href={href} className="inline-flex shrink-0 transition hover:opacity-90">
      {wrapped}
    </Link>
  );
}
