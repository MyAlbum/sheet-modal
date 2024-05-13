/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const pak = require('../../package.json')

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    ['@babel/plugin-transform-private-methods', {loose: true}],
    [
      'react-native-reanimated/plugin',
      {
        processNestedWorklets: true
      }
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
}