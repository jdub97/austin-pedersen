import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoSequence } from "@/components/PhotoSequence";
import { ProjectHero, NextLink } from "@/components/ProjectHero";
import { getOneSeries, getSeries, withMeta, formatDate } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getSeries().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const s = getOneSeries((await params).slug);
  if (!s) return {};
  return {
    title: `${s.title} — Landscape`,
    description: s.description,
    alternates: { canonical: `/landscape/${s.slug}` },
    openGraph: { title: s.title, description: s.description, images: [{ url: s.cover.src, alt: s.cover.alt }] },
  };
}

export default async function SeriesPage({ params }: Params) {
  const { slug } = await params;
  const s = getOneSeries(slug);
  if (!s) notFound();
  const all = getSeries();
  const next = all[(all.findIndex((x) => x.slug === slug) + 1) % all.length];
  return (
    <article>
      <ProjectHero img={withMeta(s.cover)} title={s.title} sub={`${s.location} · ${formatDate(s.date).split(" ").pop()}`} />
      <section className="container-x pt-g">
        <PhotoSequence photos={s.photos.slice(1).map(withMeta)} location={s.location} title={s.title} />
      </section>
      <NextLink href={`/landscape/${next.slug}`} label={next.title} />
    </article>
  );
}
