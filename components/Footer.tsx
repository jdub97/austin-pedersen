import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="container-x flex items-center justify-between gap-g py-g2 text-muted">
      <p className="eyebrow">© {new Date().getFullYear()} {site.name}</p>
      <p className="eyebrow flex gap-g">
        <a href={`mailto:${site.email}`} className="transition-colors hover:text-fg">Email</a>
        <a href={`https://instagram.com/${site.instagram}`} className="transition-colors hover:text-fg">Instagram</a>
      </p>
    </footer>
  );
}
