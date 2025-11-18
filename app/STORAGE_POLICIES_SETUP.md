# Storage Policies Setup - Step by Step

## Overview
You need to create 3 policies for the `symbolic-images` bucket to allow authenticated users to upload, view, and delete images.

---

## Policy 1: Upload Images (INSERT)

### Steps:
1. In Supabase Dashboard, go to **Storage** → Click on **`symbolic-images`** bucket
2. Click **"New Policy"** or **"Policies"** tab → **"New Policy"**
3. Fill in:

   **Policy name:**
   ```
   Authenticated users can upload images
   ```

   **Allowed operation:**
   - ✅ Check **INSERT** only
   - ❌ Uncheck SELECT, UPDATE, DELETE

   **Target roles:**
   - Click the dropdown
   - Select **"authenticated"** (NOT "public")
   - If you see a list, check the box for "authenticated"

   **Policy definition:**
   ```sql
   bucket_id = 'symbolic-images' AND auth.role() = 'authenticated'
   ```

4. Click **"Review"** → **"Save policy"**

---

## Policy 2: View Images (SELECT)

### Steps:
1. Still in the `symbolic-images` bucket, click **"New Policy"** again
2. Fill in:

   **Policy name:**
   ```
   Authenticated users can view images
   ```

   **Allowed operation:**
   - ✅ Check **SELECT** only
   - ❌ Uncheck INSERT, UPDATE, DELETE

   **Target roles:**
   - Select **"authenticated"**

   **Policy definition:**
   ```sql
   bucket_id = 'symbolic-images' AND auth.role() = 'authenticated'
   ```

3. Click **"Review"** → **"Save policy"**

---

## Policy 3: Delete Own Images (DELETE)

### Steps:
1. Click **"New Policy"** one more time
2. Fill in:

   **Policy name:**
   ```
   Users can delete own images
   ```

   **Allowed operation:**
   - ✅ Check **DELETE** only
   - ❌ Uncheck SELECT, INSERT, UPDATE

   **Target roles:**
   - Select **"authenticated"**

   **Policy definition:**
   ```sql
   bucket_id = 'symbolic-images' AND auth.role() = 'authenticated'
   ```
   
   *(Note: For now, any authenticated user can delete any image. We can restrict to "own images" later if needed)*

3. Click **"Review"** → **"Save policy"**

---

## Quick Reference Table

| Policy | Operation | Target Roles | Policy Definition |
|--------|-----------|--------------|-------------------|
| Upload | INSERT | authenticated | `bucket_id = 'symbolic-images' AND auth.role() = 'authenticated'` |
| View | SELECT | authenticated | `bucket_id = 'symbolic-images' AND auth.role() = 'authenticated'` |
| Delete | DELETE | authenticated | `bucket_id = 'symbolic-images' AND auth.role() = 'authenticated'` |

---

## Verify It Worked

After creating all 3 policies:
1. Go to **Storage** → **`symbolic-images`** → **"Policies"** tab
2. You should see 3 policies listed
3. Each should show:
   - Operation: INSERT / SELECT / DELETE
   - Target: authenticated
   - Definition: Your SQL condition

---

## Troubleshooting

**"Policy already exists" error:**
- The policies might already be created (I created them via SQL earlier)
- Check the Policies tab to see if they're there
- If they exist, you're done! ✅

**Can't select "authenticated" role:**
- Make sure you're in the Storage policies, not Database policies
- Try typing "authenticated" in the search box
- If it's not available, the bucket might need to be public (which it already is)

**Policy definition error:**
- Make sure there are no extra spaces
- Copy the exact SQL from above
- The `auth.role()` function should work in storage policies

---

Once all 3 policies are created, your app will be able to upload, view, and delete images! 🎉

