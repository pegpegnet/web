# pegpeg.net

Source for [pegpeg.net](https://pegpeg.net), the website of PegPeg, an independent creative technology studio in Barcelona.

A calm, product-like site with 3D at the heart of each section, in Spanish, English and Catalan. It's built with Next.js (App Router, static export), React Three Fiber, GSAP, Motion and Tailwind CSS, and set in Inter. The build output is plain static files, served by Apache.

## Develop

```sh
nvm use               # Node 22
npm install
npm run dev           # http://localhost:3000/es/
npm run build         # static site in out/
npm start             # serve out/ locally
npm run typecheck     # after a build, so Next's route types are included
npm run check:content # projects, images, scenes and translations
npm run budget        # first-load JavaScript per page, and no three.js in it
```

CI runs all of these on every pull request.

## How it's put together

| Where | What |
|---|---|
| `app/[locale]/` | Every page, under `/es/`, `/en/` or `/ca/`. Section names are translated in the URL (`lib/i18n.ts`), matching the previous site's addresses. |
| `app/(root)/` | The bare domain. Apache answers it with a redirect based on `Accept-Language`. |
| `app/global-not-found.tsx` | The 404 page, in all three languages. |
| `content/i18n/` | Interface copy per language. The build fails if a language is missing a key. |
| `content/projects*.ts` | Every project, in English with Spanish and Catalan alongside. Only real work, real facts. |
| `public/work/` | Project images (WebP). Their sizes are in `content/media.json`. |
| `components/hero/` | The opening: the peg and the block, drag to explore, and the scroll story into the blue. |
| `components/work/` | Selected Work: one rounded panel per project, each with its own scene (Yutub, Socialpreviewbot, RetroPong, MixMasterTube). |
| `components/three/` | The 3D plumbing: quality tiers, the shared canvas, per-section canvases, shared light. |
| `components/scenes.tsx` | Every scene, loaded lazily so three.js never blocks the first paint. |
| `components/motion/` | Scroll restoration, buttons, headline reveals, page transitions. |
| `public/.htaccess` | HTTPS, redirects from the old addresses, security headers, caching. |
| `public/api/contact.php` | The contact form's endpoint. |

### 3D and motion

- **Quality tiers** (`lib/quality.ts`):
  - No WebGL: every scene shows a static fallback.
  - Phones and low-power devices: lower resolution and fewer effects.
  - Reduced motion: scenes render but don't move on their own, and nothing pins or scrubs.
- **The hero** draws into one shared canvas above the page, so its glass can pass in front of the headline.
- **Other sections** (work panels, services, the dock, the pegboard) each get their own canvas. It mounts near the viewport and only renders while on screen.
- **Scroll is native.** There is no smooth-scroll library; anchor links use CSS `scroll-behavior`, and ScrollTrigger reads the real scroll position.
- **Frame budget:** device pixel ratio is capped at 1.5 and glass uses 4 samples at 256 px. Checked by scrolling the home page in headless Chrome at DPR 2: the median frame is 16.7 ms.

### Design tokens

The palette, type scale and contrast notes are at the top of `app/globals.css`. In short:
- **Type:** Inter, with optical sizing. Headings are weight 600 with tight tracking and use the `step-3` to `step-6` tokens. There are no one-off clamp sizes.
- **Surfaces:** white (`bone`), near-white panels (`chalk`), and rounded corners (1.5–2 rem) on panels and media.
- **Motion:** short fades and small rises (power3, under a second). Nothing stretches, wipes or follows the cursor.
- Text on light surfaces is charcoal, graphite or volt.
- On charcoal, text is bone or ash, and blue type uses `volt-bright`.
- Orange display type on light surfaces uses `ember-type`.
- Plain ember is only for decoration and dark surfaces.

## Deploy

1. `npm ci && npm run build`
2. Upload the contents of `out/`, including the hidden `.htaccess`, to the document root.
3. On the server, set `CONTACT_TO` (where contact messages go) and optionally `CONTACT_FROM` (a sender address on the PegPeg domain). Without `CONTACT_TO` every message ends on the "not sent" page.
4. Remove the old site's `/apns/` folder from the server and revoke those keys. The `.htaccess` blocks it in the meantime.

## Content rules

Only real PegPeg projects and services. No invented clients, numbers, awards or testimonials. When a fact isn't known, it's left out rather than guessed.
