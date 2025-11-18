# Desbloquea Tu Mapa - Mobile App

Expo Go mobile app for Desbloquea Tu Mapa with Supabase integration, authentication, and AI-powered image analysis.

## Features

- **Authentication**: Sign up and sign in with Supabase Auth
- **Role-based Access**: Viewers can browse, Contributors can upload
- **Image Upload**: Camera or gallery picker
- **AI Analysis**: Automatic classification into Fases, Sub-etapas, and Mapas
- **Gallery**: Browse all images with search and filtering
- **Offline Support**: Basic error handling

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `mobile/` directory:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Or set them in `app.json` under `expo.extra`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://xxxxx.supabase.co",
      "supabaseAnonKey": "eyJhbGci...",
      "apiUrl": "http://localhost:3000"
    }
  }
}
```

### 3. Run the App

```bash
# Start Expo
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Project Structure

```
mobile/
├── src/
│   ├── lib/
│   │   └── supabase.ts          # Supabase client and functions
│   ├── types/
│   │   └── index.ts              # TypeScript types
│   ├── screens/
│   │   ├── AuthScreen.tsx        # Login/signup
│   │   ├── HomeScreen.tsx        # Home screen
│   │   ├── UploadScreen.tsx      # Image upload (contributor only)
│   │   └── GalleryScreen.tsx     # Image gallery
│   ├── hooks/
│   │   └── useAuth.ts            # Authentication hook
│   └── navigation/
│       └── AppNavigator.tsx      # Navigation setup
├── App.tsx                       # Root component
└── app.json                      # Expo configuration
```

## Database Schema

The app uses the following Supabase tables:

- `fases` - 3 main phases (Inconsciencia, Consciencia, Creación)
- `sub_etapas` - 11 sub-stages within phases
- `mapas` - 4 territories (Mental, Físico, Familiar, Financiero)
- `images` - Image metadata with foreign keys to above tables
- `user_roles` - User role assignments (viewer/contributor)

## Authentication

- New users default to "viewer" role
- Only "contributor" role can upload images
- Admins can upgrade users via Supabase dashboard

## API Integration

The app calls the Next.js API route at `/api/analyze` for secure AI image analysis. Make sure your Next.js app is running and accessible.

## Development

### Testing on Expo Go

1. Install Expo Go on your phone
2. Run `npm start`
3. Scan the QR code with Expo Go

### Building for Production

```bash
# iOS
eas build --platform ios

# Android
eas build --platform android
```

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env` file exists with correct values
- Or set values in `app.json` under `expo.extra`

### "Failed to analyze image"
- Check that Next.js API is running
- Verify `EXPO_PUBLIC_API_URL` is correct
- Check OpenAI API key is configured in Next.js app

### "Only contributors can upload"
- Contact admin to upgrade your role in Supabase dashboard
- Insert into `user_roles` table: `{ user_id: '...', role: 'contributor' }`

## License

ISC © 2025 Juanes Necoechea

