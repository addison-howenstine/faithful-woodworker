# Faithful Woodworker — Custom Woodworking Website

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
- Allowed files: config, home, about, portfolio, order

### Photo Directories
- `/public/photos/portfolio/` — Portfolio project photos (referenced by filename in portfolio.json)
- `/public/photos/hero/` — Homepage hero background (family photo)
- `/public/photos/about/` — About page family photo

### Component Structure
```
src/components/
  layout/     Nav, Footer
  ui/         EditableText, ProgressTracker
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

### Navigation
Desktop: horizontal links with "Order Custom Project" as a styled button
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
- `basePath` may need to be set in `next.config.ts` if deployed to a subdirectory (e.g., `/faithful-woodworker/`). Remove it when using a custom domain.

## TODOs

### Before Launch
- [ ] Add family photo to `/public/photos/hero/family.jpg`
- [ ] Add family photo to `/public/photos/about/family.jpg`
- [ ] Create Google Sheet + deploy Apps Script
- [ ] Set `appsScriptUrl` in `config.json`
- [ ] Add social media links to `config.json`
- [ ] Update `adminPassword` in `config.json` to something Austin will remember
- [ ] Create GitHub repo and push
- [ ] Enable GitHub Pages in repo settings (Source: GitHub Actions)
- [ ] Test order form end-to-end
- [ ] Test admin dashboard

### After Launch
- [ ] Buy `faithfulwoodworker.com` and configure custom domain
- [ ] Add more portfolio photos as Austin completes projects
- [ ] Update Disney progress tracker percentage as fundraising progresses
- [ ] Add Austin's social media links (Instagram, TikTok)
