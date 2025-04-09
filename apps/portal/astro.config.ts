import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// if static building, mock `document` to prevent a bug triggered by a 3rd party dependency
if (!("document" in globalThis)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.document = {
    createElement: () => ({
      appendChild: () => ({}), // used by drawer > vaul
    }),
    getElementsByTagName: () => [], // used by drawer > vaul
    createTextNode: () => ({}), // used by drawer > vaul
    head: {
      appendChild: () => ({}), // used by drawer > vaul
    },
  } as any;

  globalThis.window = {} as any; // used by drawer > vaul
}

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Harness Design System",
      logo: {
        alt: "Harness Design System",
        replacesTitle: true,
        light: "./src/assets/harness-design-system-logo-light.svg",
        dark: "./src/assets/harness-design-system-logo.svg",
      },
      favicon: "./src/assets/favicon.png",
      social: [
        {
          label: "github",
          href: "https://github.com/harness/canary",
          icon: "github",
        },
      ],
      sidebar: [
        {
          label: "Getting started",
          autogenerate: { directory: "getting-started" },
        },
        {
          label: "Foundations",
          autogenerate: { directory: "foundations" },
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
        },
      ],
      customCss: [
        "./src/tailwind.css",
        "./src/styles.css",
        "@harnessio/ui/styles.css",
      ],
      components: {
        PageFrame: "./src/components/layout/PageFrame.astro",
        TwoColumnContent: "./src/components/layout/TwoColumnContent.astro",
        PageTitle: "./src/components/layout/PageTitle.astro",
        ThemeSelect: "./src/components/layout/ThemeSelect.astro",
      },
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
  redirects: {
    "/": "/components/accordion",
  },
});
