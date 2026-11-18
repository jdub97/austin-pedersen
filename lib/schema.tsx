import { site } from "./site";
import type { Course } from "./content";

// schema.org has no "Photographer" type; the standard approach is a Person
// (jobTitle Photographer) linked to a ProfessionalService (a LocalBusiness subtype).
export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${site.url}/#person`,
        name: site.name,
        jobTitle: "Golf Course & Landscape Photographer",
        url: site.url,
        email: `mailto:${site.email}`,
        sameAs: [`https://www.instagram.com/${site.instagram}/`],
        worksFor: { "@id": `${site.url}/#business` },
      },
      {
        "@type": "ProfessionalService",
        "@id": `${site.url}/#business`,
        name: `${site.name} Photography`,
        description: site.description,
        url: site.url,
        email: site.email,
        image: `${site.url}/opengraph-image`,
        founder: { "@id": `${site.url}/#person` },
        areaServed: "Worldwide",
        knowsAbout: ["Golf course photography", "Landscape photography", "Aerial drone photography", "Image licensing"],
      },
    ],
  };
}

export function courseLd(c: Course) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: `${c.title} — ${site.name}`,
    description: c.description,
    url: `${site.url}/golf/${c.slug}`,
    creator: { "@id": `${site.url}/#person` },
    contentLocation: {
      "@type": "GolfCourse",
      name: c.title,
      address: c.location,
      ...(c.coordinates && { geo: { "@type": "GeoCoordinates", latitude: c.coordinates[0], longitude: c.coordinates[1] } }),
    },
    image: c.chapters.flatMap((ch) => ch.photos).slice(0, 10).map((p) => `${site.url}${p.src}`),
  };
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
