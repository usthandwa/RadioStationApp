# Quick Start Guide - Using the New Refactored Code

## 📚 New Files Overview

### Constants (src/constants/)
```
theme.ts    - Colors, spacing, fonts, shadows, animations
urls.ts     - All external URLs (API, social, contact)
config.ts   - App configuration (routes, navigation, audio)
index.ts    - Export hub for all constants
```

### Utilities (src/utils/)
```
styles.ts      - Style helpers (shadows, layouts, positioning)
haptics.ts     - Haptic feedback functions
animations.ts  - Animation patterns
platform.ts    - Platform detection (already existed)
index.ts       - Export hub for all utilities
```

### Types (src/types/)
```
common.ts      - Common types (routes, cards, menus, etc.)
presenter.ts   - Presenter/Show types (updated)
```

### Components (src/components/ui/)
```
ErrorBoundary.tsx - Error boundary component
```

---

## 🚀 How to Use - Quick Examples

### 1. Using Colors

```typescript
// ❌ OLD
backgroundColor: '#07477B',
color: '#666666',

// ✅ NEW
import { Colors } from '@/constants/theme';

backgroundColor: Colors.primary,
color: Colors.text.secondary,
```

### 2. Using Spacing

```typescript
// ❌ OLD
padding: 16,
marginTop: 20,
gap: 8,

// ✅ NEW
import { Spacing } from '@/constants/theme';

padding: Spacing.lg,
marginTop: Spacing.xl,
gap: Spacing.sm,
```

### 3. Using Shadows

```typescript
// ❌ OLD
...Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  android: {
    elevation: 4,
  },
})

// ✅ NEW
import { getShadowStyle } from '@/utils/styles';

...getShadowStyle('md')
```

### 4. Using Haptics

```typescript
// ❌ OLD
if (Platform.OS === 'ios') {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

// ✅ NEW
import { triggerHaptic } from '@/utils/haptics';

triggerHaptic('light');
```

### 5. Using URLs

```typescript
// ❌ OLD
const url = 'https://iframe.iono.fm/s/187?background=c0cacb&accent=07477B';

// ✅ NEW
import { API_URLS } from '@/constants/urls';

const url = API_URLS.livestream.defaultIframe;
```

### 6. Using Routes

```typescript
// ❌ OLD
router.push('/live-stream' as any);

// ✅ NEW
import { ROUTES } from '@/constants/config';

router.push(ROUTES.livestream);
```

### 7. Using Animations

```typescript
// ❌ OLD
Animated.timing(opacity, {
  toValue: 1,
  duration: 400,
  delay: 100,
  useNativeDriver: true,
}).start();

// ✅ NEW
import { fadeIn } from '@/utils/animations';

fadeIn(opacity, 400, 100).start();
```

### 8. Using Error Boundary

```typescript
// ✅ NEW - Wrap your screens
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function MyScreen() {
  return (
    <ErrorBoundary>
      {/* Your screen content */}
    </ErrorBoundary>
  );
}
```

---

## 📦 Import Patterns

### Individual Imports (Recommended)
```typescript
import { Colors, Spacing, Shadows } from '@/constants/theme';
import { API_URLS, buildWhatsAppUrl } from '@/constants/urls';
import { ROUTES, MENU_ITEMS } from '@/constants/config';
import { getShadowStyle, circle } from '@/utils/styles';
import { triggerHaptic, withHapticSync } from '@/utils/haptics';
import { fadeIn, pressAnimation } from '@/utils/animations';
```

### Namespace Imports (Alternative)
```typescript
import Theme from '@/constants/theme';
import URLs from '@/constants/urls';
import Config from '@/constants/config';
import { styleUtils, hapticUtils, animationUtils } from '@/utils';

// Usage
backgroundColor: Theme.colors.primary
spacing: Theme.spacing.lg
url: URLs.livestream.defaultIframe
route: Config.ROUTES.home
```

---

## 🎯 Common Patterns

### Button with Haptic Feedback
```typescript
import { triggerHaptic } from '@/utils/haptics';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { getShadowStyle } from '@/utils/styles';

<TouchableOpacity
  style={{
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.lg,
    ...getShadowStyle('md'),
  }}
  onPress={() => {
    triggerHaptic('light');
    handlePress();
  }}
>
  <Text style={{ color: Colors.white }}>Press Me</Text>
</TouchableOpacity>
```

### Card with Animation
```typescript
import { useState, useRef } from 'react';
import { Animated } from 'react-native';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { getShadowStyle } from '@/utils/styles';
import { pressAnimation } from '@/utils/animations';

const scaleValue = useRef(new Animated.Value(1)).current;

<Animated.View
  style={{
    transform: [{ scale: scaleValue }],
  }}
>
  <Pressable
    style={{
      backgroundColor: Colors.white,
      padding: Spacing.lg,
      borderRadius: BorderRadius.md,
      ...getShadowStyle('lg'),
    }}
    onPressIn={() => pressAnimation(scaleValue).start()}
  >
    {/* Card content */}
  </Pressable>
</Animated.View>
```

