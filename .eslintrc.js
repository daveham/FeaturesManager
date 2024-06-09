module.exports = {
  root: true,
  extends: ['@react-native', 'prettier'],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
  },
  settings: {
    'import/resolver': {
      'eslint-import-resolver-custom-alias': {
        alias: {
          sagas: './src/sagas',
          screens: './src/screens',
          shared: './src/shared',
          state: './src/state',
        },
        extensions: ['.js', '.ts', '.tsx', '.jsx'],
      },
    },
  },
};
