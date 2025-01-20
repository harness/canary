import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// if static building, mock `document` to prevent a bug triggered by a 3rd party dependency
if (!("document" in globalThis)) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.document = { createElement: () => ({}) } as any;
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
      social: {
        github: "https://github.com/harness/canary",
      },
      sidebar: [
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
        "@harnessio/ui/styles.css",
        "./src/styles.css",
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
  redirects: {
    "/": "/components/breadcrumb", //
  },
});
