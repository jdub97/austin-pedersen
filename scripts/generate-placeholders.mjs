// Generates clearly-labeled PLACEHOLDER landscape images + matching content JSON.
// Safe to delete once real content exists. Never overwrites an existing JSON file.
// Usage: npm run placeholders
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const photosDir = path.join(root, "public", "photos");

const palettes = {
  dawn:   { sky: ["#2b3140", "#8d8a99", "#e3c3a4"], land: ["#3f5446", "#2f4235", "#1f2c23"], label: "Dawn · soft side light" },
  fog:    { sky: ["#9aa29d", "#c3c6bf", "#d9d8cf"], land: ["#76857a", "#5a6a5e", "#3d4b41"], label: "Morning · low fog" },
  midday: { sky: ["#5d7d96", "#a9c0cc", "#dfe5e2"], land: ["#5f7d4c", "#4a6a3c", "#c8b48c"], label: "Midday · high sun" },
  golden: { sky: ["#3a3550", "#c98a5c", "#f0c98a"], land: ["#6b6a3c", "#4a5130", "#2a2f1c"], label: "Golden hour · raking light" },
  dusk:   { sky: ["#151a2a", "#5a4560", "#b87a5b"], land: ["#2a3029", "#1c211c", "#0f120f"], label: "Dusk · afterglow" },
  dunes:  { sky: ["#6f8ea3", "#b9c7c9", "#e8dcc4"], land: ["#c8b48c", "#a99468", "#4a6450"], label: "Afternoon · coastal wind" },
};

function hills(w, h, seed, colors) {
  // Deterministic rolling horizon bands
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  return colors
    .map((c, i) => {
      const base = h * (0.55 + i * 0.12);
      const amp = h * (0.05 - i * 0.012);
      let d = `M0 ${base}`;
      const steps = 6;
      for (let k = 1; k <= steps; k++) {
        const x = (w / steps) * k;
        const cx = x - w / steps / 2;
        const cy = base + (rnd() - 0.5) * amp * 4;
        d += ` Q${cx} ${cy} ${x} ${base + (rnd() - 0.5) * amp}`;
      }
      d += ` L${w} ${h} L0 ${h} Z`;
      return `<path d="${d}" fill="${c}"/>`;
    })
    .join("");
}

async function makeImage(file, { w, h, palette, title, sub, seed }) {
  const p = palettes[palette];
  const fs1 = Math.round(w * 0.022);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${p.sky[0]}"/><stop offset="0.6" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[2]}"/>
  </linearGradient>
  <radialGradient id="sun" cx="${0.3 + (seed % 5) * 0.1}" cy="0.5" r="0.35">
    <stop offset="0" stop-color="#fff6e0" stop-opacity="0.45"/><stop offset="1" stop-color="#fff6e0" stop-opacity="0"/>
  </radialGradient></defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect width="100%" height="100%" fill="url(#sun)"/>
  ${hills(w, h, seed, p.land)}
  <g font-family="Helvetica, Arial, sans-serif" fill="#ffffff" fill-opacity="0.85">
    <text x="${w * 0.04}" y="${h * 0.09}" font-size="${fs1}" letter-spacing="${fs1 * 0.25}">PLACEHOLDER IMAGE</text>
    <text x="${w * 0.04}" y="${h * 0.09 + fs1 * 1.6}" font-size="${fs1 * 0.75}" fill-opacity="0.65">${title} — ${sub}</text>
  </g></svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(file);
}

const pal = Object.keys(palettes);

async function photoSet(slug, count, offset, kind) {
  const dir = path.join(photosDir, slug);
  fs.mkdirSync(dir, { recursive: true });
  const out = [];
  for (let i = 0; i < count; i++) {
    const n = String(offset + i + 1).padStart(2, "0");
    const portrait = i % 5 === 3;
    const palette = pal[(offset + i + slug.length) % pal.length];
    const file = path.join(dir, `${n}.jpg`);
    const w = portrait ? 1600 : 2400;
    const h = portrait ? 2000 : i % 4 === 2 ? 1350 : 1600;
    await makeImage(file, { w, h, palette, title: slug, sub: `${kind} ${n}`, seed: offset + i + slug.length * 7 });
    out.push({
      src: `/photos/${slug}/${n}.jpg`,
      alt: `Placeholder — ${kind} image ${n}`,
      time: ["6:12 AM", "7:40 AM", "12:05 PM", "6:48 PM", "7:31 PM"][(i + offset) % 5],
      light: palettes[palette].label,
    });
  }
  return out;
}

