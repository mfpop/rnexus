import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // 1) Global ignores to keep linting fast and focused on source files
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "public/**",
      "e2e/**",
    ],
  },
  // 2) Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // 3) App source files rules (only lint src by default)
  {
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    rules: {
      // Keep essential React rules
      ...reactHooks.configs.recommended.rules,
      // Avoid warnings that would fail CI due to --max-warnings=0
      "react-refresh/only-export-components": "off",
  // React hooks dependency rule is often noisy in complex apps; keep off until code is refactored
  "react-hooks/exhaustive-deps": "off",
      // Relax a few TS rules that became overly strict with newer versions
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",
  // Turn off a few stylistic core rules to avoid CI noise after upgrades
  "no-useless-catch": "off",
  "no-case-declarations": "off",
    },
  },
  // 4) Node/config files: allow Node globals and require()
  {
    files: [
      "**/*.config.{js,cjs,mjs,ts}",
      "vite.config.ts",
      "postcss.config.js",
      "tailwind.config.ts",
      "playwright.config.ts",
    ],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
);
