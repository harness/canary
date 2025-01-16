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
      social: {
        github: "https://github.com/harness/canary",
      },
      sidebar: [
        {
          label: "Guides",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Example Guide", slug: "guides/example" },
          ],
        },
        {
          label: "Reference",
          autogenerate: { directory: "reference" },
        },
        {
          label: "Components",
          autogenerate: { directory: "components" },
        },
      ],
      customCss: ["./src/tailwind.css", "@harnessio/ui/styles.css"],
    }),
    tailwind({ applyBaseStyles: false }),
    react(),
  ],
});
