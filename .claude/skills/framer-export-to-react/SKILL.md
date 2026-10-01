---
name: framer-export-to-react
description: Turn this export - a Framer site copied page by page and wrapped in a Next.js project that only rewrites routes to prebuilt index.html files - into a real, editable React + Vite project. Use when the user says "make this editable", "convert this Framer export", "this Next.js app is just serving Framer HTML", "componentize this", or "get this off the Framer runtime". Asks the user up front whether to KEEP the original Framer animations (vendor the sealed runtime, componentize everything else) or REBUILD them in framer-motion.
---

# This export → editable React

This project is not really a Next.js app. It is a Framer site - minified HTML
plus Framer's JS runtime - with Next acting as a static file server. That is
deliberate: it renders exactly as Framer published it, including the parts a
rebuild cannot reach. What it is not is source anyone can edit.

This skill turns it into a React + Vite project a developer can actually edit,
without pretending the result is something it isn't.

## 0. Read the export first (2 minutes, read-only)

Everything you need is already in the project:

- **The route list** is `next.config.mjs` → `rewrites().beforeFiles`. That is
  the source of truth for what must still exist afterwards. Diff against it at
  the end.
- **The pages** are `public/<route>/index.html`: Framer's own markup, with
  `data-framer-hydrate-v2`, `data-framer-generated-page`, `framer-XXXXX` hashed
  class names, loading `script_main.*.mjs`.
- **The assets** are `public/assets/<hostname>/...` - mostly
  `framerusercontent.com`. Nothing is fetched from Framer at runtime.
- **`app/page.tsx` is a placeholder.** There is no component source. That is
  what you are about to write.

Report what you found in one short paragraph. Then ask the question in §1.
Do not start converting before the user has chosen a route.

## 1. ASK the user which route (required)

Ask this, in plain language, with your recommendation:

> Your pages and animations currently come from Framer's generated runtime -
> minified code nobody can comfortably edit. There are two ways forward:
>
> **A. Keep the original animations and design (recommended for most sites).**
> I keep Framer's runtime as a sealed, vendored bundle for the pages that depend
> on it, and convert everything else into normal React components you can edit.
> Pixel-identical, fast, low risk. Trade-off: on those pages you can change
> content freely, but changing *how something animates* means working around
> sealed code.
>
> **B. Rebuild the animations in framer-motion.**
> Framer's builder runs on the same `framer-motion` library you can install, and
> this site's animations are stored as readable settings inside the bundle. So I
> extract the exact timings, easings and scroll ranges and re-author the animated
> pages as hand-written React using the public library. Fully editable, no sealed
> code, and the motion matches because it is the same engine with the same
> numbers. Trade-off: the page markup and layout still have to be rebuilt as
> components, which is most of the work, and the host must be able to install
> npm packages.
>
> **C. Hybrid.** Do A now; rebuild pages in framer-motion one at a time later,
> only where you actually need to change the motion.

Guidance for your recommendation:
- Recommend **A** when the goal is "make it editable / move hosts / ship soon",
  when content changes are the common need, or when the host cannot install
  packages.
- Recommend **B** only when the user expects to iterate on the animations
  themselves, and has time for a rebuild and a visual sign-off.
- Recommend **C** when unsure. A is never wasted work - B builds on it.

Whatever they choose, keep the distinction straight for them: using
framer-motion (a library you install) is normal and healthy, and it is the very
engine already inside this export. The thing being traded away in Route A is not
"an animation library" - it is that Framer's *site runtime* is generated,
minified output with that library baked inside, plus Framer-only glue
(breakpoint variants, the `withFX` wrapper, layout templates) that has no public
equivalent and must be re-expressed by hand in Route B.

## 2. Shared groundwork (both routes)

1. **Work in a new folder or branch. Never convert in place.** This export is
   the reference copy - the only record of what the site looked like. Keep it
   for side-by-side comparison; it must not be served or imported by the build.
2. **Vite + React, not Next.** `index.html` holds only a mount node and the
   module entry. Routing is `react-router-dom`. Build a route table
   (`routes.json`: path → title, component or Framer `routeId`, stylesheet).
3. **Inventory routes from `next.config.mjs`.** Every URL that existed must
   exist after. Diff them, do not sample them.
4. **Dedupe CSS.** The export ships one near-identical stylesheet per page.
   Hash them; keep the distinct ones (typically 1 shared + a few page-specific).
5. **Transliterate content pages to JSX.** Pages with no runtime-only behaviour
   (legal, blog, service pages) become `Page_*.jsx`. Machine conversion is fine
   as a first pass - but see §5 for promoting the parts people edit into real
   components.
