# Supabase Policies Checklist

With tables, auth, and the `symbolic-images` bucket already created, run the SQL below in the Supabase SQL editor to restore the production RLS policies.

## 1. Storage uploads (contributors only)
```sql
DROP POLICY IF EXISTS "Contributors can upload images" ON storage.objects;

CREATE POLICY "Contributors can upload images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'symbolic-images'
    AND name LIKE 'uploads/%'
    AND get_user_role(auth.uid()) = 'contributor'
  );
```

## 2. Storage reads (all authenticated users)
```sql
DROP POLICY IF EXISTS "Authenticated users can view images" ON storage.objects;

CREATE POLICY "Authenticated users can view images"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'symbolic-images');
```

## 3. Storage deletes (contributors)
```sql
DROP POLICY IF EXISTS "Contributors can delete own images" ON storage.objects;

CREATE POLICY "Contributors can delete own images"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'symbolic-images'
    AND auth.uid() = owner
    AND get_user_role(auth.uid()) = 'contributor'
  );
```

## 4. Allow authenticated users to read `user_roles`
```sql
DROP POLICY IF EXISTS "Authenticated users can view user roles" ON user_roles;

CREATE POLICY "Authenticated users can view user roles"
  ON user_roles FOR SELECT TO authenticated
  USING (true);
```

▶️ **Next action:** run each block, then insert/update `user_roles` rows so every uploader has `role = 'contributor'`. Sign out and back in on the app after making these changes so the new policies and roles take effect.
