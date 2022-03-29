module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["plugin:prettier/recommended", "google", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    "require-jsdoc": "off",
    "prettier/prettier": "error",
    semi: ["error", "always"],
    "no-undef": "error",
  },
};
