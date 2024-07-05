const path = require('path');
const pak = require('../../package.json');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-transform-private-methods', {loose: true}],
    [
      'react-native-reanimated/plugin',
      {
        processNestedWorklets: true,
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          [pak.name]: path.resolve(__dirname, '../../', pak.source),
        },
      },
    ],
  ],
};
