import fs from "node:fs";
import path from "node:path";
import manifest from "@/content/image-manifest.json";

export type Photo = {
  src: string; // path under /public, e.g. /photos/pacific-dunes/01.jpg
  alt: string;
  caption?: string;
  hole?: string; // e.g. "No. 13 — Par 4"
  time?: string; // e.g. "6:42 AM"
  light?: string; // e.g. "Low fog, soft side light"
};

export type Chapter = {
  title: string; // "Morning", "The Holes", "Golden Hour"
  text?: string;
  photos: Photo[];
};

export type Course = {
  slug: string;
  title: string;
  location: string;
  region?: string;
  date: string; // ISO "2025-09" or "2025-09-14"
  architect?: string;
  client?: string;
  coordinates?: [number, number]; // [lat, lng]
  featured?: boolean;
  description: string;
  cover: Photo;
  chapters: Chapter[];
  hero?: string[]; // extra frames for the homepage slideshow (first = cover)
  placeholder?: boolean;
};

export type Series = {
  slug: string;
  title: string;
  location: string;
  date: string;
  featured?: boolean;
  description: string;
  cover: Photo;
  photos: Photo[];
  placeholder?: boolean;
};

export type ImageMeta = { width: number; height: number; blurDataURL: string };

const m = manifest as Record<string, ImageMeta>;

export function imageMeta(src: string): ImageMeta {
  return m[src] ?? { width: 1600, height: 1067, blurDataURL: "" };
}

function readDir<T>(dir: string): T[] {
  const full = path.join(process.cwd(), "content", dir);
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(full, f), "utf8")) as T);
}

const byDateDesc = (a: { date: string }, b: { date: string }) => b.date.localeCompare(a.date);

export function getCourses(): Course[] {
  return readDir<Course>("courses").sort(byDateDesc);
}
export function getCourse(slug: string) {
  return getCourses().find((c) => c.slug === slug);
}
export function getSeries(): Series[] {
  return readDir<Series>("series").sort(byDateDesc);
}
export function getOneSeries(slug: string) {
  return getSeries().find((s) => s.slug === slug);
}
export function allCoursePhotos(c: Course): Photo[] {
  return c.chapters.flatMap((ch) => ch.photos);
}

export function formatDate(d: string) {
  const [y, mo] = d.split("-");
  if (!mo) return y;
  return new Date(Number(y), Number(mo) - 1).toLocaleString("en-US", { month: "long", year: "numeric" });
}

/** A photo resolved with its intrinsic size + blur, safe to pass to client components. */
export type Img = Photo & ImageMeta;
export function withMeta(p: Photo): Img {
  const { width, height, blurDataURL } = imageMeta(p.src);
  return { ...p, width, height, blurDataURL };
}
