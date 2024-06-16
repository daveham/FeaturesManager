module.exports = function (api) {
  const presets = ['module:@react-native/babel-preset'];
  const plugins = [
    [
      'transform-inline-environment-variables',
      {
        include: [
          'SMUGMUG_API_KEY',
          'SMUGMUG_API_KEY_SECRET',
          'SMUGMUG_NICKNAME',
          'SMUGMUG_ACCESS_TOKEN',
          'SMUGMUG_ACCESS_TOKEN_SECRET',
        ],
      },
    ],
    // The reanimated plugin must be the last plugin in the array.
    'react-native-reanimated/plugin',
  ];

  const env = {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  };

  if (process?.env?.JEST_WORKER_ID) {
    // we are inside jest unit tests, let node provide the crypto needs
    api.cache.never();
  } else {
    // we are inside RN, provide libraries for crypto that work on devices
    plugins.unshift([
      'module-resolver',
      {
        // root: ['.'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.json',
        ],
        // loglevel: 'info',
        alias: {
          crypto: 'react-native-quick-crypto',
          stream: 'stream-browserify',
          buffer: '@craftzdog/react-native-buffer',
          components: './src/components',
          sagas: './src/sagas',
          screens: './src/screens',
          shared: './src/shared',
          state: './src/state',
        },
      },
    ]);
    api.cache.forever();
  }

  return {
    env,
    presets,
    plugins,
  };
};
