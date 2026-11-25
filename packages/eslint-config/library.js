import { defineConfig } from "eslint/config";
import nextConfig from "./next.js";

/** Para pacotes React do monorepo (packages/*): não são apps, não têm pasta pages/. */
export default defineConfig([
  ...nextConfig,
  { rules: { "@next/next/no-html-link-for-pages": "off" } },
]);
