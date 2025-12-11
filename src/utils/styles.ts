import { Platform, ViewStyle } from 'react-native';
import { Shadows } from '../constants/theme';

/**
 * Style Utility Functions
 * Reusable functions for common styling patterns
 */

type ShadowSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Get platform-specific shadow/elevation styles
 * @param size - Shadow size (sm, md, lg, xl)
 * @returns Platform-specific shadow styles
 */
export const getShadowStyle = (size: ShadowSize = 'md'): ViewStyle => {
  return Platform.select({
    ios: Shadows[size].ios,
    android: Shadows[size].android,
    default: {},
  }) as ViewStyle;
};

/**
 * Get custom shadow style with specific parameters
 * @param elevation - Elevation value for Android
 * @param shadowOpacity - Shadow opacity for iOS (0-1)
 * @param shadowRadius - Shadow radius for iOS
 * @returns Platform-specific shadow styles
 */
export const getCustomShadow = (
  elevation: number,
  shadowOpacity: number = 0.1,
  shadowRadius: number = 8
): ViewStyle => {
  return Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation / 2 },
      shadowOpacity,
      shadowRadius,
    },
    android: {
      elevation,
    },
    default: {},
  }) as ViewStyle;
};

/**
 * Create a centered flex container
 */
export const centerContent = (): ViewStyle => ({
  justifyContent: 'center',
  alignItems: 'center',
});

/**
 * Create a flex row with alignment
 */
export const flexRow = (align: 'flex-start' | 'center' | 'flex-end' | 'space-between' = 'center'): ViewStyle => ({
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: align,
});

/**
 * Create absolute positioning
 */
export const absoluteFill = (): ViewStyle => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

/**
 * Create absolute positioning with custom values
 */
export const absolutePosition = (
  top?: number,
  right?: number,
  bottom?: number,
  left?: number
): ViewStyle => ({
  position: 'absolute',
  ...(top !== undefined && { top }),
  ...(right !== undefined && { right }),
  ...(bottom !== undefined && { bottom }),
  ...(left !== undefined && { left }),
});

/**
 * Create rounded corners
 */
export const rounded = (radius: number): ViewStyle => ({
  borderRadius: radius,
  overflow: 'hidden',
});

/**
 * Create circle shape
 */
export const circle = (size: number): ViewStyle => ({
  width: size,
  height: size,
  borderRadius: size / 2,
});

export default {
  getShadowStyle,
  getCustomShadow,
  centerContent,
  flexRow,
  absoluteFill,
  absolutePosition,
  rounded,
  circle,
};
