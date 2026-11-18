import type { MetadataRoute } from "next";
import { getCourses, getSeries } from "@/lib/content";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = ["", "/golf", "/landscape", "/contact"].map((p) => ({
    url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8,
  }));
  const courses = getCourses().map((c) => ({ url: `${site.url}/golf/${c.slug}`, images: [`${site.url}${c.cover.src}`], priority: 0.7 }));
  const series = getSeries().map((s) => ({ url: `${site.url}/landscape/${s.slug}`, images: [`${site.url}${s.cover.src}`], priority: 0.6 }));
  return [...base, ...courses, ...series];
}
