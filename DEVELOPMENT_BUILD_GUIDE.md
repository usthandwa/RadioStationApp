# Development Build Guide

## What is a Development Build?

A **Development Build** is like a custom version of Expo Go made specifically for your app. It includes:
- ✅ All your native packages (notifications, background fetch, image picker, etc.)
- ✅ Expo Go-like experience (scan QR, instant reload, debugging)
- ✅ Works on physical devices
- ✅ Full app functionality with all features

**Think of it as:** Your own personal Expo Go app with all your custom native code baked in.

---

## Why You Need It

Your app uses these packages that require native code:
- `expo-dev-client` - Development tools
- `expo-notifications` - Push notifications
- `expo-background-fetch` - Background tasks
- `expo-image-picker` - Camera/gallery access
- `react-native-webview` - WebView component

**Standard Expo Go** from the App Store doesn't include these, so you need to build your own version.

---

## How to Build & Install

### Option 1: Build with EAS (Cloud Build) ⭐ Recommended

#### For iOS:

```bash
# Start the build
npx eas-cli build --profile development --platform ios

# During build, you'll be asked:
# 1. "Do you want to log in to your Apple account?" → YES
#    - Enter your Apple ID (needs to be enrolled in Apple Developer Program)
# 2. "Generate a new Apple Distribution Certificate?" → YES
# 3. "Generate a new Apple Provisioning Profile?" → YES
```

**After build completes:**
1. You'll get a URL to download the `.ipa` file
2. Open this URL on your iPhone in Safari
3. Tap "Install"
4. Go to Settings → General → VPN & Device Management
5. Trust the developer certificate
6. Open the app from your home screen

#### For Android:

```bash
# Start the build
npx eas-cli build --profile development --platform android

# This will:
# 1. Build an APK/AAB file
# 2. Give you a download link
```

**After build completes:**
1. Open the download URL on your Android device
2. Download the APK
3. Allow installation from unknown sources if prompted
4. Install and open

### Option 2: Build Locally (Faster, but requires Xcode/Android Studio)

#### For iOS (requires Mac with Xcode):

```bash
# Install CocoaPods dependencies
cd ios && export LANG=en_US.UTF-8 && pod install && cd ..

# Build and install on connected device
npx expo run:ios --device

# Or for simulator
npx expo run:ios
```

#### For Android:

```bash
# Build and install on connected device
npx expo run:android --device

# Or for emulator
npx expo run:android
```

---

## How to Use After Installation

### 1. Start the Development Server

```bash
# Make sure CMS server is running
./start-cms-server.sh

# In another terminal, start Expo
npx expo start --dev-client
```

### 2. Connect Your Device

**Option A: Scan QR Code**
- Open your development build app on your device
- Tap "Scan QR Code"
- Scan the QR code from terminal

**Option B: Enter URL Manually**
- Open your development build app
- Tap "Enter URL manually"
- Enter: `exp://192.168.0.188:8081`

### 3. Develop!
- ✅ Make code changes → App reloads automatically
- ✅ Full debugging support
- ✅ All native features work
- ✅ Shake device for dev menu

---

## Current Configuration

### Network Setup ✅
- **Your IP**: `192.168.0.188`
- **CMS API**: `http://192.168.0.188:3001/api`
- **Expo Metro**: `http://192.168.0.188:8081`

### Build Profiles (eas.json)

**Development** (Current)
```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal"
  }
}
```
- ✅ Includes dev tools
- ✅ Internal distribution (no App Store)
- ✅ For testing and development

**Preview**
```json
{
  "preview": {
    "distribution": "internal"
  }
}
```
- For stakeholder testing
- Production-like build
- Internal distribution

**Production**
```json
{
  "production": {
    "autoIncrement": true
  }
}
```
- App Store/Play Store builds
- Auto-increments version
- Production optimizations

---

## Build Commands Reference

### Development Builds
```bash
# iOS development build
npx eas-cli build --profile development --platform ios

# Android development build
npx eas-cli build --profile development --platform android

# Both platforms
npx eas-cli build --profile development --platform all
```

### Preview Builds
```bash
# iOS preview
npx eas-cli build --profile preview --platform ios

# Android preview
npx eas-cli build --profile preview --platform android
```

### Production Builds
```bash
# iOS production
npx eas-cli build --profile production --platform ios

# Android production
npx eas-cli build --profile production --platform android
```

