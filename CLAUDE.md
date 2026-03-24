# Faithful Woodworker — Custom Woodworking Website

## Editors

There are two people who work on this site. Adapt your communication style accordingly:

- **Addison** — The site's developer and Austin's brother. Software engineer. Talk to him like a peer. He built this site and handles all technical setup (Apps Script, deployment, infrastructure). He knows what he's doing.

- **Austin** — The woodworker and site owner. **Has zero coding or web development experience.** He edits content (text, photos, Instagram links) via JSON files and pushes to GitHub. When working with Austin:
  - Explain everything step by step, assume nothing about technical knowledge
  - Never use jargon without explaining it
  - Be extra careful before deploying — walk him through what will change and confirm before pushing
  - If something could break the site, warn him clearly and suggest he ask Addison
  - His typical workflow: edit JSON files → preview locally → push to GitHub → site auto-updates
  - If he asks to change code (not just content), suggest he check with Addison first

## Tech Stack
- **Framework:** Next.js 16 (App Router) with static export (`output: 'export'`)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (CSS-based config via `@theme` in globals.css, NOT tailwind.config.js)
- **Gallery:** react-masonry-css + yet-another-react-lightbox
- **Fonts:** Playfair Display (display/headings), Inter (body) via `next/font/google`
- **Deployment:** Static export → GitHub Pages (via GitHub Actions on push to `main`)

## Commands
```bash
npm run dev          # Starts Next.js + content editor API (port 3000 + 3001)
npm run dev:next     # Next.js only
npm run dev:editor   # Content editor API only
npm run build        # Static export to /out
npm run lint         # ESLint
```

### Previewing Production Locally
```bash
npm run build && npx serve out
```

## Architecture

### Pages
4 public pages + 1 hidden admin page:
- **Home** (`/`) — Hero, story highlight, Disney progress tracker, portfolio preview, CTA
- **Portfolio** (`/portfolio/`) — Masonry gallery with lightbox, category filters
- **Order** (`/order/`) — Custom order form → Google Sheets + email notification
- **About** (`/about/`) — Austin's story, family photo
- **Admin** (`/admin/`) — Password-protected order dashboard (not in nav)

### Content System
All editable content lives in `src/content/` as JSON files with a TypeScript wrapper (`src/content/index.ts`):
- `config.json` — Site name, owner info, social links, Apps Script URL, admin password
- `home.json` — Hero text/image, story highlight, progress tracker, CTA text, portfolio preview heading
- `about.json` — About page heading, family photo path, story paragraphs
- `portfolio.json` — Portfolio heading/subheading, items array (filename, alt, title, category)
- `order.json` — Form heading, success message, field options (project types, styles, budget ranges), turnaround note
- `instagram.json` — Instagram section heading, handle, curated posts (local thumbnails linking to IG), embedded reels

Types are defined in `src/types/index.ts`.

**To edit site content:** Edit the JSON files directly, or use the dev editing UI (see below). No code changes needed for text, images, or form options.

### Dev-Only Content Editing
- `dev-server.mjs` runs on port 3001 alongside Next.js (via `concurrently`)
- Provides GET/PUT/POST API for reading/writing JSON content files
- `EditableText` component wraps all text — **Shift+click to edit inline** in dev, renders as plain element in production (zero overhead)
- All dev UI is gated on `process.env.NODE_ENV === 'development'` which Next.js dead-code-eliminates at build time — nothing leaks to production

### Dev Server API (port 3001)
- **GET** `?file=<name>` — Read a content JSON file
- **PUT** `?file=<name>` — Update a field: `{ path: "dot.notation.path", value: "new value" }`
- **POST** `?file=<name>` — Array operations (add, remove, move)
- Allowed files: config, home, about, portfolio, order, instagram

### Photo Directories
- `/public/photos/portfolio/` — Portfolio project photos (referenced by filename in portfolio.json)
- `/public/photos/hero/` — Homepage hero background (family photo)
- `/public/photos/about/` — About page family photo

### Component Structure
```
src/components/
  layout/     Nav, Footer
  ui/         EditableText, ProgressTracker, InstagramSection
```

