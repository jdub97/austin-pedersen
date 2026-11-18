import Image from "next/image";
import type { Img } from "@/lib/content";

type Props = {
  img: Img;
  sizes: string;
  priority?: boolean;
  fill?: boolean;
  className?: string;
  imgClassName?: string;
  meta?: boolean; // show hover metadata overlay
  location?: string;
};

/** next/image with blur placeholder and an optional hover metadata overlay. */
export function Photo({ img, sizes, priority, fill, className = "", imgClassName = "", meta, location }: Props) {
  const placeholder = img.blurDataURL ? "blur" : "empty";
  const pos = /(^|\s)absolute(\s|$)/.test(className) ? "" : "relative";
  return (
    <figure className={`group ${pos} overflow-hidden bg-elev ${className}`}>
      {fill ? (
        <Image src={img.src} alt={img.alt} fill sizes={sizes} priority={priority} quality={75}
          placeholder={placeholder} blurDataURL={img.blurDataURL || undefined} className={`object-cover ${imgClassName}`} />
      ) : (
        <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} priority={priority} quality={75}
          placeholder={placeholder} blurDataURL={img.blurDataURL || undefined} className={`h-auto w-full ${imgClassName}`} />
      )}
      {meta && (img.time || img.light || img.hole || location) && <MetaOverlay img={img} location={location} />}
    </figure>
  );
}

export function MetaOverlay({ img, location }: { img: Img; location?: string }) {
  const parts = [img.hole, location, img.time, img.light].filter(Boolean);
  return (
    <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-12 text-bone opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-within:opacity-100">
      <p className="eyebrow flex flex-wrap gap-x-3 gap-y-1 !text-[0.625rem]">
        {parts.map((p, i) => (
          <span key={i} className={i ? "before:mr-3 before:content-['·'] before:opacity-60" : ""}>{p}</span>
        ))}
      </p>
    </figcaption>
  );
}
