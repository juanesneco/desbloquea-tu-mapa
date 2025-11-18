# Supabase Setup Checklist ✅

## What's Already Done ✅

Based on the database check:
- ✅ **Tables created:** `fases`, `sub_etapas`, `mapas`, `user_roles`, `images`
- ✅ **Fases:** 3 rows (Inconsciencia, Consciencia, Creación)
- ✅ **Sub-etapas:** 11 rows (all sub-stages)
- ✅ **Mapas:** 5 rows (Mental, Físico, Familiar, Financiero, **Emocional**)
- ✅ **RLS enabled** on all tables
- ✅ **Foreign keys** set up correctly

## What You Need to Set Up

### 1. Storage Bucket (Required for Image Uploads)

**In Supabase Dashboard:**
1. Go to **Storage** in left sidebar
2. Click **"New bucket"**
3. Name: `symbolic-images`
4. **Make it Public** (check the "Public bucket" checkbox)
5. Click **"Create bucket"**

**Or run this SQL:**
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('symbolic-images', 'symbolic-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;
```

**Then set storage policies:**
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'symbolic-images' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to view
CREATE POLICY "Authenticated users can view images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'symbolic-images' AND
    auth.role() = 'authenticated'
  );

-- Allow users to delete their own uploads
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'symbolic-images' AND
    auth.role() = 'authenticated'
  );
```

### 2. Enable Email Auth (If Not Already Enabled)

**In Supabase Dashboard:**
1. Go to **Authentication** → **Providers**
2. Make sure **Email** is enabled
3. Configure email templates if needed (optional)

### 3. Test User Creation

After setting up, you can test by:
1. Creating a user in the app (sign up)
2. The user will default to "viewer" role
3. To upgrade to "contributor", run this SQL:

```sql
INSERT INTO user_roles (user_id, role)
SELECT id, 'contributor'
FROM auth.users
WHERE email = 'your-email@example.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'contributor';
```

## Quick Verification

Run this to verify everything is set up:

```sql
-- Check tables
SELECT 'fases' as table_name, COUNT(*) as count FROM fases
UNION ALL
SELECT 'sub_etapas', COUNT(*) FROM sub_etapas
UNION ALL
SELECT 'mapas', COUNT(*) FROM mapas
UNION ALL
SELECT 'user_roles', COUNT(*) FROM user_roles;

-- Check storage bucket exists
SELECT name, public FROM storage.buckets WHERE name = 'symbolic-images';
```

## Summary

**Must Do:**
- ✅ Tables are already set up
- ⚠️ **Create storage bucket `symbolic-images`** (public)
- ⚠️ **Set storage policies** (see SQL above)

**Optional:**
- Configure email templates
- Set up custom domain (for production)

Once the storage bucket is created, the app should be able to upload images!

