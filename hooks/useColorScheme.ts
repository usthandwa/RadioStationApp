import { ColorScheme } from 'constants/Colors';
import { useColorScheme as _useColorScheme } from 'react-native';


export function useColorScheme(): NonNullable<ColorScheme> {
  const colorScheme = _useColorScheme();
  return (colorScheme ?? 'light') as NonNullable<ColorScheme>;
}