# CanvasFolio — Photography Portfolio & Studio CMS

CanvasFolio is a responsive portfolio website and content management system for
photography and film studios. It combines a public-facing portfolio, project
galleries, and journal with an admin workspace for managing content, site settings,
users, and themes.

The application is built with Next.js, React, TypeScript, Tailwind CSS, and Prisma.
It uses PostgreSQL for its database, supports local file uploads during development,
and can use Supabase Storage and SMTP when deployed.

This repository imports the project source from [CanvasFolio](https://github.com/siddhant7701/CanvasFolio),
originally created by Siddhant Srivastava. This repository keeps the imported source
credit while maintaining its own snapshot-based Git history.

---

## ✨ Features

- **Public site** (mobile‑first, responsive): Home, Work (filterable portfolio),
  project detail pages with galleries + video embeds, Journal (blog), About,
  Services, Contact, plus any custom pages you create.
- **Admin panel** at `/admin`:
  - Dashboard with stats and recent messages
  - **Projects** — full CRUD, cover image, gallery upload, video embed, categories, featured/draft, ordering, per‑item SEO
  - **Journal** — blog posts in Markdown, cover image, tags, publish date, per‑post SEO
  - **Pages** — editable About / Services / any custom page (Markdown)
  - **Messages** — contact‑form inbox, mark read/unread, reply, delete
  - **Users** — multi‑user with `admin` / `editor` roles (admin‑only management)
  - **Settings** — brand, contact details, social links, SEO defaults, homepage content
  - **Theme** — pick from **4 designs**, custom accent colour, **live preview**, apply site‑wide
- **Themes**: Minimal/Editorial, Bold/Dark, Warm/Organic, Glass/Modern — switchable
  from the admin, plus a visitor theme switcher on the public site. Add more easily.
- **SEO**: per‑page meta titles/descriptions, Open Graph + Twitter cards, dynamic
  `sitemap.xml` and `robots.txt`, title templates.
- **Mail backend**: contact submissions are always saved to the DB; optional SMTP
  sends an email notification when configured.
- **Image uploads**: stored locally during development; pasteable image URLs are supported.
- **Auth**: signed cookie sessions (JWT) with bcrypt-hashed passwords.

## 🧱 Tech stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Prisma ORM ·
PostgreSQL · optional Supabase Storage · JWT authentication.

---

## 🚀 Run locally

Requirements: **Node.js 20.9+** and a reachable **PostgreSQL** database.

1. Install dependencies:

   ```bash
   npm ci
   ```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` and `DIRECT_URL` to
   connection strings for your PostgreSQL database. On Windows PowerShell:

   ```powershell
   Copy-Item .env.example .env
   ```

   Set `AUTH_SECRET` to a unique, long random value. The Supabase Storage and SMTP
   variables are optional for local development.

3. Create the database schema, add demo content, and start the development server:

   ```bash
   npm run setup
   npm run dev
   ```

Open **http://localhost:3000** for the site and **http://localhost:3000/admin** for
the admin panel.

The starter site is branded **Surya Chandra**. Update the site name, logo, contact
details, and other public-facing settings in **Admin → Settings**.

### Demo logins

The seed script creates an admin (`admin@studio.test` / `admin123`) and an editor
(`editor@studio.test` / `editor123`). Change these demo passwords and use a unique
`AUTH_SECRET` before exposing the site publicly.

### Useful scripts

| Command            | Description                                      |
|--------------------|--------------------------------------------------|
| `npm run dev`      | Start the dev server                             |
| `npm run build`    | Production build                                 |
| `npm run start`    | Run the production build                          |
| `npm run setup`    | Generate client + create DB + seed (first‑time)  |
| `npm run db:seed`  | Re‑seed demo content                             |
| `npm run db:reset` | Wipe & recreate the DB, then seed                |
| `npm run db:studio`| Open Prisma Studio to browse the DB             |

---

## 🌐 Going online (Supabase + Vercel)

The Prisma schema is already configured for PostgreSQL. To use Supabase, configure
both connection strings in `.env`: use the pooled connection for `DATABASE_URL`
(runtime) and the direct connection for `DIRECT_URL` (schema changes).

### 1. Point the database at Supabase (Postgres)

1. Create a free project at <https://supabase.com>. Copy the **Connection string (URI)**
   from *Project → Settings → Database*.
2. Set `DATABASE_URL` and `DIRECT_URL` in `.env` using the connection strings
   supplied by Supabase. Keep credentials private; do not commit `.env`.
3. Create the tables and seed:
   ```bash
   npx prisma db push
   npm run db:seed
   ```

### 2. Deploy to Vercel

1. Push this repo to GitHub and import it at <https://vercel.com>.
2. Add the environment variables in Vercel (Project → Settings → Environment Variables):
   - `DATABASE_URL` — the pooled Supabase connection string
   - `DIRECT_URL` — the direct Supabase connection string
   - `AUTH_SECRET` — a long random string
   - `NEXT_PUBLIC_SITE_URL` — your production URL (e.g. `https://yourdomain.com`)
   - *(optional)* `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `SMTP_TO`
3. Deploy. The build runs `prisma generate` automatically.

> **Image uploads on Vercel:** the app auto‑detects storage. Locally (offline) it
> saves to `/public/uploads`. In production, set `SUPABASE_URL` +
> `SUPABASE_SERVICE_ROLE_KEY` and create a **public** Storage bucket named `uploads`
> — uploads then go to Supabase and the Media Library works anywhere. No code change.

### ✅ Production checklist (before/after deploy)

- [ ] `DATABASE_URL` and `DIRECT_URL` set to the Supabase Postgres connection strings
- [ ] `AUTH_SECRET` set to a long random string
- [ ] `NEXT_PUBLIC_SITE_URL` set to your real domain
- [ ] `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` set, public `uploads` bucket created
- [ ] Ran `npx prisma db push` + `npm run db:seed` against the Postgres DB
- [ ] Changed the demo admin password (Admin → Users) and removed the demo editor
- [ ] (Optional) SMTP_* set so contact‑form emails are delivered
- [ ] (Optional) Set a favicon, default OG image and SEO defaults in Admin → Settings

## 📈 What's built in for production

- **SEO structured data** (JSON‑LD): Organization, Article (posts), CreativeWork (projects)
- **Auto‑generated social share image** for pages without a custom OG image
- **Dynamic `sitemap.xml` + `robots.txt`**, per‑page meta + canonical URLs
- **Loading skeletons & error boundaries** (no blank screens / crashes)
- **Security headers** (nosniff, frame options, referrer policy, HSTS, permissions policy)
- **PWA manifest** + mobile theme‑color
- **Vercel Analytics** (active automatically when deployed to Vercel)

---

## 🎨 Themes

- Four presets live in `src/lib/themes.ts` (registry) and `src/app/globals.css`
  (the actual CSS variables under `[data-theme="<id>"]`).
- **Add a theme:** append an entry in `themes.ts` and a matching `[data-theme]` block
  in `globals.css`. It appears in **Admin → Theme** automatically.
- The active theme + accent are stored in site settings (the database), so changing
  it in the admin updates the whole live site instantly.

## 🗂️ Project structure

```
prisma/
  schema.prisma         # data models
  seed.ts               # demo content + users + settings
src/
  app/
    (site)/             # public website (header/footer layout)
    admin/              # admin panel (login + protected dashboard group)
    api/                # contact + upload endpoints
    sitemap.ts robots.ts
  components/           # site/, admin/, Markdown
  lib/                  # db, auth, settings, themes, mail, seo, utils
public/uploads/         # locally uploaded images (offline)
```

## 🔐 Notes

- Always set a strong `AUTH_SECRET` and change the demo passwords before going live.
- The contact form has a honeypot field for basic spam protection.
- `/admin` and `/api` are disallowed in `robots.txt`.
