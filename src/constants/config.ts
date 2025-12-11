/**
 * Application Configuration Constants
 */

export const APP_CONFIG = {
  name: 'AWR SID Media',
  version: '1.0.0',
  bundleId: {
    ios: 'com.szama.awrsidmediaIOS',
    android: 'com.szama.awrsidmedia',
  },
  scheme: 'awrsidmedia',
} as const;

export const ROUTES = {
  home: '/',
  livestream: '/live-stream',
  podcasts: '/podcasts',
  give: '/give',
  prayer: '/prayer',
  aboutUs: '/about-us',
  menu: '/menu',
  admin: '/admin',
} as const;

export const VALID_DEEP_LINK_ROUTES = [
  'live-stream',
  'give',
  'prayer',
  'podcasts',
  'about-us',
] as const;

export const NAVIGATION_ROUTES = [
  { name: 'Home', icon: 'home', path: ROUTES.home },
  { name: 'Podcasts', icon: 'podcast', path: ROUTES.podcasts },
  { name: 'Give', icon: 'hand-holding-heart', path: ROUTES.give },
  { name: 'Prayer', icon: 'praying-hands', path: ROUTES.prayer },
  { name: 'More', icon: 'ellipsis-h', path: ROUTES.aboutUs },
] as const;

export const MENU_ITEMS = [
  {
    id: '1',
    title: 'Live Stream',
    description: 'Listen to our live broadcast',
    icon: 'podcast',
    route: ROUTES.livestream,
    color: '#E74C3C',
  },
  {
    id: '2',
    title: 'Podcasts',
    description: 'Catch up with shows you missed',
    icon: 'microphone',
    route: ROUTES.podcasts,
    color: '#9B59B6',
  },
  {
    id: '3',
    title: 'Give',
    description: 'Support the ministry',
    icon: 'heart',
    route: ROUTES.give,
    color: '#27AE60',
  },
  {
    id: '4',
    title: 'Prayer',
    description: 'Submit a prayer request',
    icon: 'praying-hands',
    route: ROUTES.prayer,
    color: '#F39C12',
  },
  {
    id: '5',
    title: 'About Us',
    description: 'Learn more about our ministry',
    icon: 'info-circle',
    route: ROUTES.aboutUs,
    color: '#3498DB',
  },
] as const;

export const AUDIO_CONFIG = {
  playsInSilentModeIOS: true,
  staysActiveInBackground: true,
  shouldDuckAndroid: true,
  playThroughEarpieceAndroid: false,
} as const;

export const CACHE_CONFIG = {
  expiryDuration: 15 * 60 * 1000, // 15 minutes in milliseconds
  maxRetries: 3,
  retryDelay: 1000,
} as const;

export const ANIMATION_CONFIG = {
  useNativeDriver: true,
  cardStagger: 50,
  cardFadeDuration: 400,
  cardScaleDuration: 100,
  spinDuration: 1000,
  vinylRotationDuration: 3000,
} as const;

export const PERFORMANCE_CONFIG = {
  imageQuality: 0.8,
  maxImageWidth: 1024,
  maxImageHeight: 1024,
  enableHermes: true,
} as const;

export default {
  APP_CONFIG,
  ROUTES,
  VALID_DEEP_LINK_ROUTES,
  NAVIGATION_ROUTES,
  MENU_ITEMS,
  AUDIO_CONFIG,
  CACHE_CONFIG,
  ANIMATION_CONFIG,
  PERFORMANCE_CONFIG,
};
