"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { projectTypes } from "@/lib/inquiry";

const field = "w-full border-0 border-b hairline bg-transparent px-0 py-3 text-lg text-fg placeholder:text-muted/50 focus:border-accent focus:outline-none focus:ring-0";

export function InquiryForm() {
  const params = useSearchParams();
  const ref = params.get("ref");
  const initialType = params.get("project") ?? "";
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/inquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="border-t border-accent pt-8" role="status">
        <p className="display text-4xl">Thank you.</p>
        <p className="mt-4 text-lg text-muted">Your inquiry is in. You&apos;ll hear back soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-x-g gap-y-[calc(var(--g)*1.5)] sm:grid-cols-2" noValidate={false}>
      <label className="block">
        <span className="eyebrow text-muted">Name *</span>
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className="eyebrow text-muted">Email *</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block">
        <span className="eyebrow text-muted">Club / company</span>
        <input name="company" autoComplete="organization" className={field} />
      </label>
      <label className="block">
        <span className="eyebrow text-muted">Project type *</span>
        <select name="projectType" required defaultValue={initialType} className={`${field} appearance-none bg-bg`}>
          <option value="" disabled>Select…</option>
          {projectTypes.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>
      </label>
      <label className="block">
        <span className="eyebrow text-muted">Location</span>
        <input name="location" placeholder="Course / city" className={field} />
      </label>
      <label className="block">
        <span className="eyebrow text-muted">Dates</span>
        <input name="dates" placeholder="Preferred window" className={field} />
      </label>
      <label className="block sm:col-span-2">
        <span className="eyebrow text-muted">Message *</span>
        <textarea name="message" required rows={5} defaultValue={ref ? `Re: ${ref}\n\n` : ""} className={`${field} resize-y`} />
      </label>
      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-g sm:col-span-2">
        <button type="submit" disabled={state === "sending"} className="eyebrow bg-fg px-8 py-4 text-bg transition-colors hover:bg-accent disabled:opacity-50">
          {state === "sending" ? "Sending…" : "Send inquiry"}
        </button>
        {state === "error" && <p className="text-sm text-dusk" role="alert">{error}</p>}
      </div>
    </form>
  );
}
