import type { Metadata } from "next";
import { Suspense } from "react";
import { InquiryForm } from "@/components/InquiryForm";
import { Photo } from "@/components/Photo";
import { withMeta } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Commissions and image licensing — golf courses, clubs, resorts, architects and brands.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <section className="container-x grid gap-g pt-header md:grid-cols-12">
      <div className="md:col-span-4">
        <Photo img={withMeta({ src: "/photos/about/portrait.jpg", alt: "Placeholder — portrait of Austin Pedersen" })} sizes="(min-width: 768px) 33vw, 100vw" priority fill className="aspect-[4/5]" />
        <h1 className="display mt-g text-3xl leading-none">{site.name}</h1>
        <p className="eyebrow mt-g-half text-muted">Golf courses · Aerial · Renovation · Licensing</p>
        <p className="eyebrow mt-g flex flex-col gap-g-half text-muted sm:flex-row sm:gap-g">
          <a href={`mailto:${site.email}`} className="hover:text-fg">{site.email}</a>
          <a href={`https://instagram.com/${site.instagram}`} className="hover:text-fg">@{site.instagram}</a>
        </p>
      </div>
      <div className="md:col-span-7 md:col-start-6 md:pt-0 pt-g">
        <Suspense>
          <InquiryForm />
        </Suspense>
      </div>
    </section>
  );
}
