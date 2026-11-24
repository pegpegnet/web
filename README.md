# pegpeg.net

Source for [pegpeg.net](https://pegpeg.net), the website of PegPeg, an independent creative technology studio in Barcelona.

An explorable 3D star system, in Spanish, English and Catalan: every project PegPeg has made is a world orbiting an orange star. It's built with Next.js (App Router, static export), React Three Fiber, postprocessing, GSAP and Tailwind CSS, set in Unbounded, Geist and Geist Mono. The build output is plain static files, served by Apache.

## Develop

```sh
nvm use               # Node 22
npm install
npm run dev           # http://localhost:3000/es/
npm run build         # static site in out/
npm start             # serve out/ locally
npm run typecheck     # after a build, so Next's route types are included
npm run check:content # projects, images, translations, and one world per listed project
npm run budget        # first-load JavaScript per page, and no three.js in it
```

CI runs all of these on every pull request.

## How it's put together

| Where | What |
|---|---|
| `app/[locale]/page.tsx` | The home page: the universe. |
| `app/[locale]/(site)/` | Every other page, with the header and footer. Section names are translated in the URL (`lib/i18n.ts`), matching the previous site's addresses. |
| `app/(root)/` | The bare domain. Apache answers it with a redirect based on `Accept-Language`. |
| `app/global-not-found.tsx` | The 404 page, in all three languages. |
| `content/i18n/` | Interface copy per language. The build fails if a language is missing a key. |
| `content/projects*.ts` | Every project, in English with Spanish and Catalan alongside. Only real work, real facts. |
| `lib/universe.ts` | The system as plain data: each world's type, palette, size, rings, moons, tilt, day and orbit. No three.js, no project text. |
| `components/universe/` | The universe: the stage, interface, labels, panels, index, loader and sound (page side), and `scene/` and `shaders/` (the 3D, loaded lazily). |
| `components/project/` | Case-study pages, each with its world turning live (`universe/Portrait.tsx`). |
| `public/universe/poster.webp` | The picture of the system shown without WebGL. |
| `public/work/` | Project images (WebP). Their sizes are in `content/media.json`. |
| `public/.htaccess` | HTTPS, redirects from the old addresses, security headers, caching. |
| `public/api/contact.php` | The contact form's endpoint. |

### The universe

- **Adding a project:** add it to `content/projects.ts` (with its Spanish and Catalan text) and give it a world in `lib/universe.ts`. Orbits are worked out from the order of the list: inner system first, then the asteroid belt, then the earlier work. `check:content` fails if a listed project has no world.
- **Surfaces** are procedural and baked on the GPU into textures once (`scene/bakery.ts`, `shaders/planet.ts`): small for every world up front, detailed (2048×1024) for the one the camera is near, in strips so no frame stalls. Eight types: ocean, jungle, desert, ice, gas giant, lava, alien, cratered.
- **Navigation** (`navigation.ts`): click a world or its label to fly there; ← and → step through worlds; Esc goes back. The address follows (`/es/#abadia`, `/es/#studio`), and `#services`, `#about`, `#work` from the old site open the studio or the index.
- **Page and scene** share state through a small store (`store.ts`), since they render with different React renderers.
- **Quality tiers** (`lib/quality.ts`):
  - No WebGL, or a lost graphics context: the poster, with the index and panels still working.
  - Phones and low-power devices: smaller surfaces, fewer stars and rocks, lower resolution, no multisampling.
  - Reduced motion: nothing moves on its own (orbits, spin, clouds, the star's surface, grain), and camera moves are near-instant.
- **Frame budget:** measured in headless Chrome on Metal at DPR 2 while dragging the camera: median about 10.5 ms in the overview and in close-ups, no frame over 33 ms.

### Design tokens

The palette, type scale and measured contrast are at the top of `app/globals.css`. In short:
- **Colours:** `space` (background), `nebula` (panels), `starlight` (text), `haze` and `dust` (secondary text), `rim` (hairlines), `flare` (the star's orange, the one accent) and `ion` (the companion's blue).
- **Type:** Unbounded (light, scaled with size-adjust) for headlines, Geist for text, Geist Mono for small uppercase labels.
- **Panels** are solid, never backdrop-blurred, so they don't cost the 3D any frames.

## Deploy

1. `npm ci && npm run build`
2. Upload the contents of `out/`, including the hidden `.htaccess`, to the document root.
3. On the server, set `CONTACT_TO` (where contact messages go) and optionally `CONTACT_FROM` (a sender address on the PegPeg domain). Without `CONTACT_TO` every message ends on the "not sent" page.
4. Remove the old site's `/apns/` folder from the server and revoke those keys. The `.htaccess` blocks it in the meantime.

## Content rules

Only real PegPeg projects and services. No invented clients, numbers, awards or testimonials. When a fact isn't known, it's left out rather than guessed.
