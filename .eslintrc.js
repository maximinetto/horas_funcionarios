module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["google", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: { "require-jsdoc": 0, "prettier/prettier": "error" },
};
