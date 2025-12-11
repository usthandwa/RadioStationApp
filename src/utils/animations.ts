import { Animated, Easing } from 'react-native';
import { AnimationDurations } from '../constants/theme';

/**
 * Animation Utility Functions
 * Reusable animation patterns
 */

/**
 * Create a fade-in animation
 * @param animatedValue - Animated value to animate
 * @param duration - Animation duration in ms
 * @param delay - Delay before animation starts
 */
export const fadeIn = (
  animatedValue: Animated.Value,
  duration: number = AnimationDurations.normal,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    delay,
    useNativeDriver: true,
  });
};

/**
 * Create a fade-out animation
 */
export const fadeOut = (
  animatedValue: Animated.Value,
  duration: number = AnimationDurations.normal,
  delay: number = 0
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    delay,
    useNativeDriver: true,
  });
};

/**
 * Create a scale animation
 * @param animatedValue - Animated value to animate
 * @param toValue - Target scale value
 * @param duration - Animation duration
 */
export const scale = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number = AnimationDurations.fast
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Create a spring scale animation
 */
export const scaleSpring = (
  animatedValue: Animated.Value,
  toValue: number,
  friction: number = 3,
  tension: number = 40
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue,
    friction,
    tension,
    useNativeDriver: true,
  });
};

/**
 * Create a press animation (scale down then back up)
 */
export const pressAnimation = (
  animatedValue: Animated.Value,
  scaleDown: number = 0.95,
  duration: number = AnimationDurations.fast
): Animated.CompositeAnimation => {
  return Animated.sequence([
    scale(animatedValue, scaleDown, duration),
    scaleSpring(animatedValue, 1),
  ]);
};

/**
 * Create a rotation animation
 * @param animatedValue - Animated value (0 to 1)
 * @param duration - Animation duration
 * @param loop - Whether to loop the animation
 */
export const rotate = (
  animatedValue: Animated.Value,
  duration: number = 1000,
  loop: boolean = false
): Animated.CompositeAnimation => {
  animatedValue.setValue(0);
  const animation = Animated.timing(animatedValue, {
    toValue: 1,
    duration,
    easing: Easing.linear,
    useNativeDriver: true,
  });

  return loop ? Animated.loop(animation) : animation;
};

/**
 * Create a staggered animation for multiple items
 * @param animations - Array of animations to stagger
 * @param staggerDelay - Delay between each animation
 */
export const stagger = (
  animations: Animated.CompositeAnimation[],
  staggerDelay: number = 50
): Animated.CompositeAnimation => {
  return Animated.stagger(staggerDelay, animations);
};

/**
 * Create interpolated rotation value
 * @param animatedValue - Animated value (0 to 1)
 */
export const interpolateRotation = (animatedValue: Animated.Value): Animated.AnimatedInterpolation<string | number> => {
  return animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
};

/**
 * Create a slide-in animation from the bottom
 */
export const slideInFromBottom = (
  animatedValue: Animated.Value,
  distance: number = 100,
  duration: number = AnimationDurations.normal
): Animated.CompositeAnimation => {
  return Animated.timing(animatedValue, {
    toValue: 0,
    duration,
    useNativeDriver: true,
  });
};

/**
 * Create a bounce animation
 */
export const bounce = (
  animatedValue: Animated.Value,
  toValue: number = 1,
  bounciness: number = 8
): Animated.CompositeAnimation => {
  return Animated.spring(animatedValue, {
    toValue,
    friction: 2,
    tension: 40,
    useNativeDriver: true,
  });
};

/**
 * Parallel animation - run multiple animations at once
 */
export const parallel = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.parallel(animations);
};

/**
 * Sequence animation - run animations one after another
 */
export const sequence = (
  animations: Animated.CompositeAnimation[]
): Animated.CompositeAnimation => {
  return Animated.sequence(animations);
};

/**
 * Create fade and scale animation combo
 */
export const fadeInScale = (
  fadeValue: Animated.Value,
  scaleValue: Animated.Value,
  duration: number = AnimationDurations.normal,
  delay: number = 0
): Animated.CompositeAnimation => {
  return parallel([
    fadeIn(fadeValue, duration, delay),
    scaleSpring(scaleValue, 1),
  ]);
};

export default {
  fadeIn,
  fadeOut,
  scale,
  scaleSpring,
  pressAnimation,
  rotate,
  stagger,
  interpolateRotation,
  slideInFromBottom,
  bounce,
  parallel,
  sequence,
  fadeInScale,
};
