module.exports = function(api) {
  api.cache(true);
 return {
 presets: ['babel-preset-expo'],
 plugins: [
  ['module-resolver', {
 root: ['./src'],
 extensions: [
 '.ios.ts',
 '.android.ts',
 '.ts',
 '.ios.tsx',
 '.android.tsx',
 '.tsx',
 '.jsx',
 '.js',
 '.json',
 '.jpg',
 '.png'
  ],
 alias: {
 '@': './src',
 '@/components': './src/components',
 '@/screens': './src/screens',
 '@/assets': './src/assets',
 '@/services': './src/services',
 '@/navigation': './src/navigation',
 '@/constants': './src/constants',
 '@/utils': './src/utils'
  }
  }],'react-native-reanimated/plugin'],
  };
 };