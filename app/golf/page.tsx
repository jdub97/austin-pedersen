import type { Metadata } from "next";
import { WorkGrid } from "@/components/WorkGrid";
import { getCourses, withMeta, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Golf",
  description: "Golf course photography by Austin Pedersen.",
  alternates: { canonical: "/golf" },
};

export default function GolfIndex() {
  const items = getCourses().map((c) => ({ img: withMeta(c.cover), title: c.title, sub: `${c.location} · ${formatDate(c.date).split(" ").pop()}`, href: `/golf/${c.slug}` }));
  return (
    <section className="container-x pt-header">
      <h1 className="sr-only">Golf</h1>
      <WorkGrid items={items} priorityCount={3} />
    </section>
  );
}
