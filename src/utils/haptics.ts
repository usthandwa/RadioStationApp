import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Haptics Utility Functions
 * Centralized haptic feedback handling
 */

export type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

/**
 * Trigger haptic feedback (iOS only, gracefully ignored on Android)
 * @param type - Type of haptic feedback
 */
export const triggerHaptic = async (type: HapticFeedbackType = 'light'): Promise<void> => {
  if (Platform.OS !== 'ios') return;

  try {
    switch (type) {
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      default:
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  } catch (error) {
    // Silently fail - haptics are non-critical
    console.debug('Haptic feedback failed:', error);
  }
};

/**
 * Trigger selection haptic (for picker/slider changes)
 */
export const triggerSelectionHaptic = async (): Promise<void> => {
  if (Platform.OS !== 'ios') return;

  try {
    await Haptics.selectionAsync();
  } catch (error) {
    console.debug('Selection haptic failed:', error);
  }
};

/**
 * Check if haptics are available on the current platform
 */
export const isHapticsAvailable = (): boolean => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

/**
 * Higher-order function to wrap an async function with haptic feedback
 * @param fn - Async function to wrap
 * @param hapticType - Type of haptic feedback
 * @returns Wrapped function with haptic feedback
 */
export const withHaptic = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  hapticType: HapticFeedbackType = 'light'
): ((...args: Parameters<T>) => Promise<ReturnType<T>>) => {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    await triggerHaptic(hapticType);
    return fn(...args);
  };
};

/**
 * Synchronous version - wrap a sync function with haptic feedback
 */
export const withHapticSync = <T extends (...args: any[]) => any>(
  fn: T,
  hapticType: HapticFeedbackType = 'light'
): ((...args: Parameters<T>) => ReturnType<T>) => {
  return (...args: Parameters<T>): ReturnType<T> => {
    triggerHaptic(hapticType); // Fire and forget
    return fn(...args);
  };
};

export default {
  triggerHaptic,
  triggerSelectionHaptic,
  isHapticsAvailable,
  withHaptic,
  withHapticSync,
};
