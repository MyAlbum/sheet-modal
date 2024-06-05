module.exports = {
  root: true,
  extends: "@react-native",
  rules: {
    quotes: "off",
    "react-native/no-inline-styles": "off",
  },
  plugins: ["only-warn"],
  parserOptions: {
    requireConfigFile: false,
  },
};
