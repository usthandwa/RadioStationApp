/**
 * Theme Constants
 * Centralized color palette and styling constants
 */

export const Colors = {
  // Brand Colors
  primary: '#07477B',
  primaryDark: '#053759',
  primaryLight: '#0A5E9F',

  // Accent Colors
  secondary: '#c0cacb',
  accent: '#1E88E5',

  // Social Media Colors
  whatsapp: '#25D366',
  facebook: '#1877F2',
  instagram: '#E4405F',
  youtube: '#FF0000',
  twitter: '#1DA1F2',

  // Status Colors
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',
  info: '#3498DB',

  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F5F5F5',
    100: '#E8E8E8',
    200: '#E0E0E0',
    300: '#CCCCCC',
    400: '#999999',
    500: '#666666',
    600: '#333333',
  },

  // Background Colors
  background: {
    primary: '#F5F5F5',
    secondary: '#FFFFFF',
    tertiary: '#E8E8E8',
  },

  // Text Colors
  text: {
    primary: '#333333',
    secondary: '#666666',
    disabled: '#999999',
    inverse: '#FFFFFF',
  },

  // Transparent overlays
  overlay: {
    light: 'rgba(0, 0, 0, 0.25)',
    medium: 'rgba(0, 0, 0, 0.5)',
    dark: 'rgba(0, 0, 0, 0.75)',
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  round: 999,
} as const;

export const FontSizes = {
  xs: 11,
  sm: 12,
  md: 14,
  base: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  huge: 28,
  massive: 32,
} as const;

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

export const Shadows = {
  sm: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    android: {
      elevation: 2,
    },
  },
  md: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    android: {
      elevation: 4,
    },
  },
  lg: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  },
  xl: {
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
  },
} as const;

export const AnimationDurations = {
  fast: 200,
  normal: 300,
  slow: 400,
  verySlow: 600,
} as const;

export const AnimationDelays = {
  stagger: 50,
  card: 100,
  fadeIn: 150,
} as const;

export const Intervals = {
  playbackCheck: 1000,
  scheduleUpdate: 60000, // 1 minute
  cacheExpiry: 900000,   // 15 minutes
} as const;

export const Layout = {
  cardHeightRatio: 0.18,
  headerHeight: 56,
  bottomNavHeight: {
    ios: 28,
    android: 12,
  },
  bottomNavPadding: {
    ios: 28,
    android: 12,
  },
} as const;

// Export a default theme object
export const Theme = {
  colors: Colors,
  spacing: Spacing,
  borderRadius: BorderRadius,
  fontSize: FontSizes,
  fontWeight: FontWeights,
  shadows: Shadows,
  animation: {
    durations: AnimationDurations,
    delays: AnimationDelays,
  },
  intervals: Intervals,
  layout: Layout,
} as const;

export default Theme;
