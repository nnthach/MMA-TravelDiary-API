import js from "@eslint/js";
import globals from "globals";
import babelParser from "@babel/eslint-parser"; // import parser thực tế

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        // Khai báo globals tương ứng với env
        // Ví dụ Node và ES2020 globals:
        // eslint-globals: https://www.npmjs.com/package/globals
        ...globals.es2020,
        ...globals.node,
      },
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {},
    rules: {
      // Common
      "no-console": 1,
      "no-extra-boolean-cast": 0,
      "no-lonely-if": 1,
      "no-unused-vars": 1,
      "no-trailing-spaces": 1,
      "no-multi-spaces": 1,
      "no-multiple-empty-lines": 1,
      "space-before-blocks": ["error", "always"],
      "object-curly-spacing": [1, "always"],
      indent: ["warn", 2],
      semi: [1, "never"],
      quotes: ["error", "single"],
      "array-bracket-spacing": 1,
      "linebreak-style": 0,
      "no-unexpected-multiline": "warn",
      "keyword-spacing": 1,
      "comma-dangle": 1,
      "comma-spacing": 1,
      "arrow-spacing": 1,
    },
  },
];

// parserOptions: {
//   ecmaVersion: "latest",
//   sourceType: "module",
//   requireConfigFile: false,
//   allowImportExportEverywhere: true,
// },
