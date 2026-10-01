# FRAME

Photography site for Aryan Pol. Moments worth keeping.

Next.js 15 App Router · TypeScript · Tailwind CSS v4 · Framer Motion · Supabase · Cloudinary

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy env vars and fill them in:

   ```bash
   cp .env.local.example .env.local
   ```

3. Run the database migration — paste `supabase/migrations/20240101000000_init.sql`
   into the Supabase SQL editor, or:

   ```bash
   supabase db push
   ```

4. In Cloudinary, create an **unsigned** upload preset and put its name in
   `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`. Unsigned is required because the
   browser uploads directly.

5. In Supabase → Authentication → Sign In / Providers, **disable public signups**,
   then add `aryan.pol737@gmail.com` as the only user. Admin access is magic-link only.

6. Add `http://localhost:3000/auth/callback` and your production equivalent to
   Supabase → Authentication → URL Configuration → Redirect URLs.

7. Start the dev server:

   ```bash
   npm run dev
   ```

## Deploying the caption edge function

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy generate-caption
```

Verify it:

```bash
curl -i -X POST \
  "https://<project-ref>.supabase.co/functions/v1/generate-caption" \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://res.cloudinary.com/<cloud>/image/upload/<id>.jpg"}'
```

The response streams plain text. `/api/generate-caption` requires a signed-in
Supabase session before it will proxy to this function.

## Deploying the frontend

Import the repo on Vercel. Framework preset: Next.js. Add every variable from
`.env.local.example` except `ANTHROPIC_API_KEY`, which belongs only in Supabase
secrets. Pushes to `main` auto-deploy. No `vercel.json` is needed — Vercel
detects Next.js and there is no custom routing, cron, or region config.

## Notes

- The original Framer export lived in `public/` and was served by `beforeFiles`
  rewrites in `next.config.mjs`. Those rewrites intercepted `/`, `/series`, and
  `/about` before the router saw them, so they were removed. The export is
  archived in `.archive/` (gitignored).
- `/admin` is guarded by `middleware.ts`. `app/admin/layout.tsx` renders the
  login page bare when there's no session, which avoids a redirect loop.
- The caption model is pinned to `claude-sonnet-4-6`. Anthropic's dateless IDs
  are fixed snapshots, not moving pointers — upgrading means editing the string
  in `supabase/functions/generate-caption/index.ts`.
- No camera gear is referenced anywhere. EXIF display is deliberately limited to
  location, date, and time.
