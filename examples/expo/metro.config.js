// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path')
const exclusionList = require('metro-config/src/defaults/exclusionList')

const pak = require('../../package.json')
const root = path.resolve(__dirname, '../..')

const modules = [
  '@babel/runtime',
  '@expo/metro-runtime',
  ...Object.keys({ ...pak.peerDependencies })
]

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname)

config.watchFolders = [root];

config.resolver.blacklistRE = exclusionList(
  modules.map(
    (m) =>
      new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
  )
);

config.resolver.extraNodeModules = {
  ...modules.reduce((acc, name) => {
    acc[name] = path.join(__dirname, 'node_modules', name)
    return acc
  }, {}),
};

module.exports = config;
