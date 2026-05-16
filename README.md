# Kioskoman Studio

A single-slide landing page inspired by [offmenu.design](https://www.offmenu.design).
Built with Next.js 16 (App Router), TypeScript, Tailwind v4, and Framer Motion.

## Highlights

- **Orbit stage** — eight project thumbnails drift in a slow circular orbit around a centre point.
- **Smooth scroll-rotation** — wheel / touch nudges the orbit; idle drift continues at a constant rate so the motion never feels frozen.
- **Carousel mode** — clicking any thumbnail zooms into a single-project view with prev/next arrows and keyboard navigation.
- **Pop-out menu** — top-right dot+grid trigger reveals a rounded black panel.
- **Contact form** — pill-shaped CTA bottom-left opens a modal that POSTs to `/api/contact`.

## Local dev

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Database (optional)

The contact form runs in **demo mode** until you set Supabase env vars — submissions succeed but are only logged to the server console.

To wire a real database:

1. Create a Supabase project at <https://supabase.com>.
2. Run `supabase/schema.sql` in the SQL editor.
3. Add these env vars (locally in `.env.local` and on Vercel):
   - `SUPABASE_URL` — project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — service-role key (server-only, never expose to the browser)

## Deploy

The project is set up for one-click Vercel deploys. Push to `main` and Vercel will auto-build.