### Color Palette (defined in globals.css @theme)
- Walnut (primary dark): `#3E2723`
- Oak (primary medium): `#5D4037`
- Wood light: `#8D6E63`
- Cream (section bg): `#FAF7F2`
- Warm white (page bg): `#FEFCF9`
- Charcoal (text): `#2C2C2C`
- Text: `#1A1A1A`
- Muted: `#6B6B6B`
- Accent (gold, CTAs): `#B8860B`
- Accent light: `#DAA520`
- Border: `#E8E0D8`

### Disney Progress Tracker
Configurable via `home.json → progressTracker`:
- `enabled`: true/false to show/hide
- `label`: Text label shown above the bar
- `percentage`: 0-100, representing progress toward goal

### Instagram Section
Curated Instagram content on the homepage, driven by `instagram.json`:
- **Posts**: Local thumbnail images (from `public/photos/portfolio/`) linking to Instagram post URLs. Austin adds `filename`, `instagramUrl`, and `caption` to the posts array.
- **Reels**: Embedded via Instagram's iframe embed (just paste the reel URL into the `url` field). Set to empty string to hide.
- **Follow CTA**: Links to Austin's Instagram profile
- No API keys required — all content is manually curated

To add a new Instagram post:
1. Save a photo to `public/photos/portfolio/`
2. Add an entry to `instagram.json → posts` with `filename`, `instagramUrl`, and `caption`

To embed a reel:
1. Copy the reel URL from Instagram (e.g., `https://www.instagram.com/reel/XXXXX/`)
2. Add it to `instagram.json → reels` array with `url` and optional `caption`

### Asset Paths (basePath)
`next/image` with `unoptimized: true` in static export doesn't auto-prepend `basePath`. All image `src` attributes must use `assetPath()` from `src/utils/basePath.ts`. This reads `NEXT_PUBLIC_BASE_PATH` (set via `next.config.ts` env block) and prepends it. When using a custom domain (no subdirectory), the base path is empty and `assetPath()` is a no-op.

### Navigation
Desktop: horizontal links with "Order Custom Project" as a styled button. Solid background always.
Mobile: hamburger → fullscreen overlay

## Google Sheets Integration

### Order Form Flow
`Browser → fetch() → Apps Script (doPost) → Google Sheet + Email notification`

### Google Sheet Structure
- **Sheet "Orders"**: id, timestamp, name, email, phone, projectType, dimensions, style, colorPreference, budget, description, status, notes
- **Sheet "Config"**: key/value pairs (reserved for future use)

### Apps Script Endpoints
- `POST { action: "submitOrder", ... }` → Write order to sheet + email notification
- `GET ?action=admin&key=...` → Fetch all orders (requires admin key)
- `POST { action: "updateStatus", key, orderId, status }` → Update order status

### Apps Script Setup
1. Create Google Sheet with "Orders" sheet (columns: id, timestamp, name, email, phone, projectType, dimensions, style, colorPreference, budget, description, status, notes)
2. Extensions → Apps Script → paste `google-apps-script/Code.gs`
3. Set Script Properties:
   - `ADMIN_KEY`: must match `adminPassword` in `config.json`
   - `NOTIFICATION_EMAIL`: `austinhowenstine@gmail.com`
4. Deploy → New deployment → Web app → Execute as Me → Anyone can access
5. Copy deployment URL to `config.json` → `appsScriptUrl`

### Updating Apps Script After Code Changes
1. Update `Code.gs` in the Apps Script editor
2. Deploy → Manage deployments → edit existing → Version: "New version" → Deploy

### Admin Dashboard
- Accessible at `/admin/` (not linked in nav)
- Password-protected (password in `config.json` → `adminPassword`)
- Shows all orders with status filters and counts
- Click any order to view details and update status
- Statuses: new → quoted → in_progress → completed (or cancelled)

## Key Conventions
- All content edits go through JSON files, never hardcoded in components
- ALL visible text must be wrapped in `EditableText` with correct `file` and `path` props
- The `EditableText` component needs `file` (JSON filename) and `path` (dot-notation field path, e.g. `"hero.headline"` or `"paragraphs.0"`)
- `EditableText` auto-renders `[text](url)` as links and `**text**` as bold in both dev and production
- Pages are thin — they compose layout + content + components
- Components that use hooks need `'use client'`
- Static build excludes all dev editing — `process.env.NODE_ENV` check is dead-code-eliminated by Next.js at build time
- `trailingSlash: true` means pages export as `page/index.html` — clean URLs on GitHub Pages
- Static build has zero dev overhead — no server-side code ships

