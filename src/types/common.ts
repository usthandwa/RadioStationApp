import { ImageSourcePropType } from 'react-native';

/**
 * Common Type Definitions
 * Centralized types used across the application
 */

// Navigation Types
export type RouteNames =
  | '/'
  | '/live-stream'
  | '/podcasts'
  | '/give'
  | '/prayer'
  | '/about-us'
  | '/menu'
  | '/admin';

export interface NavigationRoute {
  name: string;
  icon: string;
  path: RouteNames;
}

// Card Types
export interface CardData {
  id: string;
  title: string;
  description: string;
  imageSrc: ImageSourcePropType;
  contentType: string;
  isListenLive?: boolean;
}

// Menu Types
export interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: RouteNames;
  color: string;
}

// Social Media Types
export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'twitter' | 'whatsapp';

export interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  customIcon?: React.ReactNode;
}

// Podcast Types
export interface Podcast {
  id: string;
  title: string;
  iframeUrl: string;
  description?: string;
}

// Error Types
export interface AppError {
  message: string;
  code?: string;
  stack?: string;
}

// Loading States
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: AppError | null;
}

// Animation Types
export interface AnimationConfig {
  duration?: number;
  delay?: number;
  useNativeDriver?: boolean;
}

// Platform Types
export type Platform = 'ios' | 'android' | 'web';

// Theme Types
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  error: string;
  success: string;
  warning: string;
}

export default {
  // Export all types as a namespace
};
