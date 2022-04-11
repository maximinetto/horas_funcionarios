module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["google", "prettier"],
  parserOptions: {
    proyect: "./tsconfig.json",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "require-jsdoc": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
      },
    ],
    semi: ["error", "always"],
    "no-undef": "error",
  },
};
