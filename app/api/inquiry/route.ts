import { NextResponse } from "next/server";
import { projectTypes } from "@/lib/inquiry";

// Sends inquiries via Resend (https://resend.com) when configured.
// Set RESEND_API_KEY, INQUIRY_TO_EMAIL and INQUIRY_FROM_EMAIL in Vercel.
const clean = (v: unknown, max = 2000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  if (clean(body.website)) return NextResponse.json({ ok: true }); // honeypot: silently drop bots

  const d = {
    name: clean(body.name, 200),
    email: clean(body.email, 200),
    company: clean(body.company, 200),
    projectType: clean(body.projectType, 40),
    location: clean(body.location, 200),
    dates: clean(body.dates, 200),
    message: clean(body.message, 5000),
  };
  if (!d.name || !d.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) {
    return NextResponse.json({ error: "Please add your name, a valid email and a message." }, { status: 400 });
  }
  const type = projectTypes.find((p) => p.value === d.projectType)?.label ?? "Not specified";

  const text = [
    `Name: ${d.name}`, `Email: ${d.email}`, `Club / company: ${d.company || "—"}`, `Project type: ${type}`,
    `Location: ${d.location || "—"}`, `Dates: ${d.dates || "—"}`, "", d.message,
  ].join("\n");

  const key = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  if (!key || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.log("[inquiry — email not configured]\n" + text);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: "The form isn't connected yet — please email directly." }, { status: 503 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM_EMAIL ?? "Website <onboarding@resend.dev>",
      to: [to],
      reply_to: d.email,
      subject: `New inquiry — ${type} — ${d.company || d.name}`,
      text,
    }),
  });
  if (!res.ok) return NextResponse.json({ error: "Couldn't send right now — please email directly." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
