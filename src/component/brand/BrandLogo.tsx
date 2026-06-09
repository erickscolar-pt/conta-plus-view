import Image from "next/image";
import Link from "next/link";
import imgLogo from "../../../public/logo_login.png";

type Props = {
  href?: string;
  /** compact = header mobile; default = sidebar; hero = destaque na marca */
  size?: "compact" | "default" | "hero";
  className?: string;
  /** Fundo claro atrás da logo — essencial para o porquinho (olhos e focinho pretos) */
  variant?: "badge" | "plain";
};

const sizes = {
  compact: { w: 120, h: 36, img: "h-8 w-auto", pad: "px-3 py-2" },
  default: { w: 150, h: 44, img: "h-10 w-auto", pad: "px-4 py-2.5" },
  hero: { w: 180, h: 52, img: "h-12 w-auto", pad: "px-5 py-3" },
};

export default function BrandLogo({
  href = "/",
  size = "default",
  className = "",
  variant = "badge",
}: Props) {
  const s = sizes[size];

  const image = (
    <Image
      src={imgLogo}
      alt="Conta+"
      width={s.w}
      height={s.h}
      className={s.img}
      priority
    />
  );

  const wrapped =
    variant === "badge" ? (
      <span
        className={`inline-flex items-center rounded-2xl bg-gradient-to-br from-stone-300/90 via-rose-100/80 to-stone-400/70 shadow-lg shadow-black/25 ring-1 ring-white/15 ${s.pad}`}
      >
        {image}
      </span>
    ) : (
      image
    );

  if (!href) {
    return <span className={className}>{wrapped}</span>;
  }

  return (
    <Link href={href} className={`inline-flex transition hover:opacity-90 ${className}`}>
      {wrapped}
    </Link>
  );
}
