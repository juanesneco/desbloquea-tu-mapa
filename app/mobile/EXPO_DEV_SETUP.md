# Desbloquea Tu Mapa – Expo Go Setup

Step-by-step checklist to run the mobile app on a physical phone with Expo Go. Follow each item in order whenever you need to spin up the environment again.

---

## 1. Preconditions
- Install Node.js 18+ and npm.
- Install Expo CLI tools once: `npm install --global expo-cli eas-cli`.
- Sign in to Expo: `expo login` (same account you used for the EAS project).

---

## 2. Configure Environment Variables
> Files live inside `app/mobile/`.

1. Copy `.env` if it’s missing:
   ```bash
   cp .env.example .env    # only if you recreated the repo
   ```
2. Edit `.env` with these values:
   ```
   EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   EXPO_PUBLIC_API_URL=http://YOUR-LAN-IP:3000
   ```
   - `YOUR-LAN-IP` must be the IP address of the computer running the Next.js API (e.g. `192.168.0.179`), not `localhost`.

3. Save the file and restart Expo whenever you change it.

---

## 3. Install Mobile Dependencies
Run these inside `app/mobile/` (only needed after cloning or when dependencies change):
```bash
npm install
npx expo install react-native-gesture-handler
```
> If Expo asks to install other packages, accept the suggested versions.

---

## 4. Start Required Servers
Open two terminals.

**Terminal A (Next.js API)**
```bash
cd app
npm install        # first time only
npm run dev
```
- Keep it running; it serves `/api/analyze` at `http://localhost:3000`.

**Terminal B (Expo CLI)**
```bash
cd app/mobile
npx expo start --tunnel
```
- `--tunnel` ensures your phone can reach the Metro server even across networks.
- Wait for the QR code to appear.

---

## 5. Connect Your Phone
1. Install **Expo Go** from the App Store/Play Store.
2. On your phone, open Expo Go and scan the QR code shown in Terminal B (or in the browser window that Expo opens).
3. The app should load with the Fases/Mapas tab layout.

---

## 6. Test Image Upload
1. In the Expo app, navigate to the Upload screen.
2. Pick or capture a photo.
3. Watch Terminal A for logs from `/api/analyze`. If you see errors (Supabase auth, OpenAI, network), copy them for debugging.

---

## 7. Common Issues
- **App still uses `localhost`:** Confirm `.env` has your LAN IP, then restart Metro (`Ctrl+C`, then `npx expo start --tunnel`).
- **Network errors hitting Supabase/Next.js:** Make sure your computer and phone are on the same network and the Next.js server is running.
- **Missing native dependencies:** Run `npx expo install react-native-gesture-handler` (and any other package Expo suggests). Restart Expo afterwards.
- **Expo port conflicts:** Use `npx expo start --tunnel --port 8082` to force a custom port if needed.

---

## 8. Clean Exit
- Stop Expo with `Ctrl+C`.
- Stop Next.js (`Ctrl+C` in Terminal A).
- No further cleanup required unless you changed env variables.

Keep this file up to date when the startup process changes (new dependencies, different env vars, etc.).***
