// Scans /public/photos and writes content/image-manifest.json with
// width, height and a tiny blurred base64 placeholder for every image.
// Runs automatically before `dev` and `build`. Just drop images in and go.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const photosDir = path.join(root, "public", "photos");
const out = path.join(root, "content", "image-manifest.json");

const prev = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, "utf8")) : {};
const manifest = {};

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(jpe?g|png|webp|avif|tiff?)$/i.test(e.name) ? [p] : [];
  });
}

const files = walk(photosDir);
let built = 0;
for (const file of files) {
  const key = "/" + path.relative(path.join(root, "public"), file).split(path.sep).join("/");
  const mtime = fs.statSync(file).mtimeMs;
  if (prev[key] && prev[key].mtime === mtime) {
    manifest[key] = prev[key];
    continue;
  }
  const img = sharp(file).rotate();
  const meta = await img.metadata();
  const swap = meta.orientation && meta.orientation >= 5;
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;
  const blur = await sharp(file).rotate().resize(16).blur(1.2).jpeg({ quality: 50 }).toBuffer();
  manifest[key] = { width, height, blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`, mtime };
  built++;
}

fs.writeFileSync(out, JSON.stringify(manifest, null, 2));
console.log(`Image manifest: ${files.length} images (${built} processed).`);