### Local Builds
```bash
# iOS (requires Mac + Xcode)
npx expo run:ios --device

# Android
npx expo run:android --device
```

---

## Troubleshooting

### Build Fails: "Input is required, but stdin is not readable"

**Cause:** EAS needs your Apple credentials interactively.

**Solution:** Run the build command in an interactive terminal (not background):
```bash
npx eas-cli build --profile development --platform ios
```

Then follow the prompts to:
1. Log in with Apple ID
2. Generate certificates
3. Generate provisioning profiles

### "No development build installed" Error

**Cause:** You haven't installed the development build yet.

**Solution:**
1. Complete the EAS build (see above)
2. Download and install on device
3. Then run `npx expo start --dev-client`

### Can't Connect to Development Server

**Check:**
1. Both device and computer on same Wi-Fi (`192.168.0.x` network)
2. CMS server running: `curl http://192.168.0.188:3001/api/health`
3. Expo running: `npx expo start --dev-client`
4. Firewall allows Node.js connections

### Certificate/Provisioning Issues (iOS)

**Option 1:** Let EAS manage everything (easiest)
- Just say YES to all prompts
- EAS will generate certificates automatically

**Option 2:** Use existing certificates
- Have your Apple Developer certificates ready
- Upload them to EAS

**Option 3:** Build locally
- Use `npx expo run:ios` instead
- Xcode manages certificates

---

## What's Different from Standard Expo Go?

| Feature | Expo Go (App Store) | Development Build (Your Custom App) |
|---------|---------------------|--------------------------------------|
| Installation | Download from store | Build and install yourself |
| Native Packages | Limited set only | ALL your packages |
| Updates | Managed by Expo | You control updates |
| Notifications | ❌ Limited | ✅ Full support |
| Background Tasks | ❌ No | ✅ Yes |
| Image Picker | ✅ Basic | ✅ Full features |
| WebView | ✅ Basic | ✅ Full features |
| Custom Native Code | ❌ No | ✅ Yes |

---

## Quick Start (TL;DR)

### First Time Setup:

```bash
# 1. Build for your platform (iOS example)
npx eas-cli build --profile development --platform ios

# 2. Follow prompts (log in with Apple ID, generate certs)

# 3. Download and install on device

# 4. Start CMS server
./start-cms-server.sh

# 5. Start Expo
npx expo start --dev-client

# 6. Open your custom dev build app and scan QR
```

### Daily Development:

```bash
# Terminal 1: CMS Server
./start-cms-server.sh

# Terminal 2: Expo
npx expo start --dev-client

# On device: Open dev build app → Scan QR → Develop!
```

---

## Benefits of This Setup

✅ **Full Feature Access**: All native packages work
✅ **Fast Iteration**: Code changes reload instantly
✅ **Network API**: Connect to local CMS server at `192.168.0.188:3001`
✅ **Debugging**: Full React Native debugging tools
✅ **No App Store**: Test without App Store review process
✅ **Multi-Device**: Install on multiple test devices
✅ **Production-Ready**: Same build process for production

---

## Next Steps

1. **Build Development Build**:
   ```bash
   npx eas-cli build --profile development --platform ios
   ```

2. **Install on Device**: Download from build URL

3. **Start Development**:
   ```bash
   ./start-cms-server.sh
   npx expo start --dev-client
   ```

4. **Connect**: Open dev build app → Scan QR

5. **Develop**: Make changes → See updates instantly

---

## Important Notes

### Apple Developer Account Required (iOS)
- Need enrolled Apple Developer account ($99/year)
- Or use local build with Xcode (free)

### Android No Account Required
- Just build and install APK
- No Google Play enrollment needed for testing

### Rebuild When to Update
Rebuild development build when you:
- Add new native packages (npm install)
- Change native configuration (app.json, AndroidManifest, Info.plist)
- Update Expo SDK version

Don't need to rebuild for:
- JavaScript/TypeScript code changes
- Style updates
- Component changes
- Most configuration changes

---

## Resources

- **EAS Build Docs**: https://docs.expo.dev/build/introduction/
- **Development Builds**: https://docs.expo.dev/develop/development-builds/introduction/
- **EAS CLI**: https://docs.expo.dev/eas/cli/
- **Troubleshooting**: https://docs.expo.dev/build-reference/troubleshooting/

---

*Your Network IP: 192.168.0.188*
*CMS API: http://192.168.0.188:3001/api*
*Expo Metro: http://192.168.0.188:8081*
