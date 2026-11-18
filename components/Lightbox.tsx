"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Img } from "@/lib/content";

type Props = { images: Img[]; index: number; onClose: () => void; location?: string; title?: string };

export function Lightbox({ images, index: start, onClose, location, title }: Props) {
  const [i, setI] = useState(start);
  const [dx, setDx] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const n = images.length;
  const go = useCallback((d: number) => { setI((v) => (v + d + n) % n); setDx(0); }, [n]);

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [go, onClose]);

  const img = images[i];
  const meta = [img.hole, location, img.time, img.light].filter(Boolean);

  return (
    <div role="dialog" aria-modal="true" aria-label={title ? `${title} — image viewer` : "Image viewer"} className="fixed inset-0 z-[80] flex flex-col bg-ink/[0.97] text-bone">
      <div className="container-x flex h-16 shrink-0 items-center justify-between">
        <span className="eyebrow tabular-nums opacity-70">{String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
        <button ref={closeRef} onClick={onClose} className="eyebrow opacity-70 hover:opacity-100">Close ✕</button>
      </div>

      <div
        className="relative flex-1 touch-pan-y select-none"
        onTouchStart={(e) => (touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY })}
        onTouchMove={(e) => {
          if (!touch.current) return;
          const ddx = e.touches[0].clientX - touch.current.x;
          if (Math.abs(ddx) > Math.abs(e.touches[0].clientY - touch.current.y)) setDx(ddx);
        }}
        onTouchEnd={() => {
          if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
          else setDx(0);
          touch.current = null;
        }}
      >
        <div className="absolute inset-0 mx-4 md:mx-20" style={{ transform: `translateX(${dx}px)`, transition: dx ? "none" : "transform .3s" }}>
          <Image key={img.src} src={img.src} alt={img.alt} fill sizes="100vw" quality={82}
            placeholder={img.blurDataURL ? "blur" : "empty"} blurDataURL={img.blurDataURL || undefined} className="object-contain" />
        </div>
        {/* Preload neighbours */}
        <div className="hidden" aria-hidden>
          {[images[(i + 1) % n], images[(i - 1 + n) % n]].map((p) => (
            <Image key={p.src} src={p.src} alt="" width={p.width} height={p.height} sizes="100vw" quality={82} />
          ))}
        </div>
        <button onClick={() => go(-1)} className="absolute inset-y-0 left-0 hidden w-20 items-center justify-center text-2xl opacity-50 hover:opacity-100 md:flex" aria-label="Previous image">←</button>
        <button onClick={() => go(1)} className="absolute inset-y-0 right-0 hidden w-20 items-center justify-center text-2xl opacity-50 hover:opacity-100 md:flex" aria-label="Next image">→</button>
      </div>

      <div className="container-x flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-2 py-4">
        <p className="eyebrow flex flex-wrap gap-x-3 opacity-70">
          {meta.map((m, k) => <span key={k}>{k ? "· " : ""}{m}</span>)}
        </p>
        <p className="eyebrow opacity-40 md:hidden">Swipe</p>
        <p className="eyebrow hidden opacity-40 md:block">← → to navigate · Esc to close</p>
      </div>
    </div>
  );
}
