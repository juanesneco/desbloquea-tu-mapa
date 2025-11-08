# Environment Setup Guide

This guide will help you set up all the required environment variables for the app.

## 📋 Prerequisites

Before starting, make sure you have:
- A Supabase account ([sign up](https://supabase.com))
- An OpenAI account ([sign up](https://platform.openai.com))

## 🔑 Step 1: Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project (or create a new one)
3. Navigate to **Settings** → **API**
4. Copy the following:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJhbGci...`)

## 🤖 Step 2: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com)
2. Sign in to your account
3. Navigate to **API Keys** section
4. Click **Create new secret key**
5. Copy the key (starts with `sk-...`)
6. **Important:** Save this key somewhere safe - you won't see it again!

## 📝 Step 3: Create .env.local File

1. Navigate to the `app/` directory
2. Create a file named `.env.local`
3. Add the following content:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your-anon-key

# OpenAI Configuration
OPENAI_API_KEY=sk-...your-openai-key

# Optional: For admin operations (not required for basic usage)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Replace the placeholder values with your actual credentials

## ⚙️ Step 4: Set Up Supabase Database

1. In your Supabase dashboard, go to **SQL Editor**
2. Open the file `app/supabase/migrations/001_initial_schema.sql`
3. Copy the entire contents
4. Paste into the Supabase SQL Editor
5. Click **Run** to execute the migration

## 📦 Step 5: Create Storage Bucket

1. In Supabase dashboard, go to **Storage**
2. Click **Create a new bucket**
3. Name it: `symbolic-images`
4. Set it to **Public** (check the public checkbox)
5. Click **Create bucket**

## ✅ Step 6: Verify Setup

Test your configuration:

```bash
cd app
npm install
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000)
2. Navigate to `/upload`
3. Try uploading an image
4. If it works, you're all set! 🎉

## 🔒 Security Notes

- **Never commit** `.env.local` to version control (it's already in `.gitignore`)
- **Never share** your API keys publicly
- **Rotate keys** if you suspect they've been compromised
- For production, consider using **environment-specific** keys

## 🚨 Troubleshooting

### "Failed to connect to Supabase"
- Check your `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify the URL format: `https://xxxxx.supabase.co`

### "Authentication failed"
- Ensure you copied the **anon** key, not the service role key
- Check for extra spaces in your `.env.local` file

### "OpenAI API error"
- Verify your API key starts with `sk-`
- Check you have credits in your OpenAI account
- Review [OpenAI usage limits](https://platform.openai.com/account/limits)

### "Bucket not found"
- Make sure the bucket is named exactly `symbolic-images`
- Verify it's set to **public**
- Check the bucket exists in Supabase Storage

## 💰 Cost Considerations

### OpenAI API
- GPT-4o Vision costs ~$0.01 per image analysis
- Monitor usage in [OpenAI Dashboard](https://platform.openai.com/usage)
- Set up usage limits to control costs

### Supabase
- Free tier includes:
  - 500 MB database space
  - 1 GB file storage
  - 50 MB file uploads
- [View pricing](https://supabase.com/pricing)

## 🎯 Next Steps

After setup is complete:

1. Upload your first image at `/upload`
2. View the gallery at `/gallery`
3. Read the [App README](./README.md) for more details
4. Explore the [Philosophy](https://juanesneco.github.io/desbloquea-tu-mapa/)

## 📧 Need Help?

If you encounter issues:
1. Check this guide again carefully
2. Review error messages in browser console
3. Check Supabase logs in the dashboard
4. Review OpenAI API status page

---

Happy exploring! 🗺️✨

