module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      //'expo-router/babel',
      ['module-resolver', {
        root: ['./src'],
        alias: {
          '@': './src',
          '@components': './src/components',
          '@assets': './src/assets',
          '@services': './src/services'
        }
      }]
    ]
  };
};