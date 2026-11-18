"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Pages that open on a full-bleed image get a transparent header with light text.
  const overImage = pathname === "/" || /^\/(golf|landscape)\/[^/]+$/.test(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  const solid = scrolled || !overImage || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,border-color] duration-500 ${
        solid ? "border-b hairline bg-bg/85 text-fg backdrop-blur-md" : "border-b border-transparent text-bone"
      }`}
    >
      <div className="container-x flex h-header items-center justify-between">
        <Link href="/" className="display text-2xl md:text-[1.7rem]" aria-label={`${site.name} — home`}>
          Austin Pedersen
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.map((n) => {
            const active = pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={`eyebrow transition-opacity hover:opacity-100 ${active ? "opacity-100" : "opacity-60"}`}>
                {n.label}
              </Link>
            );
          })}
          <span className="h-3 w-px bg-current opacity-30" aria-hidden />
          <ThemeToggle className="opacity-60 hover:opacity-100" />
        </nav>
        <button className="eyebrow md:hidden" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav">
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <div
        id="mobile-nav"
        className={`fixed inset-x-0 top-[var(--header)] bottom-0 bg-bg text-fg transition-opacity duration-500 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <nav className="container-x flex h-full flex-col justify-between py-g2" aria-label="Mobile">
          <ul className="space-y-2">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="display block text-6xl">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between text-muted">
            <a href={`https://instagram.com/${site.instagram}`} className="eyebrow">Instagram</a>
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
