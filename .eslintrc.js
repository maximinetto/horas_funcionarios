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
  plugins: ["@typescript-eslint", "prettier", "simple-import-sort"],
  rules: {
    "require-jsdoc": 0,
    "prettier/prettier": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
  },
};