## Git Workflow
- **Repo:** `addison-howenstine/faithful-woodworker` (GitHub)
- **Branch:** `main` only
- **Pushing to `main`** triggers auto-deploy to GitHub Pages via GitHub Actions
- Austin can be added as a collaborator for push access

## Deployment to GitHub Pages

### How It Works
1. Push to `main` triggers `.github/workflows/deploy.yml`
2. GitHub Actions: checkout → install → build → deploy to GitHub Pages
3. Site is live at `https://addison-howenstine.github.io/faithful-woodworker/`

### Custom Domain Setup (when ready)
1. Buy `faithfulwoodworker.com`
2. In repo Settings → Pages → Custom domain → enter `faithfulwoodworker.com`
3. At domain registrar, add DNS records:
   - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - CNAME: `www` → `addison-howenstine.github.io`
4. Enable "Enforce HTTPS" in repo Settings → Pages
5. Add `CNAME` file to `/public/` containing `faithfulwoodworker.com`

### Important Notes
- GitHub Pages serves from the `out/` directory built by Next.js static export
- Images are unoptimized (no Next.js image optimization server in static mode)
- `basePath` is set to `/faithful-woodworker` when `GITHUB_PAGES=true` env var is present (set in the GitHub Actions workflow). Remove the `GITHUB_PAGES` env var and basePath logic when switching to a custom domain.
- All image `src` attributes must use `assetPath()` — see "Asset Paths" section above

## TODOs

### Before Launch
- [ ] Add family photo to `/public/photos/hero/family.jpg` (hero background on homepage)
- [ ] Add family photo to `/public/photos/about/family.jpg` (about page)
- [ ] Create Google Sheet with "Orders" sheet + deploy Apps Script (see setup instructions above)
- [ ] Set `appsScriptUrl` in `config.json` after deploying Apps Script
- [ ] Set Script Properties in Apps Script: `ADMIN_KEY` = adminPassword, `NOTIFICATION_EMAIL` = `austinhowenstine@gmail.com`
- [ ] Update `adminPassword` in `config.json` to something Austin will remember
- [ ] Test order form end-to-end (submit order → check Sheet → check email notification)
- [ ] Test admin dashboard at `/admin/` (login → view orders → update status)
- [ ] Add Austin's Instagram post URLs to `instagram.json → posts[].instagramUrl`
- [ ] Add Austin's best Reel URLs to `instagram.json → reels[].url`
- [ ] Add TikTok link to `config.json → socialLinks.tiktok` (if applicable)
- [ ] Review all pages on mobile for polish
- [ ] Get Austin's feedback on Disney progress tracker (hide via `home.json → progressTracker.enabled: false` if he doesn't want it)

### Custom Domain Setup
- [ ] Buy `faithfulwoodworker.com`
- [ ] In repo Settings → Pages → Custom domain → enter `faithfulwoodworker.com`
- [ ] At domain registrar, add DNS records:
  - A records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - CNAME: `www` → `addison-howenstine.github.io`
- [ ] Enable "Enforce HTTPS" in repo Settings → Pages
- [ ] Add `CNAME` file to `/public/` containing `faithfulwoodworker.com`
- [ ] Remove `GITHUB_PAGES` env var from `.github/workflows/deploy.yml`
- [ ] Remove `isGitHubPages` / `basePath` logic from `next.config.ts` (set basePath to `''`)

### After Launch
- [ ] Add more portfolio photos as Austin completes projects (drop in `public/photos/portfolio/`, add to `portfolio.json`)
- [ ] Update Disney progress tracker percentage in `home.json → progressTracker.percentage`
- [ ] Keep Instagram section fresh — add new post/reel URLs to `instagram.json`
- [ ] Consider adding Framer Motion animations for scroll reveals (like wedding site)
- [ ] Consider adding a blog/updates page if Austin wants to post build progress
