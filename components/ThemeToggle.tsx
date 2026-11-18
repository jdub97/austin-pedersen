"use client";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [light, setLight] = useState(false);
  useEffect(() => setLight(document.documentElement.dataset.theme === "light"), []);
  const toggle = () => {
    const next = !light;
    setLight(next);
    if (next) document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem("theme", next ? "light" : "dark"); } catch {}
  };
  return (
    <button onClick={toggle} className={`eyebrow inline-flex items-center gap-2 ${className}`} aria-label={`Switch to ${light ? "dark" : "light"} mode`}>
      <span aria-hidden className="relative inline-block h-2.5 w-2.5 rounded-full border border-current">
        <span className={`absolute inset-0 rounded-full bg-current transition-transform duration-500 ${light ? "scale-0" : "scale-100"}`} />
      </span>
      {light ? "Light" : "Dark"}
    </button>
  );
}
