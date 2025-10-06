import starlightPlugin from "@astrojs/starlight-tailwind";
import { uiTailwindPreset } from "@harnessio/ui/tailwind.config";

/** @type {import('tailwindcss').Config} */
export default {
  presets: [
    uiTailwindPreset([
      "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    ]),
  ],
  plugins: [starlightPlugin(), require("tailwindcss-animate")],
  corePlugins: {
    preflight: true,
  },
};
