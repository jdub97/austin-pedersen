import { HeroSequence, type HeroSlide } from "@/components/HeroSequence";
import { WorkGrid } from "@/components/WorkGrid";
import { getCourses, getSeries, withMeta, allCoursePhotos } from "@/lib/content";

export default function Home() {
  const courses = getCourses();
  const series = getSeries();
  // Slideshow: each featured course's hero frames, interleaved course by course
  const featured = courses.filter((c) => c.featured);
  const lists = featured.map((c) =>
    (c.hero ?? [c.cover.src]).map((src) => ({ img: withMeta({ src, alt: `${c.title}, ${c.location}` }), title: c.title, location: c.location, href: `/golf/${c.slug}` }))
  );
  const slides: HeroSlide[] = [];
  for (let i = 0; i < Math.max(...lists.map((l) => l.length)); i++) lists.forEach((l) => l[i] && slides.push(l[i]));
  // Grid: a selection of real landscape frames, interleaved across courses, in rows of three.
  // (Placeholder courses/series stay off the homepage.)
  const pools = featured
    .filter((c) => !c.placeholder)
    .map((c) =>
      allCoursePhotos(c)
        .map(withMeta)
        .filter((p) => p.width > p.height && !(c.hero ?? []).includes(p.src))
        .map((img) => ({ img, title: c.title, sub: c.location, href: `/golf/${c.slug}` }))
    );
  const picks: { img: ReturnType<typeof withMeta>; title: string; sub: string; href: string }[] = [];
  for (let i = 0; picks.length < 12 && pools.some((p) => p[i * 3]); i++) pools.forEach((p) => p[i * 3] && picks.length < 12 && picks.push(p[i * 3]));
  const work = picks.slice(0, Math.floor(picks.length / 3) * 3);
  void series;
  return (
    <>
      <h1 className="sr-only">Austin Pedersen — golf course and landscape photography</h1>
      <HeroSequence slides={slides} />
      <section className="container-x pt-g" aria-label="Work">
        <WorkGrid items={work} />
      </section>
    </>
  );
}
