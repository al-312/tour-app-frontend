import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";
import perfectionist from "eslint-plugin-perfectionist";
import prettierPlugin from "eslint-plugin-prettier";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      "postcss.config.mjs",
      "eslint.config.mjs",
      "next.config.ts",
    ],
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      prettier: prettierPlugin,
      "unused-imports": unusedImports,
      perfectionist,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      /*
      =========================
      Prettier Integration
      =========================
      */
      "prettier/prettier": "error",

      /*
      =========================
      Next.js Strict Rules
      =========================
      */
      "@next/next/no-html-link-for-pages": "error",
      "@next/next/no-img-element": "error",
      "@next/next/no-head-element": "error",
      "@next/next/no-sync-scripts": "error",
      "@next/next/no-page-custom-font": "error",
      "@next/next/no-title-in-document-head": "error",
      "@next/next/no-styled-jsx-in-document": "error",
      "@next/next/no-duplicate-head": "error",
      "@next/next/no-async-client-component": "error",
      "@next/next/no-before-interactive-script-outside-document": "error",
      "@next/next/no-css-tags": "error",
      "@next/next/no-head-import-in-document": "error",
      "@next/next/inline-script-id": "error",
      "@next/next/next-script-for-ga": "error",
      "@next/next/google-font-display": "error",
      "@next/next/google-font-preconnect": "error",

      /*
      =========================
      Typescript Strictness
      =========================
      */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/explicit-function-return-type": [
        "error",
        { allowExpressions: true },
      ],
      "@typescript-eslint/no-non-null-assertion": "error",

      /*
      =========================
      Console + Debugging
      =========================
      */
      "no-console": "error",
      "no-debugger": "error",

      /*
      =========================
      Prevent Suppression
      =========================
      */
      "no-warning-comments": [
        "error",
        { terms: ["eslint-disable"], location: "anywhere" },
      ],

      /*
      =========================
      React Rules
      =========================
      */
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",

      /*
      =========================
      Imports
      =========================
      */
      "unused-imports/no-unused-imports": "error",
      "import/order": "off",
      "perfectionist/sort-imports": [
        "error",
        {
          type: "line-length",
          order: "asc",
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
            "type",
          ],
        },
      ],

      /*
      =========================
      Code Cleanliness
      =========================
      */
      "no-var": "error",
      "prefer-const": "error",
      "no-duplicate-imports": "error",
      "max-lines": ["error", { max: 300, skipBlankLines: true, skipComments: true }],

      /*
      =========================
      Accessibility
      =========================
      */
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
    },
  },
]);

export default eslintConfig;
