# Android Debugging Guide

## Current Status

✅ **Android Environment:**
- Emulator connected: `emulator-5554`
- Android Studio: 2025.2 AI-252.25557.131.2521.14344949
- Gradle: 8.8
- Hermes: Enabled

⚠️ **Note:** Android SDK path not found in environment

---

## Quick Debug Commands

### 1. Check Connected Devices
```bash
adb devices
```

### 2. View Android Logs (Real-time)
```bash
# All logs
adb logcat

# React Native logs only
adb logcat *:S ReactNative:V ReactNativeJS:V

# Expo logs
adb logcat | grep -i expo
```

### 3. Clear App Data
```bash
# Clear app cache
adb shell pm clear com.szama.awrsidmedia

# Reinstall app
adb uninstall com.szama.awrsidmedia
```

### 4. Debug Menu on Emulator
```bash
# Open React Native debug menu
adb shell input keyevent 82

# Or shake gesture
adb shell input keyevent 82
```

### 5. Reload App
```bash
# Send reload command
adb shell input text "RR"
```

---

## Build Commands

### Clean Build
```bash
cd android
./gradlew clean
cd ..
```

### Build Debug APK
```bash
cd android
./gradlew assembleDebug
cd ..
```

### Build Release APK
```bash
cd android
./gradlew assembleRelease
cd ..
```

### Run on Device
```bash
# Using Expo
npx expo run:android

# Or direct React Native
npx react-native run-android
```

---

## Common Issues & Fixes

### Issue 1: Build Failed - Gradle Issues
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleDebug --stacktrace
```

### Issue 2: Metro Bundler Port Issues
```bash
# Kill existing Metro
lsof -ti:8081 | xargs kill -9

# Start fresh
npx expo start --clear
```

### Issue 3: App Crashes on Startup
```bash
# View crash logs
adb logcat | grep -i "crash\|error\|exception"

# Check specific error
adb logcat AndroidRuntime:E *:S
```

### Issue 4: White Screen / Bundle Not Found
```bash
# Clear cache and rebuild
rm -rf android/app/build
cd android && ./gradlew clean && cd ..
npx expo start --clear
npx expo run:android
```

### Issue 5: Native Module Linking Issues
```bash
# Clear and reinstall
rm -rf node_modules android/build android/app/build
yarn install
cd android && ./gradlew clean && cd ..
npx expo run:android
```

---

## Debug Build Process

### Step 1: Clean Everything
```bash
# Clean build directories
rm -rf android/build android/app/build

# Clean Gradle cache
cd android && ./gradlew clean && cd ..

# Clean Metro cache
rm -rf .metro-cache .expo
```

### Step 2: Rebuild
```bash
# Build and install
npx expo run:android
```

### Step 3: Monitor Logs
```bash
# In another terminal
adb logcat | grep -E "ReactNative|Expo|Error"
```

---

## Debugging Specific Issues

### Check Icon Warnings
```bash
adb logcat | grep -i "icon\|fontawesome"
```

### Check JavaScript Errors
```bash
adb logcat | grep -i "javascript\|js\|typescript"
```

### Check Network Issues
```bash
adb logcat | grep -i "network\|http\|fetch"
```

### Check Audio/Media Issues
```bash
adb logcat | grep -i "audio\|media\|track"
```

---

## Performance Debugging

### Enable Performance Monitor
1. Shake device (Cmd+M in emulator)
2. Select "Show Perf Monitor"

### Check Memory Usage
```bash
adb shell dumpsys meminfo com.szama.awrsidmedia
```

### Check CPU Usage
```bash
adb shell top | grep awrsidmedia
```

---

## React Native Debugger

### Enable Remote Debugging
1. Shake device (Cmd+M)
2. Select "Debug"
3. Opens Chrome DevTools

### Enable Hermes Debugger
1. In Chrome, go to: `chrome://inspect`
2. Click "Configure"
3. Add `localhost:8081`

---

## APK Location After Build

Debug APK:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Release APK:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## Install APK Manually

```bash
# Install debug APK
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Install with replace
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Environment Setup (If SDK Not Found)

### Set Android SDK Path
```bash
# Add to ~/.zshrc or ~/.bashrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Reload
source ~/.zshrc
```

---

## Testing Checklist

### After Build Success:
- [ ] App launches without crash
- [ ] Navigation works (all tabs)
- [ ] Icons display correctly (no warnings)
- [ ] Live stream plays
- [ ] Podcasts load
- [ ] Colors match theme (using new constants)
- [ ] Haptic feedback works (if device supports)
- [ ] No console warnings about icons
- [ ] No memory leaks (check after 5 min usage)

---

## Current Build Status

**Building...** Check the build output for:
- ✅ Gradle sync successful
- ✅ Dependencies resolved
- ✅ Compilation successful
- ✅ APK generated
- ✅ Installed on device

**Monitor with:**
```bash
# Watch build progress
tail -f /tmp/android-build.log

# Or watch logcat
adb logcat | grep -E "Build|Install|Launch"
```

---

## Quick Fixes Reference

| Problem | Solution |
|---------|----------|
| Build failed | `cd android && ./gradlew clean` |
| White screen | `npx expo start --clear` |
| Metro port busy | `lsof -ti:8081 \| xargs kill -9` |
| App not installing | `adb uninstall com.szama.awrsidmedia` |
| Native module error | `rm -rf node_modules && yarn install` |
| Gradle cache issues | `cd android && ./gradlew clean --refresh-dependencies` |

---

*Debug session started: December 5, 2025*
*Emulator: emulator-5554*
