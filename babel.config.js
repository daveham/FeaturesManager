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
        ],
      },
    ],
  ];

  if (process?.env?.JEST_WORKER_ID) {
    // we are inside jest unit tests
    api.cache.never();
  } else {
    // we are inside RN, so we need to provide unexisting in this runtime modules
    plugins.unshift([
      'module-resolver',
      {
        alias: {
          crypto: 'react-native-quick-crypto',
          stream: 'stream-browserify',
          buffer: '@craftzdog/react-native-buffer',
        },
      },
    ]);
    api.cache.forever();
  }

  return {
    presets,
    plugins,
  };
};
