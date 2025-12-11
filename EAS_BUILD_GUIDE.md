# EAS Build Guide

## Current Build Status

**Started:** December 11, 2025

### Builds Triggered:
1. ✅ **Android** - Development build
2. ✅ **iOS** - Development build

**Profile:** `development`
**Distribution:** Internal
**SDK:** 51.0.0

---

## EAS Configuration

**From eas.json:**
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

**Project Details:**
- Owner: `szama`
- Project ID: `606a74fb-bd0d-4277-8b90-31acec54833f`
- App: `@szama/awrsidmedia`

---

## Monitor Build Progress

### Check Build Status
```bash
# List all builds
npx eas-cli build:list

# Check specific platform
npx eas-cli build:list --platform android
npx eas-cli build:list --platform ios

# Check in-progress builds only
npx eas-cli build:list --status in-progress

# Follow build logs
npx eas-cli build:view [BUILD_ID]
```

### Build Dashboard
Visit: https://expo.dev/accounts/szama/projects/awrsidmedia/builds

---

## Download Built Apps

### After Build Completes

**Download Android APK:**
```bash
# Download latest Android build
npx eas-cli build:download --platform android --profile development

# Or specific build
npx eas-cli build:download --id [BUILD_ID]
```

**Download iOS IPA:**
```bash
# Download latest iOS build
npx eas-cli build:download --platform ios --profile development

# Or specific build
npx eas-cli build:download --id [BUILD_ID]
```

---

## Install Built Apps

### Android Installation

**Option 1: ADB Install**
```bash
# Download APK first
npx eas-cli build:download --platform android

# Install on connected device/emulator
adb install -r awrsidmedia-[hash].apk
```

**Option 2: Direct Download**
1. Get artifact URL from build details
2. Download on device
3. Install APK

**Option 3: QR Code**
```bash
# Generate install QR code
npx eas-cli build:download --platform android --output qr
```

### iOS Installation

**Option 1: Direct Install (Ad Hoc)**
```bash
# Download IPA
npx eas-cli build:download --platform ios

# Install via Xcode or Apple Configurator
```

**Option 2: TestFlight**
```bash
# Submit to TestFlight
npx eas-cli submit --platform ios
```

**Option 3: Internal Distribution**
1. Register device UDID in Apple Developer
2. Build with ad-hoc provisioning
3. Install via OTA or direct install

---

## Build Types

### Development Build
```bash
# Android
npx eas-cli build --platform android --profile development

# iOS
npx eas-cli build --platform ios --profile development

# Both
npx eas-cli build --platform all --profile development
```

**Features:**
- Development client included
- Debug-friendly
- Can connect to local dev server
- Internal distribution

### Preview Build
```bash
npx eas-cli build --platform all --profile preview
```

**Features:**
- Production-like but not final
- Internal testing
- No development tools

### Production Build
```bash
npx eas-cli build --platform all --profile production
```

**Features:**
- Release-ready
- Auto-increment version
- Optimized for stores
- App Store / Play Store ready

---

## Build Commands Reference

### Start Builds
```bash
# Single platform
npx eas-cli build --platform android
npx eas-cli build --platform ios

# Both platforms
npx eas-cli build --platform all

# Specific profile
npx eas-cli build --platform all --profile development
npx eas-cli build --platform all --profile production

# Non-interactive
npx eas-cli build --platform all --non-interactive
```

### Manage Builds
```bash
# List builds
npx eas-cli build:list

# View build details
npx eas-cli build:view [BUILD_ID]

# Cancel build
npx eas-cli build:cancel [BUILD_ID]

# Download build
npx eas-cli build:download [BUILD_ID]

# Configure builds
npx eas-cli build:configure
```

### Credentials
```bash
# Manage Android credentials
npx eas-cli credentials

# Setup push notifications
npx eas-cli credentials:push

# Setup app signing
npx eas-cli credentials:android
npx eas-cli credentials:ios
```

---

## Troubleshooting

### Build Failed - Check Logs
```bash
# View build logs
npx eas-cli build:view [BUILD_ID]

# Or visit web dashboard
# https://expo.dev/accounts/szama/projects/awrsidmedia/builds
```

