# Expo Go Fixed ✅

## Problem
Your app requires custom native packages (notifications, background tasks, image picker) that aren't included in the standard Expo Go app from the App Store.

## Solution
**Build a Development Build** - Your own custom version of Expo Go that includes all your packages.

### Also Fixed
Network configuration updated to use your **network IP address** (`192.168.0.188`) instead of localhost, so your device can connect to the local CMS API.

---

## Changes Made

### 1. Updated app.json
**Changed API URL from:**
```json
"apiUrl": "http://localhost:3001/api"
```

**To:**
```json
"apiUrl": "http://192.168.0.188:3001/api"
```

### 2. Updated CMS Server CORS
**Added network IP origins to allow connections:**
```typescript
origin: [
  'http://localhost:19006',
  'http://localhost:19000',
  'http://localhost:8081',
  'exp://localhost:19000',
  'http://192.168.0.188:8081',   // ← NEW
  'http://192.168.0.188:19000',  // ← NEW
  'http://192.168.0.188:19006'   // ← NEW
]
```

### 3. Restarted Services
- ✅ CMS server restarted with new CORS config
- ✅ Expo cleared cache and restarted
- ✅ Both services running on network IP

---

## Current Status

### CMS API Server
- **URL**: http://192.168.0.188:3001
- **Status**: ✅ Running
- **Test**: `curl http://192.168.0.188:3001/api/health`

### Expo Development Server
- **Status**: ✅ Starting/Running
- **Port**: 8081
- **Cache**: Cleared

---

## How to Use

### Step 1: Build Your Development Build

**For iOS:**
```bash
npx eas-cli build --profile development --platform ios
```

**For Android:**
```bash
npx eas-cli build --profile development --platform android
```

This creates your custom app with all features. See [DEVELOPMENT_BUILD_GUIDE.md](DEVELOPMENT_BUILD_GUIDE.md) for complete instructions.

### Step 2: Install on Your Device

1. Build completes → Get download URL
2. Open URL on your device
3. Install the app (like installing TestFlight app)

### Step 3: Start Development

```bash
# Terminal 1: Start CMS Server
./start-cms-server.sh

# Terminal 2: Start Expo
npx expo start --dev-client
```

### Step 4: Connect

1. **Make sure your phone is on the SAME Wi-Fi network** (192.168.0.x network)
2. **Open your development build app** (not Expo Go from App Store)
3. **Scan the QR code** shown in terminal
4. **App loads** and connects to:
   - Expo dev server: `http://192.168.0.188:8081`
   - CMS API: `http://192.168.0.188:3001/api`

---

## Testing the Connection

### Test CMS API from your phone's browser:
Open Safari (iOS) or Chrome (Android) and visit:
```
http://192.168.0.188:3001/api/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T20:00:33.155Z",
  "uptime": 7.5
}
```

### Test from terminal:
```bash
# Test with network IP
curl http://192.168.0.188:3001/api/health

# Get presenters
curl http://192.168.0.188:3001/api/presenters

# Get shows
curl http://192.168.0.188:3001/api/shows
```

---

## Important Notes

### ⚠️ IP Address May Change
If you:
- Restart your computer
- Change Wi-Fi networks
- Your router reassigns IPs

You'll need to:
1. Get your new IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Update `app.json` with new IP
3. Update `cms-server/server.ts` CORS origins
4. Restart both services

### 💡 For Development on Same Machine
If developing on the same machine (not using physical device):
- Change back to `http://localhost:3001/api` in `app.json`
- Faster and no IP changes to worry about

### 🔒 Network Security
Your CMS API is accessible to any device on your local network at `http://192.168.0.188:3001`. This is fine for development but:
- Don't use this setup in production
- Add authentication before deploying
- Use HTTPS in production

---

## Quick Reference Commands

### Start CMS Server:
```bash
./start-cms-server.sh
# or
cd cms-server && yarn dev
```

### Start Expo:
```bash
npx expo start --clear
```

### Get Current IP:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

### Test Services:
```bash
# CMS API
curl http://192.168.0.188:3001/api/health

# Expo Metro
curl http://192.168.0.188:8081
```

---

## Troubleshooting

### Can't Connect from Phone

1. **Check Wi-Fi**: Phone and computer on same network?
   ```bash
   # On computer - check IP
   ifconfig | grep "inet "

   # Should show 192.168.0.x
   ```

2. **Check CMS Server Running**:
   ```bash
   curl http://192.168.0.188:3001/api/health
   ```

3. **Check Expo Running**:
   - Look for QR code in terminal
   - Should show URL: `exp://192.168.0.188:8081`

4. **Restart Everything**:
   ```bash
   # Stop CMS
   lsof -ti:3001 | xargs kill -9

   # Stop Expo
   lsof -ti:8081 | xargs kill -9

   # Start CMS
   ./start-cms-server.sh

   # Start Expo
   npx expo start --clear
   ```

### Firewall Issues
If Mac firewall is blocking:
```bash
# System Settings → Network → Firewall
# Allow Node.js to accept incoming connections
```

---

## Summary

✅ **Fixed**: App can now connect to local CMS API from Expo Go on physical devices

✅ **Network IP**: Using `192.168.0.188` instead of `localhost`

✅ **CORS Updated**: Server accepts connections from network IP

✅ **Services Running**:
- CMS API: http://192.168.0.188:3001
- Expo Metro: http://192.168.0.188:8081

✅ **Ready to Use**: Scan QR code in Expo Go app on your phone!

---

*Fixed: December 11, 2025*
*Your Network IP: 192.168.0.188*