6. **Carry the SEO over exactly.** Per-page title, description, canonical,
   robots, og/twitter, JSON-LD, plus site-wide head (analytics, favicon),
   `robots.txt`, `sitemap.xml`. In a SPA these must be injected on navigation.
   Remove any scaffold placeholder meta so nothing precedes the real tags.
   Framer's runtime sets `document.title` after it mounts - re-assert yours.

## 3. Route A - keep the sealed runtime, componentize the rest

### 3.1 Vendor the runtime as source
- Copy Framer's `.mjs` modules into `src/vendor/framer/` so **Vite bundles them**.
  They are not loaded as a separate prebuilt page and nothing is fetched from
  Framer at runtime. (Verify: load the built site and confirm zero requests to
  any `framer.*` host.)
- **One React instance.** The runtime ships its own React. Replace it with a
  small compat module that re-exports the app's npm React, and pin React to the
  version the runtime was built against (18.2 in practice) - not whatever this
  project's `package.json` claims.
- Render a runtime page with its exported `getPageRoot({ routeId, localeId })`
  and mount the returned node. **Disable captured-HTML hydration** - you are
  rendering, not hydrating old markup.
- Only the pages that genuinely need the runtime (usually home + a few with
  scroll/appear choreography) go through it. Everything else is plain JSX.

### 3.2 The adapter - how sealed pages become editable
Hook the compat React module's element creation so every element passes through
`adaptElement(type, props)` before it is created. That function returns
`[type, props]` (possibly modified) or `null` to drop the element. Rules:

- Key decisions on Framer's hashed class names via lookup tables
  (`content-map.js`: class → your component; `content-config.json`: classes to
  remove, links, booking URLs).
- To replace a section's content, **keep the original element and its props,
  refs and handlers, and swap only `children`** for your component. That is what
  preserves the entrance/scroll animation on the wrapper.
- Never inject HTML strings. Never globally override `opacity`/`transform`.
- Put every piece of content people will want to edit into a **named component**
  (`Navigation`, `PricingPlans`, `ProblemContent`, …) with plain props/arrays.
  This is the deliverable: a dev edits those files and never opens the vendor
  folder.

### 3.3 Styling sealed pages from outside - hard-won rules
- Framer sets many styles **inline**; a stylesheet rule silently loses. Use
  `!important`, and confirm with computed styles, not by reading the rule.
