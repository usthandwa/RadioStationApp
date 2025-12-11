import { Platform, Dimensions } from 'react-native';

/**
 * Platform utility functions for consistent cross-platform behavior
 */

/**
 * Check if the current platform is iOS
 */
export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

/**
 * Check if the current platform is Android
 */
export const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

/**
 * Check if the current platform is Web
 */
export const isWeb = (): boolean => {
  return Platform.OS === 'web';
};

/**
 * Get platform-specific value
 * @param config Object with platform-specific values
 */
export const getPlatformValue = <T,>(config: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T => {
  return Platform.select({
    ios: config.ios ?? config.default,
    android: config.android ?? config.default,
    web: config.web ?? config.default,
    default: config.default,
  });
};

/**
 * Get screen dimensions
 */
export const getScreenDimensions = () => {
  return Dimensions.get('window');
};

/**
 * Get safe area padding for iOS
 */
export const getIOSSafeAreaPadding = () => {
  if (!isIOS()) return 0;
  const { height } = getScreenDimensions();
  // iPhone X and newer have safe area at bottom
  return height >= 812 ? 28 : 0;
};

/**
 * Get platform-specific elevation/shadow styles
 */
export const getElevationStyle = (elevation: number) => {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity: 0.1 + (elevation * 0.02),
      shadowRadius: elevation,
    },
    android: {
      elevation: elevation,
    },
    default: {},
  });
};

/**
 * Check if haptics are available on the current platform
 */
export const hapticsAvailable = (): boolean => {
  // Haptics work on iOS and some Android devices
  return isIOS() || isAndroid();
};
