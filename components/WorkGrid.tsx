import Link from "next/link";
import type { Img } from "@/lib/content";
import { Photo } from "./Photo";
import { Reveal } from "./Reveal";

export type WorkItem = { img: Img; title: string; sub?: string; href: string };

/** Even grid: identical 3:2 frames, identical gaps, captions on the photo. */
export function WorkGrid({ items, priorityCount = 0 }: { items: WorkItem[]; priorityCount?: number }) {
  return (
    <ul className="grid grid-cols-1 gap-g sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, i) => (
        <Reveal as="li" key={it.img.src} delay={(i % 3) * 90}>
          <Link href={it.href} className="group relative block">
            <Photo img={it.img} fill className="aspect-[3/2]" priority={i < priorityCount}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              imgClassName="transition-transform duration-[1.4s] ease-out group-hover:scale-[1.025]" />
            <div className="cap pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/0 to-black/0" />
            <p className="cap eyebrow pointer-events-none absolute inset-x-0 bottom-0 flex justify-between gap-4 p-g text-bone">
              <span>{it.title}</span>
              {it.sub && <span className="hidden text-right opacity-75 sm:inline">{it.sub}</span>}
            </p>
          </Link>
        </Reveal>
      ))}
    </ul>
  );
}
