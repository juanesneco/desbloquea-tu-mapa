#!/bin/bash

echo "🚀 Starting Desbloquea Tu Mapa App"
echo ""
echo "Opening two terminal windows..."
echo ""

# Terminal 1: Mobile App
osascript -e 'tell application "Terminal" to do script "cd '"$(pwd)"'/app/mobile && npm start"'

# Terminal 2: Next.js API
osascript -e 'tell application "Terminal" to do script "cd '"$(pwd)"'/app && npm run dev"'

echo "✅ Two terminal windows opened!"
echo ""
echo "📱 Next steps:"
echo "1. Wait for QR code in Terminal 1"
echo "2. Open Expo Go on your phone"
echo "3. Scan the QR code"
echo ""
