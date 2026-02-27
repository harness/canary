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
  vite: {
    // logs only errors and warnings
    logLevel: "warn",
  },
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
          items: [
            "foundations/colors",
            "foundations/variables",
            "foundations/spacings",
            "foundations/typography",
            "foundations/icons",
            "foundations/illustrations",
            "foundations/logos",
            "foundations/layout",
          ],
        },
        {
          label: "Components",
          items: [
            {
              label: "Foundations",
              autogenerate: { directory: "components/foundations" },
            },
            {
              label: "Form & Inputs",
              autogenerate: { directory: "components/form" },
            },
            {
              label: "Buttons & Actions",
              autogenerate: { directory: "components/actions" },
            },
            {
              label: "Navigation",
              autogenerate: { directory: "components/navigation" },
            },
            {
              label: "Overlays & Dialogs",
              autogenerate: { directory: "components/overlays" },
            },
            {
              label: "Data Display",
              autogenerate: { directory: "components/data-display" },
            },
            {
              label: "Feedback & Status",
              autogenerate: { directory: "components/feedback" },
            },
            {
              label: "Media & Visual",
              autogenerate: { directory: "components/visual" },
            },
            {
              label: "AI & Chat",
              autogenerate: { directory: "components/chat" },
            },
            {
              label: "Markdown & Display",
              autogenerate: { directory: "components/markdown-display" },
            },
            {
              label: "Utilities",
              autogenerate: { directory: "components/utilities" },
            },
          ],
        },
        {
          label: "Customization",
          items: [
            "customization/overview",
            "customization/spacings",
            "customization/typography-scale",
            "customization/bg-colors",
            "customization/text-colors",
            "customization/border-colors",
            "customization/shadows",
            "customization/border-radius",
          ],
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
      expressiveCode: {
        themes: ["github-light", "github-dark"],
      },
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
  redirects: {
    "/": "/getting-started/installation",
  },
});
