# Desbloquea Tu Mapa - App

AI-powered image analysis application for symbolic self-exploration.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   
   Create `.env.local` with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ANTHROPIC_API_KEY=your-anthropic-api-key
   ```

3. **Set up Supabase**
   
   - Run the SQL migration from `supabase/migrations/001_initial_schema.sql`
   - Create a storage bucket named `symbolic-images` (make it public)
   - See `supabase/README.md` for details

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 📦 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Storage:** Supabase Storage
- **AI:** Claude vision (Anthropic API)
- **Icons:** Lucide React

## 🎯 Features

### Image Upload
- Drag-and-drop or file selection
- Automatic upload to Supabase Storage
- AI analysis and categorization
- Philosophical interpretation

### Gallery
- Grid view of all images
- Category filtering
- Text search
- Inline editing
- Image deletion

### AI Analysis
- Generates symbolic titles
- Categorizes into philosophical domains
- Creates meaningful descriptions
- Extracts relevant tags

## 📁 Project Structure

```
app/
├── app/                    # Next.js routes
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── upload/             # Upload route
│   └── gallery/            # Gallery route
├── components/             # React components
├── lib/                    # Core utilities
├── types/                  # TypeScript types
├── supabase/               # Database setup
└── styles/                 # Global styles
```

## 🔑 Environment Variables

Required variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGci...` |
| `ANTHROPIC_API_KEY` | Your Anthropic API key | `sk-ant-...` |

Optional:

| Variable | Description |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | For admin operations |

## 📊 Database Schema

The app uses a single `images` table:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `created_at` | timestamptz | Upload timestamp |
| `file_url` | text | Public URL to image |
| `title` | text | Image title |
| `category` | text | Philosophical category |
| `description` | text | AI-generated description |
| `tags` | text[] | Keyword tags |
| `user_id` | uuid | Optional user reference |

## 🎨 Categories

Images are categorized into these philosophical domains:

- **Infancia** - Childhood patterns
- **Cuerpo** - Somatic presence
- **Relaciones** - Relationships
- **Miedo** - Fears and blocks
- **Propósito** - Life purpose
- **Presencia** - Consciousness
- **Transformación** - Evolution
- **Identidad** - Authenticity
- **Poder** - Personal power
- **Otro** - Other symbolic elements

## 🚢 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Configure environment variables in the Vercel dashboard.

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Run ESLint

## 📝 Development Notes

### Adding New Features

1. **New categories:** Update `types/index.ts` and `lib/analyzeImage.ts`
2. **New pages:** Create in `app/` directory
3. **New components:** Add to `components/` directory
4. **Database changes:** Create new migration in `supabase/migrations/`

### Code Style

- Use TypeScript for type safety
- Follow Tailwind CSS utility-first approach
- Keep components small and focused
- Use server components when possible
- Handle errors gracefully with try-catch

### Performance Tips

- Images are optimized automatically by Next.js
- Use React Server Components for static content
- Minimize client-side JavaScript
- Leverage Supabase edge functions for complex operations

## 🐛 Troubleshooting

**Images not uploading?**
- Check Supabase bucket exists and is public
- Verify environment variables are set
- Check browser console for errors

**AI analysis failing?**
- Verify Anthropic API key is valid
- Check you have credits remaining
- Review API usage limits

**Database errors?**
- Ensure migration has been run
- Check RLS policies allow operations
- Verify Supabase connection

## 📄 License

ISC © Juanes Necoechea 2024

## 🙏 Related

- [Main Repository](../)
- [Website](../website/)
- [Philosophy](https://juanesneco.github.io/desbloquea-tu-mapa/)

