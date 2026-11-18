import { ImageResponse } from "next/og";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { getCourses } from "@/lib/content";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share image: featured course cover + name in the display serif.
// Course and series pages use their own cover photo as the OG image.
export default async function OG() {
  const cover = getCourses().find((c) => c.featured)?.cover ?? getCourses()[0].cover;
  const jpg = await sharp(path.join(process.cwd(), "public", cover.src)).resize(1200, 630, { fit: "cover" }).jpeg({ quality: 80 }).toBuffer();
  const font = await fs.readFile(path.join(process.cwd(), "app/fonts/instrument-serif-latin-400-normal.woff"));
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#0d0f0d" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/jpeg;base64,${jpg.toString("base64")}`} width={1200} height={630} style={{ position: "absolute", inset: 0, objectFit: "cover" }} alt="" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,.1))" }} />
        <div style={{ position: "absolute", left: 64, bottom: 56, display: "flex", flexDirection: "column", color: "#ece6da" }}>
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", opacity: 0.8 }}>{site.tagline}</div>
          <div style={{ fontFamily: "Display", fontSize: 120, lineHeight: 1, marginTop: 12 }}>{site.name}</div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Display", data: font, style: "normal", weight: 400 }] }
  );
}
