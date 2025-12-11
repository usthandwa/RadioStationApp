# Build Development Builds Now 🚀

## Status

✅ **Network configured**: `192.168.0.188`
✅ **CMS API ready**: Running at `http://192.168.0.188:3001`
✅ **Expo configured**: Ready to build
✅ **Build optimized**: Created `.easignore` to reduce upload size from 150MB

---

## What You Need to Do

### Build Both Platforms

Run these commands in **separate terminal windows** (or run them sequentially):

#### Terminal 1: Build Android
```bash
npx eas-cli build --profile development --platform android
```

This will:
- ✅ Build Android APK with all features
- ✅ No login required
- ✅ Takes ~10-15 minutes
- ✅ Gives you download link when done

#### Terminal 2: Build iOS
```bash
npx eas-cli build --profile development --platform ios
```

This will ask you to:
1. **Log in with Apple ID** - Enter your Apple Developer account
2. **Generate certificates** - Say YES to all prompts
3. **Build** - Takes ~10-15 minutes
4. **Download link** - You'll get a URL when done

---

## After Builds Complete

### For Android:

1. **Open download link** on your Android device
2. **Download APK**
3. **Install** (allow unknown sources if asked)
4. **Open app** - You'll see awrsidmedia icon

### For iOS:

1. **Open download link** on your iPhone (in Safari)
2. **Tap Install**
3. **Go to Settings** → General → VPN & Device Management
4. **Trust the certificate**
5. **Open app** - You'll see awrsidmedia icon

---

## Then Start Development

Once both apps are installed:

```bash
# Start everything
./start-dev.sh
```

This starts:
- CMS API at `http://192.168.0.188:3001`
- Expo at `http://192.168.0.188:8081`

Then:
1. **Open dev build app** on your device
2. **Scan QR code** from terminal
3. **Start coding!**

---

## Quick Build Commands

### Use the helper script:
```bash
# Android only
./build-dev.sh android

# iOS only
./build-dev.sh ios

# Both platforms
./build-dev.sh all
```

### Or use EAS directly:
```bash
# Android
npx eas-cli build --profile development --platform android

# iOS
npx eas-cli build --profile development --platform ios

# Both (sequential)
npx eas-cli build --profile development --platform all
```

---

## Troubleshooting

### Upload Failed (Network Error)

**If you see**: "Failed to upload... write EPIPE"

**Solution**:
1. Check your internet connection
2. Retry the build command
3. The `.easignore` file now reduces upload size

### Apple Login Required (iOS)

**If you see**: "Do you want to log in to your Apple account?"

**Solution**:
1. You need an Apple Developer account ($99/year)
2. **OR** build locally with Xcode (free):
   ```bash
   cd ios && export LANG=en_US.UTF-8 && pod install && cd ..
   npx expo run:ios --device
   ```

### Build Takes Too Long

**Normal**: Builds take 10-15 minutes on EAS

**Check status**:
```bash
npx eas-cli build:list
```

Or check the EAS dashboard:
https://expo.dev/accounts/szama/projects/awrsidmedia/builds

---

## What Gets Built

### Development Profile (`eas.json`)
```json
{
  "development": {
    "developmentClient": true,
    "distribution": "internal"
  }
}
```

**Includes:**
- ✅ All native packages (notifications, background tasks, etc.)
- ✅ Development tools (shake for menu, fast refresh)
- ✅ Connect to Expo dev server
- ✅ Install on multiple devices
- ❌ Not for App Store (internal testing only)

---

## Summary

**Right now, run these two commands:**

```bash
# In terminal 1
npx eas-cli build --profile development --platform android

# In terminal 2
npx eas-cli build --profile development --platform ios
```

**Then:**
1. Wait for builds (~10-15 min each)
2. Download and install on devices
3. Run `./start-dev.sh`
4. Open app → Scan QR → Develop!

---

## Files Created

✅ `.easignore` - Reduces build size
✅ `build-dev.sh` - Helper script for building
✅ `start-dev.sh` - Helper script for development
✅ `QUICK_START.md` - Complete development guide
✅ `DEVELOPMENT_BUILD_GUIDE.md` - Detailed build instructions

**Everything is ready! Just run the build commands above.** 🎉

---

*Created: December 11, 2025*
*Network IP: 192.168.0.188*
