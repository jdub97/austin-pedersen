import type { Metadata } from "next";
import { WorkGrid } from "@/components/WorkGrid";
import { getSeries, withMeta } from "@/lib/content";

export const metadata: Metadata = {
  title: "Landscape",
  description: "Landscape photography by Austin Pedersen.",
  alternates: { canonical: "/landscape" },
};

export default function LandscapeIndex() {
  const items = getSeries().map((s) => ({ img: withMeta(s.cover), title: s.title, sub: s.location, href: `/landscape/${s.slug}` }));
  return (
    <section className="container-x pt-header">
      <h1 className="sr-only">Landscape</h1>
      <WorkGrid items={items} priorityCount={3} />
    </section>
  );
}
