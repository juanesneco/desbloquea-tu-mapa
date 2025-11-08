# Supabase Setup

## Database Migration

To set up the database schema, run the SQL migration in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `migrations/001_initial_schema.sql`
4. Execute the SQL

## Storage Bucket

You also need to create a storage bucket for images:

1. Go to Storage in the Supabase dashboard
2. Create a new bucket named `symbolic-images`
3. Make it **public** (or configure appropriate access policies)
4. The bucket will store all uploaded images

## Environment Variables

Make sure you have these environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
OPENAI_API_KEY=your-openai-api-key
```

## Testing the Connection

After setup, test the connection by:

1. Running the app: `npm run dev`
2. Uploading an image via `/upload`
3. Checking the `images` table in Supabase

## Row Level Security (RLS)

The current setup allows public access for simplicity. In production, you should:

1. Enable authentication
2. Update RLS policies to restrict access to authenticated users only
3. Modify policies to check `auth.uid() = user_id`

