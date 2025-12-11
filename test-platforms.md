# Platform Testing Guide

## Changes Made for Cross-Platform Compatibility

### 1. iOS Setup
✅ **CocoaPods Installation**
- Fixed UTF-8 encoding issues with CocoaPods
- Successfully installed all 96 pods including:
  - ExpoHaptics (13.0.1) - for haptic feedback
  - react-native-safe-area-context (4.10.5) - for safe areas
  - RNGestureHandler, RNReanimated - for animations

✅ **iOS Configuration**
- Info.plist properly configured with:
  - UIBackgroundModes: audio (for background playback)
  - Orientation locked to portrait
  - Deep linking schemes configured
  - App Transport Security configured

### 2. Android Setup
✅ **Gradle Configuration**
- Android build.gradle is properly configured
- Expo CLI integration for bundling
- Hermes engine enabled
- Auto-linking configured for RN 0.74.5

✅ **Android Permissions**
- AUDIO_RECORDING permission added
- Adaptive icon configured

### 3. Platform-Specific Code

#### Haptic Feedback
All interactive elements now have platform-aware haptic feedback:
```typescript
if (Platform.OS === 'ios') {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
```

Files using haptics:
- HomeScreen.tsx (cards, play button, refresh)
- AppNavigation.tsx (navigation taps)
- menu.tsx (navigation and back button)
- _layout.tsx (header buttons)

#### SafeAreaView
Using react-native-safe-area-context for proper safe area handling:
```typescript
<SafeAreaView edges={['top']} style={styles.headerSafeArea}>
```

Files using SafeAreaView:
- _layout.tsx (header)
- HomeScreen.tsx (full screen)
- PodcastsScreen.tsx

#### Platform-Specific Styling
All shadow/elevation styles use Platform.select():
```typescript
...Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  android: {
    elevation: 8,
  },
})
```

#### Platform Bottom Padding
Navigation bar has platform-specific bottom padding:
```typescript
paddingBottom: Platform.OS === 'ios' ? 28 : 12,
```

### 4. Navigation
✅ **Expo Router v3.5.24**
- File-based routing
- Slide animations on both platforms
- Gesture-enabled navigation
- Deep linking support

✅ **Consistent Navigation**
- Home button always routes to /
- Hamburger menu accessible from all screens
- Bottom navigation with 5 tabs
- Animated transitions

### 5. Animations
All animations use `useNativeDriver: true` for 60fps performance on both platforms:
- Card fade-in on mount
- Scale animations on press
- Spinning loader
- Navigation tab animations

## Testing Checklist

### iOS Testing
- [ ] Run on iOS Simulator: `npx expo run:ios`
- [ ] Verify haptic feedback works on physical device
- [ ] Check safe area insets on iPhone X and newer
- [ ] Test navigation animations are smooth
- [ ] Verify pull-to-refresh works
- [ ] Test background audio playback
- [ ] Check deep linking works
- [ ] Verify status bar appearance

### Android Testing
- [ ] Run on Android Emulator: `npx expo run:android`
- [ ] Test on physical device for haptics
- [ ] Verify elevation shadows render correctly
- [ ] Test navigation animations are smooth
- [ ] Verify pull-to-refresh works
- [ ] Test background audio playback
- [ ] Check deep linking works
- [ ] Verify status bar appearance

### Common Tests (Both Platforms)
- [ ] All navigation routes work correctly
- [ ] Cards animate on press
- [ ] Play/pause button works on Listen Live card
- [ ] Menu screen shows all routes
- [ ] Back button navigates to home
- [ ] Bottom navigation highlights active tab
- [ ] Images load correctly
- [ ] Text is readable on all screens
- [ ] No console errors or warnings

## Running the App

### Development Server
```bash
npx expo start
```
Then press:
- `i` for iOS Simulator
- `a` for Android Emulator
- Scan QR code with Expo Go app on physical device

### iOS Build
```bash
# Clear cache and rebuild
cd ios && pod install && cd ..
npx expo run:ios

# For specific device
npx expo run:ios --device
```

### Android Build
```bash
npx expo run:android

# For specific device
npx expo run:android --device
```

## Known Platform Differences

### iOS Specifics
- Haptic feedback is more refined on iOS
- Safe area insets are automatic on notched devices
- Shadows render more smoothly than Android elevation
- Audio continues in background by default (requires Info.plist config)

### Android Specifics
- Haptic feedback may vary by device manufacturer
- Safe area handling requires explicit configuration
- Elevation creates shadows but may not be as smooth
- Audio background mode requires foreground service for API 26+

## Troubleshooting

### iOS Issues
**Problem**: CocoaPods UTF-8 encoding error
**Solution**: Run `export LANG=en_US.UTF-8 && cd ios && pod install`

**Problem**: Xcode version incompatibility
**Solution**: Use Xcode ≤ 16.2.0 for Expo SDK 51

**Problem**: Safe area not working
**Solution**: Ensure `react-native-safe-area-context` is properly linked in Podfile

### Android Issues
**Problem**: Gradle build fails
**Solution**: Clear gradle cache `cd android && ./gradlew clean`

**Problem**: Metro bundler cache issues
**Solution**: `npx expo start --clear`

**Problem**: Native module linking issues
**Solution**: Run `npx expo prebuild --clean` and rebuild

## Utility Functions
Created `/src/utils/platform.ts` with helper functions:
- `isIOS()`, `isAndroid()`, `isWeb()`
- `getPlatformValue()` - for platform-specific values
- `getElevationStyle()` - generates shadow/elevation styles
- `hapticsAvailable()` - checks if haptics are supported
- `getIOSSafeAreaPadding()` - calculates iOS safe area
