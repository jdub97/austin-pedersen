import Link from "next/link";
import type { Img } from "@/lib/content";
import { Photo } from "./Photo";

/** Full-bleed opening frame with one small caption, inset by the spacing unit. */
export function ProjectHero({ img, title, sub }: { img: Img; title: string; sub: string }) {
  return (
    <header className="relative h-[100svh] min-h-[520px] overflow-hidden bg-ink text-bone">
      <Photo img={img} fill priority sizes="100vw" className="absolute inset-0 !bg-ink" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="absolute inset-g flex flex-col gap-g-half sm:flex-row sm:items-end sm:justify-between sm:gap-g">
        <h1 className="display text-2xl leading-none sm:order-none md:text-3xl">{title}</h1>
        <p className="eyebrow opacity-80 sm:text-right">{sub}</p>
      </div>
    </header>
  );
}

export function NextLink({ href, label }: { href: string; label: string }) {
  return (
    <div className="container-x flex justify-end py-g2">
      <Link href={href} className="eyebrow text-muted transition-colors hover:text-fg">Next — {label} →</Link>
    </div>
  );
}
