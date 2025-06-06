import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["*.ts", "*.tsx", "*.css"],
    rules: {
      "array-callback-return": "off",
      "no-await-in-loop": "warn",
      "capitalized-comments": "warn",
      eqeqeq: ["warn", "always"],
      "no-console": "warn",
      "no-magic-numbers": "warn",
      "no-var": "warn",
      "no-useless-return": "error",
      "sort-imports": "warn",
      "require-await": "error",
      "no-else-return": "warn",
      "no-use-before-define": "error",
    },
  },
];

export default eslintConfig;
