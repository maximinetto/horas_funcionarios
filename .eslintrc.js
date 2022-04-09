module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["plugin:prettier/recommended", "google", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "require-jsdoc": "off",
    "prettier/prettier": "error",
    semi: ["error", "always"],
    "no-undef": "error",
  },
};
