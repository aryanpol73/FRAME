# unique-founders-146943.framer.app

An exact copy of the published site, in a Next.js project.

```bash
npm install
npm run dev
```

## What this is

Every page is a file under `public/`, copied from the published site and served
byte for byte by a rewrite in `next.config.mjs`. It renders exactly as Framer
published it, including the parts a rebuild cannot reach - a WebGL canvas, a
component driven frame by frame - because nothing here was interpreted.

3 routes:

- `/`
- `/series`
- `/about`

## What this is not

Source you can edit. The markup is Framer's, minified, alongside its runtime -
you can host it, put your domain on it and add pages of your own around it, but
changing the design means changing it in Framer and exporting again.

## Making it editable anyway

Two ways. The quick one: export the plugin's React / Next.js tier instead. It
rebuilds the pages as components with their own stylesheet - readable at once,
and not pixel-identical.

The thorough one: convert this copy by hand. Nothing here is fetched from
Framer, so the whole site is already in this folder and the work can be done
offline, at any number of pages, keeping the pixels.

`.claude/skills/framer-export-to-react/SKILL.md` is that second method written
down: what to keep, what to rebuild, and the question to answer before either.
That folder is hidden - `ls -a` in a terminal, Shift-Command-. in Finder.
Open this folder in a coding agent that reads `.claude/skills` - Claude Code
does - and ask it to make the site editable; it will find the skill on its own.
Or read it yourself. It is prose, not a script.

## Adding your own pages

Anything you add under `app/` works normally, as long as its route is not one
of the rewrites above - those are answered by the copy before Next sees them.
