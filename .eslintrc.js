module.exports = {
  root: true,
  extends: "@react-native",
  rules: {
    quotes: "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "react-native/no-inline-styles": "off",
  },
  parserOptions: {
    requireConfigFile: false,
  },
};
