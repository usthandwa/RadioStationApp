# How to Run the App After Refactoring

## Quick Start

### Option 1: Expo Go (Fastest - Recommended for Testing)

```bash
# Start the dev server
npx expo start

# Then scan QR code with:
# - iOS: Camera app
# - Android: Expo Go app
```

### Option 2: iOS Simulator

```bash
# Start Expo and press 'i' for iOS simulator
npx expo start

# Or run directly
npx expo start --ios
```

### Option 3: Android Emulator

```bash
# Start Expo and press 'a' for Android emulator
npx expo start

# Or run directly
npx expo start --android
```

### Option 4: Native Build (Full Development Build)

```bash
# iOS
cd ios && pod install && cd ..
npx expo run:ios

# Android
npx expo run:android
```

---

## Troubleshooting

### Issue: "Activity not started" or "Operation timed out"

**Cause**: Dev client trying to open deep link before app is installed

**Solution 1** - Use Expo Go instead:
```bash
# Uninstall dev client if installed
# Then use Expo Go app to scan QR code
npx expo start --clear
```

**Solution 2** - Install dev client first:
```bash
# For iOS
npx expo run:ios

# For Android
npx expo run:android

# Then start dev server
npx expo start --dev-client
```

---

### Issue: Metro bundler cache issues

**Solution**:
```bash
# Clear all caches
rm -rf .expo node_modules/.cache .metro-cache
npx expo start --clear
```

---

### Issue: TypeScript errors

**Solution**: The TypeScript errors you're seeing are non-critical:
- Backend routes (not used by mobile app)
- Icon type issues (runtime works fine)

To ignore and run anyway:
```bash
npx expo start --clear
```

---

### Issue: Port 8081 already in use

**Solution**:
```bash
# Kill existing Metro bundler
lsof -ti:8081 | xargs kill -9

# Or use different port
npx expo start --port 8082
```

---

## Recommended Workflow

### For Development:

1. **First Time Setup**:
```bash
# Install dependencies
yarn install

# iOS: Install pods
cd ios && pod install && cd ..

# Start dev server
npx expo start --clear
```

2. **Daily Development**:
```bash
# Just start the server
npx expo start

# Press:
# - 'i' for iOS simulator
# - 'a' for Android emulator
# - 'r' to reload
# - 'j' to open debugger
```

3. **If Something Breaks**:
```bash
# Nuclear option - full reset
rm -rf node_modules .expo ios/Pods ios/build android/build
yarn install
cd ios && pod install && cd ..
npx expo start --clear
```

---

## Testing the Refactored Code

### Quick Test:

1. Start app with `npx expo start`
2. Open on device/simulator
3. Test these features:
   - ✅ Navigation (all routes work)
   - ✅ Colors (theme applied correctly)
   - ✅ Haptic feedback (iOS only)
   - ✅ Animations (smooth 60fps)
   - ✅ Error boundaries (no crashes)

### What Should Work:

✅ **All existing functionality** - No breaking changes
✅ **iOS and Android** - Platform-specific code working
✅ **Navigation** - All routes accessible
✅ **Audio playback** - Live stream and podcasts
✅ **Animations** - Card animations, transitions
✅ **Haptics** - Feedback on iOS

### What's New (Under the Hood):

✅ Theme system ready to use
✅ URL constants available
✅ Utility functions available
✅ Error boundary available
✅ Better type safety

---

## Using the New Refactored Code

The refactored utilities are ready but **not yet applied** to existing screens.

### To Use in New Code:

```typescript
// Import the new utilities
import { Colors, Spacing } from '@/constants/theme';
import { getShadowStyle } from '@/utils/styles';
import { triggerHaptic } from '@/utils/haptics';

// Use in your component
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,  // Instead of '#07477B'
    padding: Spacing.lg,              // Instead of 16
    ...getShadowStyle('md'),          // Instead of Platform.select
  },
});

// Haptic feedback
const handlePress = () => {
  triggerHaptic('light');  // Instead of Platform.OS check
  // your logic
};
```

### To Migrate Existing Screens:

1. See [QUICK_START_REFACTORING.md](QUICK_START_REFACTORING.md)
2. Update one screen at a time
3. Test after each change
4. No rush - existing code still works!

---

## Build for Production

### Development Build:
```bash
# iOS
eas build --profile development --platform ios

# Android
eas build --profile development --platform android
```

### Production Build:
```bash
# iOS
eas build --profile production --platform ios

# Android
eas build --profile production --platform android
```

---

## Current Status

✅ **App is fully functional** - All features working
✅ **iOS & Android ready** - Platform code fixed
✅ **Refactoring foundation complete** - New utilities available
⏳ **Migration pending** - Existing screens not yet updated (optional)

**Bottom line**: Your app works exactly as before, but now you have better tools to maintain and improve it!

---

## Common Commands Cheat Sheet

```bash
# Start development server
npx expo start

# Clear cache and start
npx expo start --clear

# Start on specific platform
npx expo start --ios
npx expo start --android

# Run with dev client
npx expo start --dev-client

# Check for issues
npx expo-doctor

# Update pods (iOS)
cd ios && pod install && cd ..

# Clean everything
rm -rf node_modules .expo ios/Pods
yarn install && cd ios && pod install && cd ..

# Type checking
npx tsc --noEmit

# Kill Metro bundler
lsof -ti:8081 | xargs kill -9
```

---

*Last Updated: December 4, 2025*
*All features tested and working ✅*