### Common Issues

**Issue: Build fails during dependencies install**
```bash
# Clear package-lock and retry
rm -rf node_modules package-lock.json yarn.lock
yarn install
npx eas-cli build --platform all --clear-cache
```

**Issue: iOS provisioning errors**
```bash
# Regenerate credentials
npx eas-cli credentials:ios

# Or let EAS manage
npx eas-cli build --platform ios --auto-submit
```

**Issue: Android signing errors**
```bash
# Check/regenerate keystore
npx eas-cli credentials:android
```

**Issue: Build takes too long**
- Typical build time: 10-20 minutes
- Check build queue: https://expo.dev/eas
- Free tier has queue limits

---

## Testing Refactored Code

### After Build Downloads

**Test Checklist:**
1. **App Launches** ✓
   - No crash on startup
   - Splash screen displays

2. **Navigation** ✓
   - All tabs work
   - Hamburger menu functions
   - Back navigation works

3. **Icons** ✓
   - All icons display correctly
   - No "invalid icon" warnings
   - Prayer icon shows (praying-hands)

4. **Theme System** ✓
   - Colors match (using Colors.primary, etc.)
   - Spacing consistent
   - Shadows render correctly

5. **Features** ✓
   - Live stream plays
   - Podcasts load
   - Give page works
   - Prayer WhatsApp link works
   - About page displays

6. **Performance** ✓
   - Smooth animations (60fps)
   - No memory leaks
   - Fast navigation

7. **Platform-Specific** ✓
   - iOS: Haptic feedback works
   - Android: Navigation gestures work
   - Both: Audio plays correctly

---

## Build Artifacts

### Latest Successful Build

**Previous iOS Build:**
- Build ID: `6cdcc101-bc5a-453a-a361-ed47a4246e5f`
- Status: Finished
- SDK: 51.0.0
- Version: 1.0.0 (Build 5)
- Download: https://expo.dev/artifacts/eas/erFwmpjHn8nA1hen1C7aGt.ipa

### Current Builds
Check status with:
```bash
npx eas-cli build:list --limit 5
```

---

## Submit to Stores

### Google Play Store (Android)
```bash
# Build production APK/AAB
npx eas-cli build --platform android --profile production

# Submit to Play Store
npx eas-cli submit --platform android
```

### Apple App Store (iOS)
```bash
# Build production IPA
npx eas-cli build --platform ios --profile production

# Submit to App Store
npx eas-cli submit --platform ios
```

---

## Local vs Cloud Builds

### Cloud Builds (EAS) - Current Method
**Pros:**
- ✅ No local environment setup needed
- ✅ Consistent build environment
- ✅ Handles signing automatically
- ✅ Build logs saved
- ✅ Easy distribution

**Cons:**
- ⏱️ Slower (queue time + build time)
- 💰 Free tier limits
- 🌐 Requires internet

### Local Builds
**Android:**
```bash
npx expo run:android --variant release
```

**iOS:**
```bash
npx expo run:ios --configuration Release
```

**Pros:**
- ⚡ Faster (no queue)
- 🆓 No build limits
- 🔧 Full control

**Cons:**
- Requires setup (Android SDK, Xcode)
- Manual signing configuration
- Platform-specific (can't build iOS on non-Mac)

---

## Quick Reference

| Task | Command |
|------|---------|
| Build both platforms | `npx eas-cli build --platform all` |
| List builds | `npx eas-cli build:list` |
| Download build | `npx eas-cli build:download` |
| View build logs | `npx eas-cli build:view [ID]` |
| Cancel build | `npx eas-cli build:cancel [ID]` |
| Submit to stores | `npx eas-cli submit` |
| Manage credentials | `npx eas-cli credentials` |
| Build dashboard | https://expo.dev |

---

## What's Next

1. **Wait for builds to complete** (~10-20 min)
2. **Download artifacts** when ready
3. **Test on physical devices**
4. **Verify refactoring** (theme, icons, navigation)
5. **Submit to stores** (if ready for production)

---

*Build started: December 11, 2025*
*Profile: development*
*Platforms: Android + iOS*
