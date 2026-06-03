# Desbloquea Tu Mapa - Project Context

## What is this project?

**Desbloquea Tu Mapa** (Unlock Your Map) is a personal development/consciousness project created by Juan Esteban. It's a system to help people see, understand, and redraw their internal "maps" - the mental models and patterns that shape their experience of life.

The core philosophy: **La intención es el origen de toda transformación** (Intention is the origin of all transformation).

## Backend Status & Migration Plan (Deferred)

> **Parked as of 2026-06-03.** Both Supabase **Cloud** projects this repo was wired to are **unreachable** — their subdomains no longer resolve DNS, so they have been paused or deleted:
> - `app/` → project `ehgsfiuvaunfqugkhdrt.supabase.co` (referenced via `app/.env.local`, vars `NEXT_PUBLIC_SUPABASE_*` + `OPENAI_API_KEY`)
> - root + `website/` → project `wjhmycxkvmtxtyrcqgfm.supabase.co` (referenced via root `.env`, vars `SUPABASE_URL`/`SUPABASE_ANON_KEY`, and **hardcoded** in `website/supabase-keys.js`)
>
> Until re-provisioned, the `app/` will not connect to a database and the `website/` Supabase-backed features (newsletter, image contributions) will not work.

### Plan — migrate onto the shared self-hosted JENG Supabase

This project lives under `~/web/apps/` on the JENG VPS only so it can be worked on there; it does **not** yet use the shared self-hosted Supabase (`api.juanesngtz.com`). When ready to revive it:

1. **Pick a schema + view prefix** following the JENG multi-app pattern — e.g. schema `dtm`, public views prefixed `dtm_*` with `security_invoker = true`. (See `~/web/apps/CLAUDE.md` and `~/know_how/01_server_setup/03_supabase_schema.md`.)
2. **Stand up the schema** from the migrations already in this repo, in order:
   - `app/supabase/migrations/001_initial_schema.sql`
   - `app/supabase/migrations/002_add_fases_subetapas_auth.sql`
   - `app/supabase/migrations/003_add_mapa_emocional.sql`
3. **Recreate the storage bucket + RLS** — the app expects a `symbolic-images` storage bucket and `user_roles`-based policies (`contributor` role for uploads). Full checklist in `app/SUPABASE_SETUP.md` and `app/STORAGE_POLICIES_SETUP.md`.
4. **Repoint credentials** to the shared instance:
   - `app/.env.local` → `NEXT_PUBLIC_SUPABASE_URL=https://api.juanesngtz.com` + the shared anon key (keep a working `OPENAI_API_KEY`).
   - root `.env` → shared `SUPABASE_URL`/`SUPABASE_ANON_KEY`.
   - `website/supabase-keys.js` → **must be updated by hand** (anon URL+key are hardcoded and committed here; the anon key is public-by-design so this is safe, but it currently points at the dead `wjhmy` project).
5. **Decide on the static-site coupling** — the GitHub Pages `website/` reaches Supabase directly from the browser via `supabase-keys.js`; confirm RLS covers anonymous reads/writes for whatever it needs (newsletter signup, etc.) before going live.

`.env` and `app/.env.local` are gitignored (never committed); only the hardcoded `website/supabase-keys.js` and these notes live in the repo. After re-provisioning, update this section.

## Project Structure

```
desbloquea_tu_mapa/
├── website/           # Main website (static HTML/CSS/JS)
├── app/               # Mobile app (React Native/Expo) - DO NOT MODIFY without explicit permission
└── CLAUDE.md          # This file
```

## Website Structure (`/website/`)

### Main Pages
- `index.html` - Homepage
- `prompts.html` - AI prompts system (3 connected prompts users copy to ChatGPT/Claude/Gemini)

### Sections (`/secciones/`)
- `filosofia.html` - Core philosophy page with 3 visual sections:
  - Las 3 Fases (diagram linking to fases.html)
  - Los 5 Mapas (circular diagram linking to mapas.html)
  - La Realización (flow diagram linking to realizacion.html)
