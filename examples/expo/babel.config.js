const path = require('path')
const pak = require('../../package.json');

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            [pak.name]: path.resolve(__dirname, '../../', pak.source),
          },
        },
      ],
    ]
  };
};
