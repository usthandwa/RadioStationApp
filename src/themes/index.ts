import { Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const metrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navigationHeight: Platform.OS === 'ios' ? 44 : 56,
  statusBarHeight: Platform.OS === 'ios' ? 20 : 0,
  padding: {
    small: 8,
    medium: 16,
    large: 24,
    xl: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    xl: 24,
  },
};

export const colors = {
  primary: '#1E88E5',
  secondary: '#FFC107',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  error: '#B00020',
  text: {
    primary: '#000000',
    secondary: '#757575',
    disabled: '#9E9E9E',
    inverse: '#FFFFFF',
  },
  // Platform specific colors
  statusBar: Platform.select({
    ios: '#000000',
    android: '#1976D2',
  }),
  // Add more colors as needed
};

export const typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'Roboto',
  }),
  weights: {
    regular: Platform.select({ ios: '400', android: 'normal' }),
    medium: Platform.select({ ios: '500', android: 'medium' }),
    bold: Platform.select({ ios: '700', android: 'bold' }),
  },
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
  },
};

export const responsive = {
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  scale: (size: number) => (width / 375) * size,
};

const theme = {
  colors,
  typography,
  metrics,
  responsive,
};

export default theme;