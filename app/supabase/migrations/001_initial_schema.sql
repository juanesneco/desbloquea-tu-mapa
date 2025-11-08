-- Added by AI Monorepo Setup
-- Initial database schema for Desbloquea tu Mapa image storage and analysis

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  file_url TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_title ON images USING GIN (to_tsvector('spanish', title));
CREATE INDEX IF NOT EXISTS idx_images_description ON images USING GIN (to_tsvector('spanish', description));

-- Enable Row Level Security (RLS)
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (can be restricted later)
-- For now, allowing public read/write for simplicity
CREATE POLICY "Public can view images" 
  ON images FOR SELECT 
  USING (true);

CREATE POLICY "Public can insert images" 
  ON images FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Public can update images" 
  ON images FOR UPDATE 
  USING (true);

CREATE POLICY "Public can delete images" 
  ON images FOR DELETE 
  USING (true);

-- Note: In production, you should restrict these policies to authenticated users:
-- USING (auth.uid() = user_id)
-- WITH CHECK (auth.uid() = user_id)

-- Create storage bucket for images (run this separately in Supabase Storage UI or via API)
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('symbolic-images', 'symbolic-images', true);

-- Create storage policies (run after bucket creation)
-- CREATE POLICY "Public can upload images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'symbolic-images');

-- CREATE POLICY "Public can view images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'symbolic-images');

-- CREATE POLICY "Public can delete images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'symbolic-images');

-- Optional: Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE images IS 'Stores metadata for analyzed symbolic images';
COMMENT ON COLUMN images.file_url IS 'Public URL to the image in Supabase storage';
COMMENT ON COLUMN images.title IS 'AI-generated or manually edited title';
COMMENT ON COLUMN images.category IS 'Philosophical category: Infancia, Cuerpo, Relaciones, etc.';
COMMENT ON COLUMN images.description IS 'AI-generated philosophical interpretation';
COMMENT ON COLUMN images.tags IS 'Array of keyword tags for the image';
COMMENT ON COLUMN images.user_id IS 'Optional: reference to authenticated user';

