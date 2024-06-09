module.exports = function (api) {
  const presets = ['module:metro-react-native-babel-preset'];
  // const presets = ['module:@react-native/babel-preset'];
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
  ];

  const env = {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  };

  if (process?.env?.JEST_WORKER_ID) {
    // we are inside jest unit tests
    api.cache.never();
  } else {
    // we are inside RN, so we need to provide unexisting in this runtime modules
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
