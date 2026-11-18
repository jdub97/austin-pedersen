"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Img } from "@/lib/content";

export type HeroSlide = { img: Img; title: string; location: string; href: string };

const DURATION = 7000;

export function HeroSequence({ slides, children }: { slides: HeroSlide[]; children?: React.ReactNode }) {
  const [i, setI] = useState(0);
  const [mounted, setMounted] = useState(1); // only mount slides as they're needed (saves mobile data)
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) setPaused(true);
  }, []);

  const go = useCallback(
    (n: number) => {
      const next = (n + slides.length) % slides.length;
      setMounted((m) => Math.max(m, Math.min(slides.length, next + 2)));
      setI(next);
    },
    [slides.length]
  );

  useEffect(() => {
    // Preload the next frame shortly after first paint
    const t = setTimeout(() => setMounted((m) => Math.max(m, 2)), 1500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => go(i + 1), DURATION);
    return () => clearTimeout(t);
  }, [i, paused, go]);

  const current = slides[i];

  return (
    <section className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-ink text-bone" aria-roledescription="carousel" aria-label="Selected work">
      {slides.slice(0, mounted).map((s, idx) => (
        <div
          key={s.img.src}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-out ${idx === i ? "opacity-100" : "opacity-0"}`}
          aria-hidden={idx !== i}
        >
          <div key={idx === i ? `on-${i}` : "off"} className={idx === i && !paused ? "kenburns absolute inset-0" : "absolute inset-0"}>
            <Image
              src={s.img.src}
              alt={s.img.alt}
              fill
              priority={idx === 0}
              fetchPriority={idx === 0 ? "high" : "low"}
              sizes="100vw"
              quality={75}
              placeholder={s.img.blurDataURL ? "blur" : "empty"}
              blurDataURL={s.img.blurDataURL || undefined}
              className="object-cover"
            />
          </div>
        </div>
      ))}

      {/* Legibility scrims */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />

      {children && <div className="relative z-10 flex h-full items-end">{children}</div>}

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-x flex items-end justify-between gap-g pb-g">
          <Link href={current.href} className="group block min-w-0" aria-live="polite">
            <p className="eyebrow truncate opacity-70">{current.location}</p>
            <p className="display mt-g-half truncate text-xl leading-none transition-colors group-hover:text-sand md:text-2xl">{current.title}</p>
          </Link>
          <div className="flex shrink-0 items-center gap-g">
            <button onClick={() => go(i - 1)} className="eyebrow hidden opacity-70 hover:opacity-100 sm:inline" aria-label="Previous image">←</button>
            <span className="eyebrow whitespace-nowrap tabular-nums">
              {String(i + 1).padStart(2, "0")} <span className="opacity-50">/ {String(slides.length).padStart(2, "0")}</span>
            </span>
            <button onClick={() => go(i + 1)} className="eyebrow hidden opacity-70 hover:opacity-100 sm:inline" aria-label="Next image">→</button>
            <button onClick={() => setPaused((p) => !p)} className="eyebrow opacity-70 hover:opacity-100" aria-label={paused ? "Play slideshow" : "Pause slideshow"}>
              {paused ? "Play" : "Pause"}
            </button>
          </div>
        </div>
        <div className="h-px w-full bg-bone/15">
          <div key={`${i}-${paused}`} className="h-px bg-sand" style={{ width: paused ? `${((i + 1) / slides.length) * 100}%` : undefined, animation: paused ? undefined : `progress ${DURATION}ms linear both` }} />
        </div>
      </div>
      <style>{`@keyframes progress{from{width:0}to{width:100%}}`}</style>
    </section>
  );
}
