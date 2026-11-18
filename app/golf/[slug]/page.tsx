import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PhotoSequence } from "@/components/PhotoSequence";
import { ProjectHero, NextLink } from "@/components/ProjectHero";
import { getCourse, getCourses, withMeta, formatDate, allCoursePhotos } from "@/lib/content";
import { JsonLd, courseLd } from "@/lib/schema";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const c = getCourse((await params).slug);
  if (!c) return {};
  return {
    title: `${c.title}, ${c.location}`,
    description: c.description,
    alternates: { canonical: `/golf/${c.slug}` },
    openGraph: { title: `${c.title} — Austin Pedersen`, description: c.description, images: [{ url: c.cover.src, alt: c.cover.alt }] },
  };
}

export default async function CoursePage({ params }: Params) {
  const { slug } = await params;
  const c = getCourse(slug);
  if (!c) notFound();
  // Real courses link to real courses; placeholders cycle among themselves
  const all = getCourses().filter((x) => !!x.placeholder === !!c.placeholder);
  const next = all[(all.findIndex((x) => x.slug === slug) + 1) % all.length];
  return (
    <article>
      <JsonLd data={courseLd(c)} />
      <ProjectHero img={withMeta(c.cover)} title={c.title} sub={`${c.location} · ${formatDate(c.date).split(" ").pop()}`} />
      <section className="container-x pt-g">
        <PhotoSequence photos={allCoursePhotos(c).map(withMeta)} location={c.location} title={c.title} />
      </section>
      <NextLink href={`/golf/${next.slug}`} label={next.title} />
    </article>
  );
}
