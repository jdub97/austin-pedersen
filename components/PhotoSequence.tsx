"use client";
import { useState } from "react";
import type { Img } from "@/lib/content";
import { Photo } from "./Photo";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";

type Block = { kind: "wide" | "pair"; items: number[]; aspect: string };

/**
 * Calm, even rhythm: a full-width landscape, then a matched pair, repeating.
 * Portraits are paired with the next portrait (4:5); two landscapes pair at 3:2.
 * Every gap is the same --g unit.
 */
function layout(photos: Img[]): Block[] {
  const isP = (i: number) => photos[i].height > photos[i].width;
  const queue = photos.map((_, i) => i);
  const blocks: Block[] = [];
  let wantWide = true;
  const take = (i: number) => queue.splice(queue.indexOf(i), 1)[0];
  while (queue.length) {
    const i = queue[0];
    if (wantWide && !isP(i)) { blocks.push({ kind: "wide", items: [take(i)], aspect: "aspect-[3/2]" }); wantWide = false; continue; }
    if (queue.length === 1) { blocks.push(isP(i) ? { kind: "pair", items: [take(i)], aspect: "aspect-[4/5]" } : { kind: "wide", items: [take(i)], aspect: "aspect-[3/2]" }); break; }
    if (isP(i)) {
      const mate = queue.slice(1, 6).find(isP) ?? queue[1];
      blocks.push({ kind: "pair", items: [take(i), take(mate)], aspect: "aspect-[4/5]" });
    } else {
      const mate = queue.slice(1, 6).find((j) => !isP(j)) ?? queue[1];
      blocks.push({ kind: "pair", items: [take(i), take(mate)], aspect: isP(mate) ? "aspect-[4/5]" : "aspect-[3/2]" });
    }
    wantWide = true;
  }
  return blocks;
}

export function PhotoSequence({ photos, location, title }: { photos: Img[]; location?: string; title?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const cell = (i: number, sizes: string, aspect: string) => (
    <button key={photos[i].src} onClick={() => setOpen(i)} className="block w-full cursor-zoom-in" aria-label={`Open image: ${photos[i].alt}`}>
      <Photo img={photos[i]} sizes={sizes} meta location={location} fill className={aspect} />
    </button>
  );
  return (
    <>
      <div className="space-g">
        {layout(photos).map((b, bi) => (
          <Reveal key={bi}>
            {b.kind === "wide" ? (
              cell(b.items[0], "100vw", b.aspect)
            ) : (
              <div className="grid grid-cols-2 gap-g">
                {b.items.length === 1 ? (
                  <div className="col-span-2 mx-auto w-[calc(50%-var(--g)/2)]">{cell(b.items[0], "50vw", b.aspect)}</div>
                ) : (
                  b.items.map((i) => cell(i, "50vw", b.aspect))
                )}
              </div>
            )}
          </Reveal>
        ))}
      </div>
      {open !== null && <Lightbox images={photos} index={open} onClose={() => setOpen(null)} location={location} title={title} />}
    </>
  );
}
