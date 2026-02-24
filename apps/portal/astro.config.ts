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
          label: "Getting Started",
          collapsed: true,
          items: [
            {
              slug: "getting-started/installation",
              label: "Installation",
              attrs: { "data-icon": "download" },
            },
          ],
        },
        {
          label: "Foundations",
          collapsed: true,
          items: [
            {
              slug: "foundations/colors",
              label: "Core Palette",
              attrs: { "data-icon": "donut" },
            },
            {
              slug: "foundations/layout",
              label: "Layout System",
              attrs: { "data-icon": "view-grid" },
            },
            {
              slug: "foundations/variables",
              label: "CSS Variables",
              attrs: { "data-icon": "variables" },
            },
            {
              slug: "foundations/spacings",
              label: "Spacings",
              attrs: { "data-icon": "arrow-long-right" },
            },
            {
              slug: "foundations/typography",
              label: "Typography",
              attrs: { "data-icon": "text-size" },
            },
            {
              slug: "foundations/icons",
              label: "Icons",
              attrs: { "data-icon": "sparks" },
            },
            {
              slug: "foundations/illustrations",
              label: "Illustrations",
              attrs: { "data-icon": "frame-alt-empty" },
            },
            {
              slug: "foundations/logos",
              label: "Logos",
              attrs: { "data-icon": "star" },
            },
          ],
        },
        {
          label: "Components",
          collapsed: true,
          items: [
            "components/data-display/accordion",
            "components/feedback/alert",
            "components/overlays/alert-dialog",
            "components/visual/avatar",
            "components/navigation/breadcrumb",
            "components/actions/button",
            "components/actions/button-group",
            "components/actions/button-layout",
            "components/form/calendar",
            "components/form/caption",
            "components/data-display/card",
            "components/data-display/card-select",
            "components/visual/carousel",
            "components/form/checkbox",
            "components/actions/copy-button",
            "components/feedback/counter-badge",
            "components/data-display/data-table",
            "components/overlays/dialog",
            "components/markdown-display/diff-viewer",
            "components/data-display/draggable-card",
            "components/overlays/drawer",
            "components/overlays/dropdown-menu",
            "components/navigation/file-explorer",
            "components/form/form",
            "components/visual/icon",
            "components/visual/illustration",
            "components/form/label",
            "components/foundations/layout",
            "components/navigation/link",
            "components/visual/logo",
            "components/markdown-display/markdown-viewer",
            "components/chat/message-bubble",
            "components/form/multi-select",
            "components/form/number-input",
            "components/navigation/pagination",
            "components/overlays/popover",
            "components/feedback/progress",
            "components/chat/prompt-input",
            "components/form/radio",
            "components/chat/reasoning",
            "components/utilities/scroll-area",
            "components/form/search-input",
            "components/form/select",
            "components/overlays/sheet",
            "components/chat/shimmer",
            "components/navigation/sidebar",
            "components/feedback/skeleton",
            "components/form/slider",
            "components/utilities/spacer",
            "components/actions/split-button",
            "components/data-display/stacked-list",
            "components/feedback/status-badge",
            "components/form/switch",
            "components/navigation/tabs",
            "components/data-display/table-v2",
            "components/feedback/tag",
            "components/foundations/text",
            "components/form/text-input",
            "components/form/textarea",
            "components/overlays/time-ago-card",
            "components/feedback/toast",
            "components/actions/toggle",
            "components/actions/toggle-group",
            "components/overlays/tooltip",
            "components/navigation/tree-view",
            "components/chat/typing-animation",
            "components/data-display/view-only",
            "components/data-display/widgets",
          ],
        },
        {
          label: "Customization",
          collapsed: true,
          items: [
            {
              slug: "customization/overview",
              label: "Customization Guide",
              attrs: { "data-icon": "settings" },
            },
            {
              slug: "customization/spacings",
              label: "Spacing & Sizing",
              attrs: { "data-icon": "arrow-long-right" },
            },
            {
              slug: "customization/typography-scale",
              label: "Typography",
              attrs: { "data-icon": "text-size" },
            },
            {
              slug: "customization/bg-colors",
              label: "Background Colors",
              attrs: { "data-icon": "donut" },
            },
            {
              slug: "customization/text-colors",
              label: "Text Colors",
              attrs: { "data-icon": "text-size" },
            },
            {
              slug: "customization/border-colors",
              label: "Border Colors",
              attrs: { "data-icon": "blocks" },
            },
            {
              slug: "customization/shadows",
              label: "Shadows",
              attrs: { "data-icon": "half-moon" },
            },
            {
              slug: "customization/border-radius",
              label: "Border Radius",
              attrs: { "data-icon": "circle-with-sector" },
            },
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
        Pagination: "./src/components/layout/PaginationWithFooter.astro",
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
