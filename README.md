# pegpeg.net

Source for [pegpeg.net](https://pegpeg.net), the website of PegPeg, an independent creative technology studio in Barcelona.

A scroll-driven, 3D site built with Next.js (App Router, static export), React Three Fiber, GSAP and Tailwind CSS. The build is plain static files in `out/`, served by Apache.

## Develop

```sh
nvm use          # Node 22
npm install
npm run dev      # http://localhost:3000
npm run build    # static site in out/
npm start        # serve out/ locally
```
