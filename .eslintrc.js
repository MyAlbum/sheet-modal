module.exports = {
  root: true,
  extends: "@react-native",
  rules: {
    quotes: "off",
    "react-native/no-inline-styles": "off",
    "prettier/prettier": [
      "error",
      {
        printWidth: 175,
        semi: true,
      },
    ],
  },
  plugins: ["only-warn"],
  parserOptions: {
    requireConfigFile: false,
  },
};
