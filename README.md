# Austin Pedersen — Golf Course & Landscape Photography

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · deploys to Vercel.

**Photo-first, minimal text.** Pages: Home (hero sequence + work grid) · Golf · Landscape · Contact.
`/about` and `/services` permanently redirect to `/contact`. Captions are one small line; descriptions in the JSON
are used only for SEO/meta, never shown on the page.

> **Everything marked PLACEHOLDER is a stand-in.** Images are generated gradients labeled "PLACEHOLDER IMAGE".
> Bio, clients, email, Instagram, dates and descriptions are placeholders too. No real clients or testimonials are invented.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000  (builds the image manifest first)
npm run build && npm start
```

## Design system

| Token | Dark (default) | Light |
|---|---|---|
| Background | Ink `#0D0F0D` | Paper `#F2EEE6` |
| Text | Bone `#ECE6DA` | Ink `#151815` |
| Accent | Sand `#C8B48C` | Bronze `#8A6A3A` |
| Supporting | Fairway `#4A6450`, Dusk `#B87A5B`, Mist `#8B928C` | |

- **Display:** Instrument Serif (self-hosted, `app/fonts/`)
- **UI:** Geist Sans
- Utilities: `display`, `eyebrow`, `container-x`, `hairline`, `bleed-x`. The tokens live in `app/globals.css`.
- The theme toggle saves the choice to `localStorage`. An inline script applies it before paint, so there's no flash of the wrong theme.
- All motion (Ken Burns, crossfade, reveals) is turned off when the visitor's device asks for reduced motion. The hero also has Pause, Previous and Next controls.

## Adding content

### A new course
1. Put the photos in `public/photos/<slug>/`. JPEGs are fine; use at least 2400px on the long edge for hero images.
2. Create `content/courses/<slug>.json` (copy `the-preserve.json`):

```jsonc
{
  "slug": "the-preserve",
  "title": "The Preserve Golf Club",
  "location": "Vancleave, Mississippi",
  "region": "Mississippi Gulf Coast",
  "date": "2026-09",                 // sorts newest first
  "architect": "Jerry Pate",
  "client": "",                      // optional
  "coordinates": [30.54, -88.69],    // shows the map
  "featured": true,                  // homepage hero + Course Index
  "description": "One or two sentences.",
  "cover": { "src": "/photos/the-preserve/01.jpg", "alt": "…" },
  "chapters": [
    { "title": "Morning", "text": "…", "photos": [
      { "src": "/photos/the-preserve/02.jpg", "alt": "…", "time": "6:42 AM", "light": "Low fog", "hole": "No. 4 — Par 3" }
    ]}
  ]
}
```

Chapters can be anything: time of day, hole by hole, before and after. `time`, `light` and `hole` show up in the hover overlay and the lightbox.

### A new landscape series
Same idea, in `content/series/<slug>.json`, with a flat `photos` array.

### Image pipeline
`npm run images` runs automatically before `dev` and `build`. It reads each photo's size and creates a 16px blur placeholder in `content/image-manifest.json`. Unchanged files are skipped. `next/image` serves AVIF and WebP at responsive sizes and lazy-loads everything except the hero.

### Replacing a photo
Give the new file a new name (e.g. `05b.jpg`) instead of overwriting an existing one: optimized images are cached by URL for a year.

### Removing placeholders
Delete the `course-0*` and `series-0*` JSON files and their `public/photos/` folders, then remove `"placeholder": true` from any real entries. `npm run placeholders` regenerates the demo set; it never overwrites an existing JSON file.

## Still to fill in (search the code for `TODO` and `PLACEHOLDER`)
- `lib/site.ts`: domain, email, Instagram handle, base city, positioning line
- Contact page: headshot (`public/photos/about/portrait.jpg`)
- Sequoyah National: architect

## Contact form
`POST /api/inquiry` checks the fields, includes a honeypot for bots, and sends through [Resend](https://resend.com). In Vercel, set:

```
RESEND_API_KEY=...
INQUIRY_TO_EMAIL=austin@…
INQUIRY_FROM_EMAIL="Austin Pedersen <inquiries@yourdomain.com>"   # verified domain in Resend
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

Without a key, development mode logs inquiries to the console. Production returns a clear "email directly" error, so leads are never dropped silently.

## SEO
- Per-page `metadata`, canonical URLs, and Open Graph images (each course and series uses its cover photo; the default is `app/opengraph-image.tsx`)
- JSON-LD: `Person` (Photographer) + `ProfessionalService` sitewide, and `ImageGallery` + `GolfCourse` on course pages. schema.org has no `Photographer` type, so this is the standard pattern.
- `sitemap.xml` (includes image URLs) and `robots.txt`

## Lighthouse (mobile, placeholder images)
Re-run after real photos are in.
Re-check once real photos are in. Export them as sRGB JPEGs around 2560px on the long edge; `next/image` takes care of the rest.

## Deploy
Push to GitHub, then import the repo in Vercel. No other configuration is needed.
