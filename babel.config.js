module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'transform-inline-environment-variables',
      {
        include: ['SMUGMUG_API_KEY', 'SMUGMUG_NICKNAME'],
      },
    ],
  ],
};