- Hashed classes **change between variants** (e.g. a toggle's two states).
  Prefer structural selectors: `:has(> * .your-component)`, `:not(:has(*))`,
  `[data-framer-page-link-current]`.
- A background on a width-capped element stops short. Tint the section; cap the
  content.
- Decorative whites (fades, hairlines) are invisible until you tint the ground.
  Sweep tinted sections for them.
- React re-renders **strip classes you add** to runtime elements. To hold a
  state, re-assert it every frame and apply it through a stylesheet
  `!important` rule fed by a CSS custom property - that outranks Framer's inline
  style without fighting it write-for-write.
- Scroll effects: Framer often animates `translateY` **and** `scale`. Freeze on
  a deterministic event (e.g. a sticky wrapper reaching its pinned position),
  not a guessed threshold, and only arm detectors after real scroll progress -
  entrance animations move things on page load.
- `position: sticky` needs a parent **taller** than the element (travel =
  parent − element). If two layers are pinned, derive both heights so they
  release at the same scroll position, or one will slide against the other.
  Shortening a layer inside a flex parent with `align-items:center` re-centres
  it - add `align-self:flex-start`.

### 3.4 Report honestly
State plainly which routes still render through the vendored runtime. Do not
describe the project as "free of Framer" or "fully hand-authored".

## 4. Route B - rebuild the animations in framer-motion

1. **Check the host can install packages** (`npm i framer-motion`). If it
   cannot (some builders only accept file writes), stop and offer Route A/C.
2. **Extract the animation spec - do not eyeball it.** The export contains the
   public motion library itself (`motion.*.mjs`) and declares every effect as
   plain data on element props, readable even when minified:

   | Framer prop (in the bundle) | Meaning | framer-motion equivalent |
   |---|---|---|
   | `__framer__enter` / `__framer__exit` + `__framer__animate` | appear effect: from / to values and `transition` | `initial` / `whileInView` (or `animate`) + `transition` |
   | `__framer__threshold` | how much must be visible to trigger | `viewport={{ amount }}` |
   | `__framer__animateOnce` | play once vs every time | `viewport={{ once }}` |
   | `__framer__loop`, `loopTransition`, `loopRepeatType`, `loopRepeatDelay` | looping effect | `animate` + `transition.repeat: Infinity`, `repeatType`, `repeatDelay` |
   | `__framer__targets` / `__framer__transformTargets` | scroll-linked keyframes (scroll range → target values) | `useScroll` + `useTransform` with the same ranges |
   | `__framer__variantAppearEffectEnabled`, variant names | state/hover/breakpoint variants | `variants` + `animate={state}`, `whileHover` |
   | `transition` objects (`{type:"spring",bounce,duration}`, `{type:"tween",ease:[…]}`) | exact timing | copy verbatim - same option names |

   Two ways to get it, use both:
   - **Static:** grep the page modules for `__framer__` props and `transition`
     objects (`grep -ohE '__framer__[A-Za-z]+' src/vendor/framer/*.mjs | sort | uniq -c`).
   - **Live (best):** if Route A's adapter exists, every element already passes
     through `adaptElement(type, props)`. Paste the body of
     `.claude/skills/framer-export-to-react/scripts/dump-motion-spec.js` into it
     temporarily, load each page and scroll it, then read `window.__motionSpec`
     - a per-element JSON of the real motion props, keyed by class and id. That
     JSON is the spec and the sign-off checklist.

   Record trigger, properties, transition and reduced-motion behaviour per
   section before writing code.
3. **Rebuild each animated page as hand-written components**, mapping effects:

   | Framer behaviour | framer-motion |
   |---|---|
   | appear / entrance | `initial` + `animate`, or `whileInView` with `viewport={{ once: true }}` |
   | staggered children | parent `variants` with `staggerChildren` |
   | scroll-linked transform | `useScroll({ target })` + `useTransform` |
   | pin while animating | CSS `position: sticky` + the scroll progress above |
   | hover / press | `whileHover`, `whileTap` |
   | variant toggles | `variants` + `animate={state}`, `AnimatePresence` for swaps |
   | shared layout | `layout` / `layoutId` |
   | logo tickers / marquees | CSS keyframes (cheaper than JS) |
   | smooth scrolling | optional `lenis`; not required |

4. Reuse the Route A components for content (nav, pricing, sections) - only the
   wrappers and motion change.
5. **Verify side-by-side** against the original export at desktop and mobile
   widths, and honour `prefers-reduced-motion`.
6. Delete `src/vendor/framer/` and the adapter only when no route uses them.
7. Tell the user the truth about fidelity: the motion can match closely because
   the engine and numbers are the same; differences come from rebuilt markup,
   layout and Framer-only glue. Get a visual sign-off per page.

## 5. Promote what people edit (both routes)

Transliterated JSX is editable but unpleasant (spread props, hashed classes).
Convert in order of how often it changes: navigation, footer, pricing, CTAs and
booking links, hero copy, feature lists, testimonials, contact details, FAQ.
Extract repeated page shells (nav + footer) once. Leave rarely-touched legal
pages for last.

## 6. Assets and CMS data

- Find **every** reference, not just literal strings. Paths built at runtime
  (`` `/media/${name}.gif` ``) escape a literal scan - grep for template
  literals and convert them to explicit URLs.
- Ship only referenced assets; this export carries everything the site loaded,
  which is more than any one page needs.
- **Asset filenames are keys, not URLs.** A file under `public/assets/` whose
  name carries an extra dotted tag (`image.k3f9p2q.png`) was a URL with a query
  string - the tag is a hash of that query, so two sizes of one image stay two
  files. Never reconstruct a URL from a filename; the markup already points at
  the right local path.
- **Framer CMS data is present in this export - check before you assume.** A
  plain capture (wget, a one-pass crawler) misses `*.framercms` chunks: the
  runtime fetches them as byte ranges of a larger file, so nothing links to
  them and pages that looked CMS-driven arrive as baked markup. This export was
  made with a real browser for exactly that reason. Look before you tell the
  user either way:

  ```bash
  find public/assets -name '*.framercms*' | head
  ```

  When they are there, the collection data is real data: parse it and re-author
  the listing as a component over an array, rather than transliterating one
  hand-written card per entry. When the find comes back empty, the markup is
  all there is - say so.

## 7. Verify with numbers, not impressions

- Build passes; every route from §2.3 loads on a cold URL (SPA fallback).
- Per page: broken images = 0, failed requests = 0, requests to `framer.*` = 0.
- Measure, don't eyeball: computed styles, bounding boxes, scroll positions.
  Test vertices, not bounding boxes, for rotated shapes.
- **A hidden or unfocused browser pane freezes Framer's animations** - values
  read there are pre-animation and will mislead you. If you cannot scroll the
  page yourself, add a temporary on-screen debug readout behind a query flag
  and ask the user for a screenshot. Remove it before shipping.
- Dev servers on external/network volumes can miss file events and serve stale
  modules. If the browser disagrees with the file on disk, restart the server.
- Hosted previews lag a rebuild by a minute or two and may 404 mid-deploy.
  Read the file back through the API for truth; then re-check the preview.

## Do not

- Convert in place, or delete this export before sign-off. It is the reference.
- Claim a Route A project is standalone or hand-authored.
- Guess animation thresholds repeatedly - measure, or instrument and ask.
- Ship debug overlays, template credits, or scaffold placeholder meta tags.