### Circle Avatar
```typescript
import { Colors } from '@/constants/theme';
import { circle, getShadowStyle } from '@/utils/styles';

<View
  style={{
    ...circle(50),
    backgroundColor: Colors.primary,
    ...getShadowStyle('sm'),
  }}
>
  <Text style={{ color: Colors.white }}>AB</Text>
</View>
```

### Modal with Error Boundary
```typescript
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { Colors, Spacing } from '@/constants/theme';

<Modal visible={isVisible}>
  <ErrorBoundary>
    <View style={{ backgroundColor: Colors.white, padding: Spacing.xl }}>
      {/* Modal content */}
    </View>
  </ErrorBoundary>
</Modal>
```

---

## 🔄 Migration Checklist

When updating an existing component:

- [ ] Replace hardcoded colors with `Colors.*`
- [ ] Replace hardcoded spacing with `Spacing.*`
- [ ] Replace `Platform.select()` shadows with `getShadowStyle()`
- [ ] Replace haptics code with `triggerHaptic()`
- [ ] Replace hardcoded URLs with `API_URLS.*`
- [ ] Replace route strings with `ROUTES.*`
- [ ] Replace magic numbers with constants
- [ ] Add proper TypeScript types
- [ ] Wrap component in `<ErrorBoundary>`
- [ ] Test on both iOS and Android

---

## 📝 Example: Full Component Migration

### Before:
```typescript
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export default function MyButton({ onPress }) {
  const handlePress = () => {
    if (Platform.OS === 'ios') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress();
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>Click Me</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#07477B',
    padding: 16,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

### After:
```typescript
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@/constants/theme';
import { getShadowStyle } from '@/utils/styles';
import { triggerHaptic } from '@/utils/haptics';
import ErrorBoundary from '@/components/ui/ErrorBoundary';

interface MyButtonProps {
  onPress: () => void;
}

export default function MyButton({ onPress }: MyButtonProps) {
  const handlePress = () => {
    triggerHaptic('light');
    onPress();
  };

  return (
    <ErrorBoundary>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>Click Me</Text>
      </TouchableOpacity>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.md,
    ...getShadowStyle('md'),
  },
  text: {
    color: Colors.white,
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.semibold,
  },
});
```

**Improvements:**
- ✅ Type-safe props with TypeScript interface
- ✅ Colors from theme system
- ✅ Spacing from constants
- ✅ Font sizes and weights from theme
- ✅ Shadow utility function
- ✅ Haptics utility function
- ✅ Error boundary wrapper
- ✅ No hardcoded values
- ✅ Easier to maintain

---

## 🎓 Best Practices

### 1. Always Import from Constants
```typescript
// ✅ DO THIS
import { Colors, Spacing } from '@/constants/theme';

// ❌ NOT THIS
const primaryColor = '#07477B';
```

### 2. Use Utility Functions
```typescript
// ✅ DO THIS
...getShadowStyle('md')

// ❌ NOT THIS
...Platform.select({ ios: { ... }, android: { ... } })
```

### 3. Add Type Definitions
```typescript
// ✅ DO THIS
interface Props {
  title: string;
  onPress: () => void;
}

// ❌ NOT THIS
function MyComponent({ title, onPress }: any)
```

### 4. Wrap in Error Boundaries
```typescript
// ✅ DO THIS
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>

// ❌ NOT THIS
<MyComponent /> // Can crash entire app
```

### 5. Use Semantic Names
```typescript
// ✅ DO THIS
backgroundColor: Colors.primary
padding: Spacing.lg

// ❌ NOT THIS
backgroundColor: Colors.blue
padding: 16
```

---

## 🐛 Troubleshooting

### Import Errors
If you get import errors:
```bash
# Clear Metro bundler cache
npx expo start --clear
```

### Type Errors
If TypeScript complains:
```bash
# Restart TypeScript server in VSCode
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Path Alias Not Working
Make sure `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 📚 Reference Documentation

- [REFACTORING_REPORT.md](REFACTORING_REPORT.md) - Full problem analysis
- [REFACTORING_COMPLETE.md](REFACTORING_COMPLETE.md) - Complete refactoring summary
- [PLATFORM_FIXES.md](PLATFORM_FIXES.md) - Platform compatibility guide
- [test-platforms.md](test-platforms.md) - Testing checklist

---

## 🎉 Benefits of New System

1. **Maintainability**: Change colors/spacing in one place
2. **Consistency**: All components use same values
3. **Type Safety**: Catch errors at compile time
4. **Developer Experience**: Better autocomplete
5. **Performance**: Reusable utilities
6. **Scalability**: Easy to add new features
7. **Testability**: Isolated, testable utilities

---

*Quick Start Guide - December 4, 2025*
