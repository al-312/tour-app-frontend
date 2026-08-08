import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import globals from "globals";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      "postcss.config.mjs",
      "eslint.config.mjs",
      "next.config.ts"
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
      Typescript Strictness
      =========================
      */
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
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
      "max-lines": [
        "error",
        { max: 300, skipBlankLines: true, skipComments: true },
      ],

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
