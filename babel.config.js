module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module-resolver', {
        alias: {
          // On web, use our stub
          'expo-secure-store': './utilities/expo-secure-store-stub.js',
        },
      }],
    ],
  };
};