// Known courses get real names/locations; everything else stays a labeled placeholder.
const known = {
  1: { slug: "the-preserve", title: "The Preserve Golf Club", location: "Vancleave, Mississippi", region: "Mississippi Gulf Coast", architect: "Jerry Pate", coordinates: [30.54, -88.69] },
  2: { slug: "sequoyah-national", title: "Sequoyah National Golf Club", location: "Cherokee, North Carolina", region: "Great Smoky Mountains", architect: "Architect — confirm", coordinates: [35.47, -83.29] },
};
const courses = [1, 2, 3, 4, 5].map((n) => ({ n, slug: known[n]?.slug ?? `course-${String(n).padStart(2, "0")}` }));
const series = [1, 2, 3, 4].map((n) => ({ n, slug: `series-${String(n).padStart(2, "0")}` }));

for (const { n, slug } of courses) {
  const jsonPath = path.join(root, "content", "courses", `${slug}.json`);
  const morning = await photoSet(slug, 3, 0, "Morning");
  const holes = await photoSet(slug, 5, 3, "Hole");
  const golden = await photoSet(slug, 3, 8, "Golden hour");
  const details = await photoSet(slug, 3, 11, "Detail");
  holes.forEach((p, i) => (p.hole = `No. ${[1, 4, 7, 13, 16][i]} — Par ${[4, 3, 5, 4, 3][i]}`));
  if (fs.existsSync(jsonPath)) continue;
  const course = {
    placeholder: true,
    slug,
    title: `Course Name ${String(n).padStart(2, "0")}`,
    location: "City, State",
    region: "Region / Country",
    date: `2025-${String(10 - n).padStart(2, "0")}`,
    architect: "Architect name",
    client: "Club / commissioning client",
    coordinates: [[43.11, -124.42], [41.83, -101.06], [36.57, -121.95], [35.22, -79.43], [44.4, -89.93]][n - 1],
    ...(known[n] ?? {}),
    featured: n <= 3,
    description:
      "PLACEHOLDER — One or two sentences on the course: the landscape it sits in, what made it worth photographing, and the light Austin waited for.",
    cover: { ...holes[0], alt: `Placeholder cover — ${known[n]?.title ?? `Course Name ${n}`}` },
    chapters: [
      { title: "Morning", text: "PLACEHOLDER — First light and fog over the property.", photos: morning },
      { title: "The Holes", text: "PLACEHOLDER — A hole-by-hole walk through the signature stretch.", photos: holes },
      { title: "Golden Hour", text: "PLACEHOLDER — Long shadows reveal the contour of the ground.", photos: golden },
      { title: "Details", text: "PLACEHOLDER — Flags, bunker edges, textures, clubhouse.", photos: details },
    ],
  };
  fs.writeFileSync(jsonPath, JSON.stringify(course, null, 2));
}

for (const { n, slug } of series) {
  const jsonPath = path.join(root, "content", "series", `${slug}.json`);
  const photos = await photoSet(slug, 9, 0, "Landscape");
  if (fs.existsSync(jsonPath)) continue;
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        placeholder: true,
        slug,
        title: `Series Title ${String(n).padStart(2, "0")}`,
        location: "Location",
        date: `2025-0${n}`,
        featured: true,
        description: "PLACEHOLDER — A short statement on the series: where, when, and what ties these images together.",
        cover: photos[0],
        photos,
      },
      null,
      2
    )
  );
}

// Portrait placeholder for About page
fs.mkdirSync(path.join(photosDir, "about"), { recursive: true });
await makeImage(path.join(photosDir, "about", "portrait.jpg"), { w: 1600, h: 2000, palette: "fog", title: "about", sub: "Headshot of Austin", seed: 3 });

console.log("Placeholders generated.");
