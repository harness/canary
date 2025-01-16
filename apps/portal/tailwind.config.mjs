import starlightPlugin from "@astrojs/starlight-tailwind";
import tailwindConfig from "@harnessio/ui/tailwind.config";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [tailwindConfig],
  content: [
    "node_modules/@harnessio/ui/src/**/*.{ts,tsx}",
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  plugins: [starlightPlugin(), require("tailwindcss-animate")],
};
