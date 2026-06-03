# Desbloquea Tu Mapa - Project Context

## What is this project?

**Desbloquea Tu Mapa** (Unlock Your Map) is a personal development/consciousness project created by Juan Esteban. It's a system to help people see, understand, and redraw their internal "maps" - the mental models and patterns that shape their experience of life.

The core philosophy: **La intención es el origen de toda transformación** (Intention is the origin of all transformation).

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
