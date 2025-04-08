import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { wrapCodeBlocks } from "./src/wrap-code-blocks.ts";

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
        src: "./src/assets/harness-design-system-logo.svg",
        replacesTitle: true,
      },
      favicon: "./src/assets/favicon.png",
      social: {
        github: "https://github.com/harness/canary",
      },
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
        {
          label: "Coming soon",
          autogenerate: { directory: "soon" },
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
      },
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
  markdown: {
    rehypePlugins: [wrapCodeBlocks],
  },
  redirects: {
    "/": "/components/accordion",
  },
});