- `fases.html` - The 3 phases: Inconsciencia → Consciencia → Creación
- `mapas.html` - Overview of the 5 maps
- `realizacion.html` - The internal operating system (6 controllable buttons)
- `herramientas.html` - Tools and resources
- `comienza.html` - Getting started / CTA page

### Individual Maps (`/mapas/`)
- `mapa-mental.html` - Mental map (Interpretation)
- `mapa-emocional.html` - Emotional map (Energy)
- `mapa-fisico.html` - Physical map (Body)
- `mapa-familiar.html` - Family map (Patterns)
- `mapa-financiero.html` - Financial map (Value)

### Herramientas (Tools)
The tools page (`herramientas.html`) has 4 sections in this order:
1. **Prompts** - Available now
2. **Newsletter** - Coming soon
3. **Instrumentos Físicos** - Future (physical tools, not just cards)
4. **App** - In development

### Prompts System (`/prompts/`)
Three connected AI prompts that users copy into their favorite AI tool:
1. `fase-1-despierta.html` - Generates "Reporte de Despertar"
2. `fase-2-observa.html` - Requires Report 1, generates "Reporte de Observación"
3. `fase-3-crea.html` - Requires Reports 1 & 2, generates "Sistema Operativo Mental"

The main `prompts.html` page hides the prompt content - users only see "Copy" buttons.

### Components (`/components/`)
- `header.html` - Global navigation header
- `footer.html` - Global footer
- `mobile-menu-init.js` - Mobile menu functionality

### Archived Pages (`/archivados/`)
Pages that exist but are not actively linked in navigation:
- `historia.html` - Personal story (Mi Historia)
- `el-juego.html`
- `la-matrix.html`
- `trajectory.html`
- `tu-ikigai.html`
- `tu-primer-mapa.html`

## Key Concepts

### The 3 Phases
1. **Inconsciencia** - You don't see the map
2. **Consciencia** - You see the map
3. **Creación** - You redraw the map

### The 5 Maps
All interconnected, all reorganize when intention changes:
1. Mental (Interpretation)
2. Emocional (Energy)
3. Físico (Body)
4. Familiar (Patterns)
5. Financiero (Value)

### The 6 Controllable Buttons (La Realización)
1. Intención (Intention)
2. Atención (Attention)
3. Interpretación (Interpretation)
4. Energía (Energy)
5. Acción (Action)
6. Repetición (Repetition)

## Design System

### Font
- **Cormorant Garamond** (Google Fonts) - Used across all pages

### Colors (CSS Variables)
```css
--primary: #3F4447;
--primary-light: #6B7174;
--navy: #1B2838;
--navy-light: #2C3E50;
--blue: #4A90A4;
--background: #E8E6E3;
--background-alt: #F5F3F0;
--white: #FFFFFF;
```

### Icons
- Font Awesome 6.5.1 (via CDN)
- NO emojis in the UI - use Font Awesome icons instead

### Map Colors
- Mental: #4A90A4 (blue)
- Emocional: #E6B800 (yellow/gold)
- Físico: #6B7174 (gray)
- Familiar: #8B4513 (brown)
- Financiero: #228B22 (green)

## Important Guidelines

1. **Language**: All content is in Spanish
2. **No emojis**: Use Font Awesome icons instead
3. **Font**: Always include Cormorant Garamond Google Font import
4. **Mobile app**: Do NOT modify `/app/` folder without explicit permission
5. **Archived pages**: Keep in `/archivados/` - they exist but aren't in active navigation
6. **Prompts**: The prompt content should be hidden from users - they only copy/paste

## Common Tasks

### Adding a new page
1. Copy structure from an existing page
2. Include Cormorant Garamond font import
3. Include Font Awesome CDN
4. Include header/footer placeholders and fetch scripts
5. Use the established color variables

### Updating navigation
- Edit `/components/header.html` for main nav
- Edit `/components/footer.html` for footer links
