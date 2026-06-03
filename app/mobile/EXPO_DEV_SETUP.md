# Desbloquea Tu Mapa – Running with Expo Go

Quick guide for running the mobile app on your phone with Expo Go. Use this every time you want to start the app.

---

## 🚀 How to Run the App

Follow these steps each time you want to run the app:

### Step 1: Start the Next.js API Server

Open **Terminal A** and run:

```bash
cd app
npm run dev
```

**What to expect:**
- Server starts at `http://localhost:3000`
- You'll see: `✓ Ready in X ms`
- Keep this terminal open and running

**Verify it's working:**
- Open `http://localhost:3000` in your browser to confirm the server is running

### Step 2: Start Expo Development Server

Open **Terminal B** (keep Terminal A running) and run:

```bash
cd app/mobile
npx expo start
```

**What to expect:**
- Metro bundler starts
- A QR code appears in the terminal
- A browser window may open with Expo DevTools
- Wait for: `Metro waiting on exp://...`

> 💡 **Connection Options:**
> - **Default (`npx expo start`)**: Auto-detects best connection (LAN or tunnel)
> - **LAN mode (`npx expo start --lan`)**: Faster, requires phone and computer on same Wi-Fi
> - **Tunnel (`npx expo start --tunnel`)**: Works across different networks, but slower
> 
> Start with the default - it usually works best!

### Step 3: Connect Your Phone

1. **Open Expo Go** on your phone (already installed)

2. **Scan the QR Code**
   - **iOS:** Use the Camera app to scan the QR code, then tap the notification
   - **Android:** Open Expo Go and tap "Scan QR code"
   - Or scan the QR code shown in Terminal B or the browser window

3. **Wait for the app to load**
   - First load may take 30-60 seconds
   - You should see the app with Fases/Mapas tabs

### Step 4: Verify Everything Works

- Navigate through the app screens
- Try signing in/up (if needed)
- Test image upload (if you have contributor role)

---

## 🛑 Stop the App

When you're done:

1. **Stop Expo** (Terminal B): Press `Ctrl+C`
2. **Stop Next.js** (Terminal A): Press `Ctrl+C`

---

## 🔧 Troubleshooting

### ❌ "Network request failed" or "Failed to analyze image"
**Solution:**
- Verify Next.js server is running (Terminal A)
- Check `app/mobile/.env` - `EXPO_PUBLIC_API_URL` should use your LAN IP, not `localhost`
- Find your LAN IP:
  ```bash
  # macOS/Linux
  ifconfig | grep "inet " | grep -v 127.0.0.1
  
  # Windows
  ipconfig
  ```
- Update `.env` if your IP changed, then restart Expo

### ❌ "Expo Go can't connect to Metro"
**Solution:**
- Make sure phone and computer are on the same Wi-Fi network (for LAN mode)
- Try tunnel mode: `npx expo start --tunnel` (works across networks)
- Check your internet connection (tunnel mode requires internet)
- Try clearing Expo Go cache: Settings → Clear cache
- Restart Expo: `Ctrl+C` then `npx expo start`

### ❌ "Port already in use"
**Solution:**
- Use a different port: `npx expo start --port 8082`
- Or kill the process using the port

### ❌ "Missing Supabase environment variables"
**Solution:**
- Verify `.env` file exists in `app/mobile/`
- Check that values are correct (no extra spaces, quotes, or typos)
- Restart Expo: `Ctrl+C` then `npx expo start` again

### ❌ App loads but shows errors
**Solution:**
- Check Terminal B for error messages
- Verify all environment variables are set correctly in `app/mobile/.env`
- Check that Supabase project is active and accessible
- Review browser console if Expo DevTools is open

### ❌ "Command not found: expo" or similar
**Solution:**
- Use `npx expo` instead of just `expo`
- Example: `npx expo start --tunnel` (not `expo start --tunnel`)
- No need to install Expo CLI globally

### ❌ "Tunnel connection failed" or tunnel errors
**Solution:**
- Try LAN mode instead: `npx expo start --lan`
- Make sure phone and computer are on the same Wi-Fi network
- Or try without tunnel: `npx expo start` (then press `s` to switch connection type)

### ❌ "Cannot find module" or dependency errors
**Solution:**
- Run `npm install` in `app/mobile/` directory
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- Run `npx expo install --fix` to fix dependency versions

---

## 📝 Quick Reference

**Start everything:**
```bash
# Terminal A
cd app && npm run dev

# Terminal B  
cd app/mobile && npx expo start
```

**Find LAN IP (if needed):**
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

**Restart Expo after env changes:**
```bash
# In Terminal B
Ctrl+C
npx expo start
```

---

## 📋 First Time Setup (Reference)

> ⚠️ **Only needed once!** Skip this if you've already set up the app before.

### Prerequisites

1. **Node.js 18+** installed ([download](https://nodejs.org/))
   - Verify: `node --version` (should show v18 or higher)

2. **Expo CLI** (no global installation needed - use `npx expo`):
   - Modern Expo works with `npx expo` - no global install required
   - If you want global CLI: `npm install --global eas-cli` (optional, for EAS builds only)

3. **Expo account** (sign up at [expo.dev](https://expo.dev) if needed)
   - Sign in: `npx expo login` (if using tunnel mode)

4. **Expo Go app** installed on your phone:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Configure Environment Variables

Since Supabase is already set up, you just need to ensure `app/mobile/.env` exists with:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
EXPO_PUBLIC_API_URL=http://YOUR-LAN-IP:3000
```

> 💡 **Tip:** See `app/ENV_SETUP.md` for Supabase credentials and `app/SUPABASE_SETUP.md` for database setup.

**Important:** 
- `EXPO_PUBLIC_API_URL` must use your LAN IP (not `localhost`)
- Find your LAN IP: `ifconfig | grep "inet " | grep -v 127.0.0.1` (macOS/Linux) or `ipconfig` (Windows)

### Install Dependencies

```bash
cd app/mobile
npm install
npx expo install react-native-gesture-handler
```

> 💡 If Expo suggests installing other packages during startup, accept the suggested versions.

---

**Keep this file updated when the setup process changes!** 🚀
