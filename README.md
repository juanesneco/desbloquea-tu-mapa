# Desbloquea Tu Mapa

A philosophy and digital system for unlocking your true potential through self-awareness, symbols, and emotional exploration.

---

## 🌍 Project Structure

This repository contains both the **public-facing website** and the **AI-powered application** in a monorepo structure:

```
desbloquea-tu-mapa/
├── website/          # Static website (philosophy, content, prompts)
├── app/              # Next.js AI-powered image analysis app
├── shared/           # Shared assets and data (if needed)
├── build.js          # Build script for website
├── server.js         # Development server for website
└── README.md         # This file
```

### `/website` - The Philosophy

The static website presents the philosophy, narrative, and visual identity of *Desbloquea tu Mapa*. It includes:

- Main philosophy pages (El Juego, La Matrix, Tu Ikigai, etc.)
- Interactive prompts for self-reflection
- Content about María Mazoy and transformation programs
- Deployed to GitHub Pages

**Run the website locally:**
```bash
npm install
npm run dev
```

Visit: [https://juanesneco.github.io/desbloquea-tu-mapa/](https://juanesneco.github.io/desbloquea-tu-mapa/)

### `/app` - The AI Application

A Next.js 14 application that uses AI to analyze and categorize symbolic images. Features:

- **Upload images** that represent emotional territories or archetypes
- **AI-powered analysis** using OpenAI Vision API
- **Automatic categorization** (Infancia, Cuerpo, Relaciones, Miedo, Propósito, etc.)
- **Philosophical descriptions** connecting images to the *Desbloquea tu Mapa* philosophy
- **Gallery view** with filtering, search, and editing capabilities
- **Supabase backend** for storage and database

**Run the app locally:**
```bash
cd app
npm install
npm run dev
```

App runs at: `http://localhost:3000`

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Supabase account ([sign up here](https://supabase.com))
- An OpenAI API key ([get one here](https://platform.openai.com))

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/juanesneco/desbloquea-tu-mapa.git
   cd desbloquea-tu-mapa
   ```

2. **Set up the website** (optional)
   ```bash
   npm install
   npm run dev
   ```

3. **Set up the app**
   ```bash
   cd app
   npm install
   ```

4. **Configure environment variables**
   
   Create `app/.env.local` with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   OPENAI_API_KEY=your-openai-api-key
   ```

5. **Set up Supabase database**
   
   - Go to your Supabase dashboard → SQL Editor
   - Run the migration from `app/supabase/migrations/001_initial_schema.sql`
   - Create a storage bucket named `symbolic-images` (make it public)

6. **Run the app**
   ```bash
   npm run dev
   ```

---

## 📦 Technology Stack

### Website
- HTML5, CSS3, JavaScript
- Markdown-to-HTML conversion with `marked`
- Express server for development
- GitHub Actions for deployment

### App
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Backend:** Supabase (database + storage)
- **AI:** OpenAI GPT-4o Vision API
- **Deployment:** Vercel (recommended)

---

## 🎯 App Features

### Image Upload & Analysis

1. User uploads an image (photo, drawing, symbol)
2. Image is stored in Supabase Storage
3. AI analyzes the image and generates:
   - A symbolic **title**
   - A philosophical **category** (Infancia, Cuerpo, Relaciones, etc.)
   - A **description** connecting the image to the philosophy
   - Relevant **tags**
4. Metadata is saved to Supabase database
5. User can view, edit, or delete the image later

### Gallery

- View all uploaded images
- Filter by category
- Search by title or description
- Edit titles, descriptions, and categories
- Delete images

### Categories

The AI categorizes images into these philosophical territories:

- **Infancia** - Childhood patterns and memories
- **Cuerpo** - Somatic connection and physical presence
- **Relaciones** - Relationships and connections
- **Miedo** - Fears, shadows, and blocks
- **Propósito** - Ikigai and life direction
- **Presencia** - Consciousness and being present
- **Transformación** - Change and evolution
- **Identidad** - Masks, ego, and authenticity
- **Poder** - Agency and sovereignty
- **Otro** - Other symbolic elements

---

## 📁 App Structure

```
app/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with navigation
│   ├── page.tsx            # Home page
│   ├── upload/             # Upload page
│   │   └── page.tsx
│   └── gallery/            # Gallery page
│       └── page.tsx
├── components/             # Reusable React components
│   ├── ImageCard.tsx
│   └── CategoryFilter.tsx
├── lib/                    # Core utilities
│   ├── supabaseClient.ts   # Database & storage operations
│   ├── analyzeImage.ts     # AI image analysis
│   ├── generateTitle.ts
│   └── generateDescription.ts
├── types/                  # TypeScript type definitions
│   └── index.ts
├── supabase/               # Database setup
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── README.md
├── package.json
├── tsconfig.json
├── next.config.js
└── tailwind.config.ts
```

---

## 🔧 Development

### Website Development

The website uses a simple build system:

```bash
npm run build    # Convert markdown to HTML
npm run dev      # Run development server
```

### App Development

```bash
cd app
npm run dev      # Start Next.js dev server
npm run build    # Build for production
npm start        # Run production build
npm run lint     # Run ESLint
```

---

## 🚢 Deployment

### Website
- **Hosting:** GitHub Pages
- **Deployment:** Automatic via GitHub Actions on push to `main`
- **URL:** https://juanesneco.github.io/desbloquea-tu-mapa/

### App
- **Recommended:** Vercel (official Next.js hosting)
- **Alternative:** Any Node.js hosting platform

**Deploy to Vercel:**
```bash
cd app
vercel
```

---

## 🧠 Philosophy

*Desbloquea tu Mapa* is a philosophy of self-knowledge and transformation. It teaches that:

1. **You have a map** - but it was written by others
2. **The game has rules** - but no one taught you the real ones
3. **Reality is code** - patterns running in your mind
4. **You can rewrite it** - through awareness and choice

This app is the first functional module of that philosophy, using AI to help people reflect on their symbolic images and explore their inner territories.

---

## 📄 License

ISC © Juanes Necoechea 2025

---

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- AI by [OpenAI](https://openai.com/)
- Hosted on [Vercel](https://vercel.com/) & [GitHub Pages](https://pages.github.com/)

---

## 📧 Contact

For questions or collaboration:
- Website: [Desbloquea Tu Mapa](https://juanesneco.github.io/desbloquea-tu-mapa/)
- Creator: Juanes Necoechea
