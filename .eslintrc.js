const fs = require("js");

const folders = fs
  .readdirSync("src", { withFileTypes: true })
  .filter((dirent) => dirent.isDirectory())
  .map((dirent) => dirent.name);

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
  plugins: ["@typescript-eslint", "simple-import-sort", "import", "prettier"],
  rules: {
    "require-jsdoc": 0,
    "prettier/prettier": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
  },
  overrides: [
    {
      files: ["**/*.ts"],
      rules: {
        "simple-import-sort/imports": [
          "error",
          {
            groups: [
              // Absolute imports and Relative imports.
              [`^(${folders.join("|")})(/.*|$)`, "^\\."],
            ],
          },
        ],
      },
    },
  ],
};
