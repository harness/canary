/**
 * Harness Design System
 * Generated style tokens - DO NOT EDIT DIRECTLY
 * Generated on Wed, 19 Mar 2025 07:15:52 GMT
 * Copyright (c) Harness.
 */

export default {
  background: {
    1: {
      $type: "color",
      $value: "lch(2.44% 1.49 285.81)",
      $description:
        "Level 1. Represents the lowest layer in the stack. This is the foundation that everything else sits on, like the app's main background.\n\nCommon uses: Application background, page base layer, lowest-level containers.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.pure.black}",
        $description:
          "Level 1. Represents the lowest layer in the stack. This is the foundation that everything else sits on, like the app's main background.\n\nCommon uses: Application background, page base layer, lowest-level containers.",
      },
      name: "cn-background-1",
      attributes: {
        category: "background",
        type: "1",
        themeable: true,
      },
      path: ["background", "1"],
    },
    2: {
      $type: "color",
      $value: "lch(3.66% 1.93 285.7)",
      $description:
        "Level 2. Represents elements that sit on top of the bottom layer. Creates visual hierarchy through subtle elevation.\n\nCommon uses: Cards, containers, form fields, dropdown menus.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.chrome.1000}",
        $description:
          "Level 2. Represents elements that sit on top of the bottom layer. Creates visual hierarchy through subtle elevation.\n\nCommon uses: Cards, containers, form fields, dropdown menus.",
      },
      name: "cn-background-2",
      attributes: {
        category: "background",
        type: "2",
        themeable: true,
      },
      path: ["background", "2"],
    },
    3: {
      $type: "color",
      $value: "lch(5.2% 3.07 285.78)",
      $description:
        "Level 3. Represents elements that sit on top of the middle layer. Creates strong visual emphasis through maximum elevation.\n\nCommon uses: Popovers, tooltips, highlighted containers.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.chrome.950}",
        $description:
          "Level 3. Represents elements that sit on top of the middle layer. Creates strong visual emphasis through maximum elevation.\n\nCommon uses: Popovers, tooltips, highlighted containers.",
      },
      name: "cn-background-3",
      attributes: {
        category: "background",
        type: "3",
        themeable: true,
      },
      path: ["background", "3"],
    },
  },
  text: {
    1: {
      $type: "color",
      $value: "lch(98.27% 0.36 135.2)",
      $description:
        "Highest contrast color for text and icons in important content. Creates maximum readability and emphasis for key information.\n\nCommon uses: Headings, labels, emphasized text, primary buttons.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.chrome.50}",
        $description:
          "Highest contrast color for text and icons in important content. Creates maximum readability and emphasis for key information.\n\nCommon uses: Headings, labels, emphasized text, primary buttons.",
      },
      name: "cn-text-1",
      attributes: {
        category: "text",
        type: "1",
        themeable: true,
      },
      path: ["text", "1"],
    },
    2: {
      $type: "color",
      $value: "lch(81.33% 4.52 285.46)",
      $description:
        "Primary color for text and icons in general content. Provides optimal readability for extended reading while reducing visual strain.\n\nCommon uses: Body text, primary content, default icons, form inputs.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.chrome.200}",
        $description:
          "Primary color for text and icons in general content. Provides optimal readability for extended reading while reducing visual strain.\n\nCommon uses: Body text, primary content, default icons, form inputs.",
      },
      name: "cn-text-2",
      attributes: {
        category: "text",
        type: "2",
        themeable: true,
      },
      path: ["text", "2"],
    },
    3: {
      $type: "color",
      $value: "lch(67.41% 4.51 285.56)",
      $description:
        "Reduced emphasis color for text and icons in secondary information. Creates visual hierarchy through lower contrast.\n\nCommon uses: Supporting text, metadata, secondary information, placeholders.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.chrome.400}",
        $description:
          "Reduced emphasis color for text and icons in secondary information. Creates visual hierarchy through lower contrast.\n\nCommon uses: Supporting text, metadata, secondary information, placeholders.",
      },
      name: "cn-text-3",
      attributes: {
        category: "text",
        type: "3",
        themeable: true,
      },
      path: ["text", "3"],
    },
    accent: {
      $type: "color",
      $value: "lch(74.15% 29 241)",
      $description:
        "Contrasting color for text and icons in interactive elements or design focus. Creates visual distinction for actionable items.\n\nCommon uses: Links, buttons, interactive icons, highlighted elements.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.cyan.200}",
        $description:
          "Contrasting color for text and icons in interactive elements or design focus. Creates visual distinction for actionable items.\n\nCommon uses: Links, buttons, interactive icons, highlighted elements.",
      },
      name: "cn-text-accent",
      attributes: {
        category: "text",
        type: "accent",
        themeable: true,
      },
      path: ["text", "accent"],
    },
    success: {
      $type: "color",
      $value: "lch(74.15% 29 241)",
      $description:
        "Primary color for text and icons in success content. Communicates positive outcomes and completion states.\n\nCommon uses: Success message text, completion text, positive indicators.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.cyan.200}",
        $description:
          "Primary color for text and icons in success content. Communicates positive outcomes and completion states.\n\nCommon uses: Success message text, completion text, positive indicators.",
      },
      name: "cn-text-success",
      attributes: {
        category: "text",
        type: "success",
        themeable: true,
      },
      path: ["text", "success"],
    },
    danger: {
      $type: "color",
      $value: "lch(72.7% 48.17 33.53)",
      $description:
        "Primary color for text and icons in error content. Communicates problems, warnings, and destructive actions.\n\nCommon uses: Error message text, validation text, destructive action labels.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.red.200}",
        $description:
          "Primary color for text and icons in error content. Communicates problems, warnings, and destructive actions.\n\nCommon uses: Error message text, validation text, destructive action labels.",
      },
      name: "cn-text-danger",
      attributes: {
        category: "text",
        type: "danger",
        themeable: true,
      },
      path: ["text", "danger"],
    },
    warning: {
      $type: "color",
      $value: "lch(74.82% 51.93 49.87)",
      $description:
        "Primary color for text and icons in warning content. Communicates caution and potential issues requiring attention.\n\nCommon uses: Warning message text, alert text, important notifications.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.orange.200}",
        $description:
          "Primary color for text and icons in warning content. Communicates caution and potential issues requiring attention.\n\nCommon uses: Warning message text, alert text, important notifications.",
      },
      name: "cn-text-warning",
      attributes: {
        category: "text",
        type: "warning",
        themeable: true,
      },
      path: ["text", "warning"],
    },
  },
  border: {
    1: {
      $type: "color",
      $value: "lch(81.33% 4.52 285.46)",
      $description:
        "Enhanced border color for interactive states. Creates strong visual definition for important boundaries.\n\nCommon uses: Focus states, hover states, active elements, primary containers.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.chrome.200}",
        $description:
          "Enhanced border color for interactive states. Creates strong visual definition for important boundaries.\n\nCommon uses: Focus states, hover states, active elements, primary containers.",
      },
      name: "cn-border-1",
      attributes: {
        category: "border",
        type: "1",
        themeable: true,
      },
      path: ["border", "1"],
    },
    2: {
      $type: "color",
      $value: "lch(39.46% 8.98 286.89)",
      $description:
        "Standard border color for general use. Provides balanced visual definition for common UI elements.\n\nCommon uses: Containers, cards, dividers, separators, default form inputs.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.chrome.700}",
        $description:
          "Standard border color for general use. Provides balanced visual definition for common UI elements.\n\nCommon uses: Containers, cards, dividers, separators, default form inputs.",
      },
      name: "cn-border-2",
      attributes: {
        category: "border",
        type: "2",
        themeable: true,
      },
      path: ["border", "2"],
    },
    3: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.7",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
      $description:
        "Softer border color for minimal separation. Creates subtle visual boundaries that don't dominate the UI.\n\nCommon uses: Subtle dividers, grouped content, secondary containers, table rows.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.7",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.chrome.800}",
        $description:
          "Softer border color for minimal separation. Creates subtle visual boundaries that don't dominate the UI.\n\nCommon uses: Subtle dividers, grouped content, secondary containers, table rows.",
      },
      name: "cn-border-3",
      attributes: {
        category: "border",
        type: "3",
        themeable: true,
      },
      path: ["border", "3"],
    },
    focus: {
      $type: "color",
      $value: "lch(65.49% 45.28 239)",
      $description:
        "Focus state indicator color. Provides clear visual feedback for keyboard navigation and accessibility.\n\nCommon uses: Focus rings, keyboard navigation highlights, selection indicators.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.cyan.300}",
        $description:
          "Focus state indicator color. Provides clear visual feedback for keyboard navigation and accessibility.\n\nCommon uses: Focus rings, keyboard navigation highlights, selection indicators.",
      },
      name: "cn-border-focus",
      attributes: {
        category: "border",
        type: "focus",
        themeable: true,
      },
      path: ["border", "focus"],
    },
    success: {
      $type: "color",
      $value: "lch(65.49% 45.28 239)",
      $description:
        "Border color for success containers. Reinforces positive status through visual framing.\n\nCommon uses: Success alert borders, confirmation boundaries, completed state indicators.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.cyan.300}",
        $description:
          "Border color for success containers. Reinforces positive status through visual framing.\n\nCommon uses: Success alert borders, confirmation boundaries, completed state indicators.",
      },
      name: "cn-border-success",
      attributes: {
        category: "border",
        type: "success",
        themeable: true,
      },
      path: ["border", "success"],
    },
    danger: {
      $type: "color",
      $value: "lch(65.59% 65.99 34.56)",
      $description:
        "Border color for error containers. Emphasizes critical information through visual framing.\n\nCommon uses: Error alert borders, validation boundaries, destructive action containers.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.red.300}",
        $description:
          "Border color for error containers. Emphasizes critical information through visual framing.\n\nCommon uses: Error alert borders, validation boundaries, destructive action containers.",
      },
      name: "cn-border-danger",
      attributes: {
        category: "border",
        type: "danger",
        themeable: true,
      },
      path: ["border", "danger"],
    },
    warning: {
      $type: "color",
      $value: "lch(63.38% 78.04 52.26)",
      $description:
        "Border color for warning containers. Frames cautionary information with distinct boundary.\n\nCommon uses: Warning alert borders, notice boundaries, attention-requiring elements.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $type: "color",
        $value: "{colors.orange.300}",
        $description:
          "Border color for warning containers. Frames cautionary information with distinct boundary.\n\nCommon uses: Warning alert borders, notice boundaries, attention-requiring elements.",
      },
      name: "cn-border-warning",
      attributes: {
        category: "border",
        type: "warning",
        themeable: true,
      },
      path: ["border", "warning"],
    },
  },
  state: {
    hover: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.08",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-white) l c h / 0.08)",
      $description:
        "Light overlay for gentle interactive effects. Creates subtle visual feedback during user interaction.\n\nCommon uses: Button hover states, link hover states, soft interactions, menu items.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.08",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.white}",
        $description:
          "Light overlay for gentle interactive effects. Creates subtle visual feedback during user interaction.\n\nCommon uses: Button hover states, link hover states, soft interactions, menu items.",
      },
      name: "cn-state-hover",
      attributes: {
        category: "state",
        type: "hover",
        themeable: true,
      },
      path: ["state", "hover"],
    },
    selected: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.1",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-white) l c h / 0.1)",
      $description:
        "Strong overlay for emphasized selection states. Creates distinct visual indication of active or selected elements.\n\nCommon uses: Selected list items, active tabs, chosen options, current navigation item.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.1",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.white}",
        $description:
          "Strong overlay for emphasized selection states. Creates distinct visual indication of active or selected elements.\n\nCommon uses: Selected list items, active tabs, chosen options, current navigation item.",
      },
      name: "cn-state-selected",
      attributes: {
        category: "state",
        type: "selected",
        themeable: true,
      },
      path: ["state", "selected"],
    },
    disabled: {
      text: {
        $type: "color",
        $value: "lch(39.46% 8.98 286.89)",
        $description:
          "Lowest emphasis text color for unavailable options. Creates visual differentiation between interactive and non-interactive elements.\n\nCommon uses: Disabled buttons, inactive form elements, unavailable options, placeholders.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.700}",
          $description:
            "Lowest emphasis text color for unavailable options. Creates visual differentiation between interactive and non-interactive elements.\n\nCommon uses: Disabled buttons, inactive form elements, unavailable options, placeholders.",
        },
        name: "cn-state-disabled-text",
        attributes: {
          category: "state",
          type: "disabled",
          item: "text",
          themeable: true,
        },
        path: ["state", "disabled", "text"],
      },
      background: {
        $type: "color",
        $value: "lch(5.2% 3.07 285.78)",
        $description:
          "Muted background color for disabled elements. Reduces visual prominence of non-interactive elements in the UI.\n\nCommon uses: Disabled buttons, inactive form controls, unavailable options.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.950}",
          $description:
            "Muted background color for disabled elements. Reduces visual prominence of non-interactive elements in the UI.\n\nCommon uses: Disabled buttons, inactive form controls, unavailable options.",
        },
        name: "cn-state-disabled-background",
        attributes: {
          category: "state",
          type: "disabled",
          item: "background",
          themeable: true,
        },
        path: ["state", "disabled", "background"],
      },
      border: {
        $type: "color",
        $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
        $description:
          "Muted border color for disabled element boundaries. Creates subtle containment while indicating non-interactive state.\n\nCommon uses: Disabled form inputs, inactive controls, unavailable action boundaries.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.3}",
          $description:
            "Muted border color for disabled element boundaries. Creates subtle containment while indicating non-interactive state.\n\nCommon uses: Disabled form inputs, inactive controls, unavailable action boundaries.",
        },
        name: "cn-state-disabled-border",
        attributes: {
          category: "state",
          type: "disabled",
          item: "border",
          themeable: true,
        },
        path: ["state", "disabled", "border"],
      },
    },
  },
  component: {
    accordion: {
      title: {
        $type: "color",
        $value: "lch(98.27% 0.36 135.2)",
        $description:
          "Text color for accordion triggers/headers. Used for the clickable area that expands/collapses content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.1}",
          $description:
            "Text color for accordion triggers/headers. Used for the clickable area that expands/collapses content.",
        },
        name: "cn-component-accordion-title",
        attributes: {
          category: "component",
          type: "accordion",
          item: "title",
          themeable: true,
        },
        path: ["component", "accordion", "title"],
      },
      description: {
        $type: "color",
        $value: "lch(81.33% 4.52 285.46)",
        $description:
          "Text color for accordion content. Applied to the expandable text within accordion panels.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.2}",
          $description:
            "Text color for accordion content. Applied to the expandable text within accordion panels.",
        },
        name: "cn-component-accordion-description",
        attributes: {
          category: "component",
          type: "accordion",
          item: "description",
          themeable: true,
        },
        path: ["component", "accordion", "description"],
      },
      chevron: {
        $type: "color",
        $value: "lch(67.41% 4.51 285.56)",
        $description:
          "Color for the accordion expansion indicator icon. Visually signals the collapsed/expanded state.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.3}",
          $description:
            "Color for the accordion expansion indicator icon. Visually signals the collapsed/expanded state.",
        },
        name: "cn-component-accordion-chevron",
        attributes: {
          category: "component",
          type: "accordion",
          item: "chevron",
          themeable: true,
        },
        path: ["component", "accordion", "chevron"],
      },
      border: {
        $type: "color",
        $value: "lch(39.46% 8.98 286.89)",
        $description:
          "Border color for accordion items. Provides visual separation between accordion panels.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.2}",
          $description:
            "Border color for accordion items. Provides visual separation between accordion panels.",
        },
        name: "cn-component-accordion-border",
        attributes: {
          category: "component",
          type: "accordion",
          item: "border",
          themeable: true,
        },
        path: ["component", "accordion", "border"],
      },
    },
    alert: {
      default: {
        title: {
          $type: "color",
          $value: "lch(98.27% 0.36 135.2)",
          $description:
            "Title text color for informational alerts. Ensures high visibility for the alert heading.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.1}",
            $description:
              "Title text color for informational alerts. Ensures high visibility for the alert heading.",
          },
          name: "cn-component-alert-default-title",
          attributes: {
            category: "component",
            type: "alert",
            item: "default",
            subitem: "title",
            themeable: true,
          },
          path: ["component", "alert", "default", "title"],
        },
        description: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Description text color for informational alerts. Provides readable contrast for alert content.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.2}",
            $description:
              "Description text color for informational alerts. Provides readable contrast for alert content.",
          },
          name: "cn-component-alert-default-description",
          attributes: {
            category: "component",
            type: "alert",
            item: "default",
            subitem: "description",
            themeable: true,
          },
          path: ["component", "alert", "default", "description"],
        },
        background: {
          $type: "color",
          $value: "lch(5.2% 3.07 285.78)",
          $description:
            "Background color for informational alerts. Creates visual distinction from surrounding content.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{background.3}",
            $description:
              "Background color for informational alerts. Creates visual distinction from surrounding content.",
          },
          name: "cn-component-alert-default-background",
          attributes: {
            category: "component",
            type: "alert",
            item: "default",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "alert", "default", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
          $description:
            "Border color for informational alerts. Subtly defines the alert's boundaries.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{border.3}",
            $description:
              "Border color for informational alerts. Subtly defines the alert's boundaries.",
          },
          name: "cn-component-alert-default-border",
          attributes: {
            category: "component",
            type: "alert",
            item: "default",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "alert", "default", "border"],
        },
      },
      danger: {
        title: {
          $type: "color",
          $value: "lch(89.81% 13.4 32.67)",
          $description:
            "Text color for danger alerts. Communicates critical information through high-contrast red text.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.red.100}",
            $description:
              "Text color for danger alerts. Communicates critical information through high-contrast red text.",
          },
          name: "cn-component-alert-danger-title",
          attributes: {
            category: "component",
            type: "alert",
            item: "danger",
            subitem: "title",
            themeable: true,
          },
          path: ["component", "alert", "danger", "title"],
        },
        description: {
          $type: "color",
          $value: "lch(72.7% 48.17 33.53)",
          $description:
            "Description text color for danger alerts. Ensures readability while maintaining the error state styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.red.200}",
            $description:
              "Description text color for danger alerts. Ensures readability while maintaining the error state styling.",
          },
          name: "cn-component-alert-danger-description",
          attributes: {
            category: "component",
            type: "alert",
            item: "danger",
            subitem: "description",
            themeable: true,
          },
          path: ["component", "alert", "danger", "description"],
        },
        background: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-red-500) l c h / 0.1)",
          $description:
            "Background color for danger alerts. Creates subtle but recognizable error state styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.red.500}",
            $description:
              "Background color for danger alerts. Creates subtle but recognizable error state styling.",
          },
          name: "cn-component-alert-danger-background",
          attributes: {
            category: "component",
            type: "alert",
            item: "danger",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "alert", "danger", "background"],
        },
        border: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.2",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-red-300) l c h / 0.2)",
          $description:
            "Border color for danger alerts. Provides definition for error state alerts.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.2",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.red.300}",
            $description:
              "Border color for danger alerts. Provides definition for error state alerts.",
          },
          name: "cn-component-alert-danger-border",
          attributes: {
            category: "component",
            type: "alert",
            item: "danger",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "alert", "danger", "border"],
        },
      },
    },
    avatar: {
      text: {
        $type: "color",
        $value: "lch(81.33% 4.52 285.46)",
        $description:
          "Text color for avatar initials or text. Ensures visibility against the avatar background.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.2}",
          $description:
            "Text color for avatar initials or text. Ensures visibility against the avatar background.",
        },
        name: "cn-component-avatar-text",
        attributes: {
          category: "component",
          type: "avatar",
          item: "text",
          themeable: true,
        },
        path: ["component", "avatar", "text"],
      },
      background: {
        $type: "color",
        $value: "lch(5.2% 3.07 285.78)",
        $description:
          "Background color for avatar components. Provides contrast for text or image content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.3}",
          $description:
            "Background color for avatar components. Provides contrast for text or image content.",
        },
        name: "cn-component-avatar-background",
        attributes: {
          category: "component",
          type: "avatar",
          item: "background",
          themeable: true,
        },
        path: ["component", "avatar", "background"],
      },
      border: {
        $type: "color",
        $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
        $description:
          "Border color for avatars. Creates subtle definition around the avatar element.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.3}",
          $description:
            "Border color for avatars. Creates subtle definition around the avatar element.",
        },
        name: "cn-component-avatar-border",
        attributes: {
          category: "component",
          type: "avatar",
          item: "border",
          themeable: true,
        },
        path: ["component", "avatar", "border"],
      },
    },
    badge: {
      default: {
        text: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Text color for secondary badges. Provides readable contrast on secondary badge styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.2}",
            $description:
              "Text color for secondary badges. Provides readable contrast on secondary badge styling.",
          },
          name: "cn-component-badge-default-text",
          attributes: {
            category: "component",
            type: "badge",
            item: "default",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "badge", "default", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(18.63% 6.73 287.29)",
          $description:
            "Background color for secondary badges. Creates less prominent badge styling for secondary information.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.850}",
            $description:
              "Background color for secondary badges. Creates less prominent badge styling for secondary information.",
          },
          name: "cn-component-badge-default-background",
          attributes: {
            category: "component",
            type: "badge",
            item: "default",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "badge", "default", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(18.63% 6.73 287.29)",
          $description:
            "Border color for secondary badges. Matches background for clean, cohesive appearance.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.badge.default.background}",
            $description:
              "Border color for secondary badges. Matches background for clean, cohesive appearance.",
          },
          name: "cn-component-badge-default-border",
          attributes: {
            category: "component",
            type: "badge",
            item: "default",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "badge", "default", "border"],
        },
      },
      neutral: {
        text: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Text color for outline badges. Ensures readability for badges with transparent backgrounds.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.2}",
            $description:
              "Text color for outline badges. Ensures readability for badges with transparent backgrounds.",
          },
          name: "cn-component-badge-neutral-text",
          attributes: {
            category: "component",
            type: "badge",
            item: "neutral",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "badge", "neutral", "text"],
        },
        background: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-chrome-500) l c h / 0.1)",
          $description:
            "Background color for neutral badges. Creates subtle visual styling for general-purpose indicators.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.chrome.500}",
            $description:
              "Background color for neutral badges. Creates subtle visual styling for general-purpose indicators.",
          },
          name: "cn-component-badge-neutral-background",
          attributes: {
            category: "component",
            type: "badge",
            item: "neutral",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "badge", "neutral", "background"],
        },
        border: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.6",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-chrome-300) l c h / 0.6)",
          $description:
            "Border color for outline badges. Creates definition for badges without background fill.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.6",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.chrome.300}",
            $description:
              "Border color for outline badges. Creates definition for badges without background fill.",
          },
          name: "cn-component-badge-neutral-border",
          attributes: {
            category: "component",
            type: "badge",
            item: "neutral",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "badge", "neutral", "border"],
        },
      },
      success: {
        text: {
          $type: "color",
          $value: "lch(74.15% 29 241)",
          $description:
            "Text color for success badges. Communicates positive status through readable cyan text.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.200}",
            $description:
              "Text color for success badges. Communicates positive status through readable cyan text.",
          },
          name: "cn-component-badge-success-text",
          attributes: {
            category: "component",
            type: "badge",
            item: "success",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "badge", "success", "text"],
        },
        border: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.6",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-cyan-300) l c h / 0.6)",
          $description:
            "Border color for success badges. Provides subtle definition for success state indicators.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.6",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.cyan.300}",
            $description:
              "Border color for success badges. Provides subtle definition for success state indicators.",
          },
          name: "cn-component-badge-success-border",
          attributes: {
            category: "component",
            type: "badge",
            item: "success",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "badge", "success", "border"],
        },
        background: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-cyan-500) l c h / 0.1)",
          $description:
            "Background color for success badges. Creates a subtle but recognizable success indicator.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.cyan.500}",
            $description:
              "Background color for success badges. Creates a subtle but recognizable success indicator.",
          },
          name: "cn-component-badge-success-background",
          attributes: {
            category: "component",
            type: "badge",
            item: "success",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "badge", "success", "background"],
        },
      },
      danger: {
        text: {
          $type: "color",
          $value: "lch(72.7% 48.17 33.53)",
          $description:
            "Text color for danger badges. Communicates error or warning status with high visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.red.200}",
            $description:
              "Text color for danger badges. Communicates error or warning status with high visibility.",
          },
          name: "cn-component-badge-danger-text",
          attributes: {
            category: "component",
            type: "badge",
            item: "danger",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "badge", "danger", "text"],
        },
        border: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.6",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-red-300) l c h / 0.6)",
          $description:
            "Border color for danger badges. Creates definition for error or warning indicators.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.6",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.red.300}",
            $description:
              "Border color for danger badges. Creates definition for error or warning indicators.",
          },
          name: "cn-component-badge-danger-border",
          attributes: {
            category: "component",
            type: "badge",
            item: "danger",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "badge", "danger", "border"],
        },
        background: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-red-500) l c h / 0.1)",
          $description:
            "Background color for danger badges. Provides subtle visual indication of error states.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.red.500}",
            $description:
              "Background color for danger badges. Provides subtle visual indication of error states.",
          },
          name: "cn-component-badge-danger-background",
          attributes: {
            category: "component",
            type: "badge",
            item: "danger",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "badge", "danger", "background"],
        },
      },
      warning: {
        text: {
          $type: "color",
          $value: "lch(74.82% 51.93 49.87)",
          $description:
            "Text color for warning badges. Signals caution states with readable orange text.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.200}",
            $description:
              "Text color for warning badges. Signals caution states with readable orange text.",
          },
          name: "cn-component-badge-warning-text",
          attributes: {
            category: "component",
            type: "badge",
            item: "warning",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "badge", "warning", "text"],
        },
        border: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.6",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-orange-300) l c h / 0.6)",
          $description:
            "Border color for warning badges. Defines the boundary of caution status indicators.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.6",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.orange.300}",
            $description:
              "Border color for warning badges. Defines the boundary of caution status indicators.",
          },
          name: "cn-component-badge-warning-border",
          attributes: {
            category: "component",
            type: "badge",
            item: "warning",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "badge", "warning", "border"],
        },
        background: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-orange-500) l c h / 0.1)",
          $description:
            "Background color for warning badges. Creates subtle but recognizable caution indicators.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.orange.500}",
            $description:
              "Background color for warning badges. Creates subtle but recognizable caution indicators.",
          },
          name: "cn-component-badge-warning-background",
          attributes: {
            category: "component",
            type: "badge",
            item: "warning",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "badge", "warning", "background"],
        },
      },
      running: {
        text: {
          $type: "color",
          $value: "lch(74.82% 51.93 49.87)",
          $description:
            "Text color for running state badges. Indicates active or in-progress operations.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.200}",
            $description:
              "Text color for running state badges. Indicates active or in-progress operations.",
          },
          name: "cn-component-badge-running-text",
          attributes: {
            category: "component",
            type: "badge",
            item: "running",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "badge", "running", "text"],
        },
        border: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.6",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-orange-300) l c h / 0.6)",
          $description:
            "Border color for running state badges. Defines the boundary of active status indicators.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.6",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.orange.300}",
            $description:
              "Border color for running state badges. Defines the boundary of active status indicators.",
          },
          name: "cn-component-badge-running-border",
          attributes: {
            category: "component",
            type: "badge",
            item: "running",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "badge", "running", "border"],
        },
        background: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-orange-500) l c h / 0.1)",
          $description:
            "Background color for running state badges. Creates subtle visual indication of in-progress states.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.orange.500}",
            $description:
              "Background color for running state badges. Creates subtle visual indication of in-progress states.",
          },
          name: "cn-component-badge-running-background",
          attributes: {
            category: "component",
            type: "badge",
            item: "running",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "badge", "running", "background"],
        },
      },
      merged: {
        text: {
          $type: "color",
          $value: "lch(74.15% 29 241)",
          $description:
            "Text color for merged state badges. Indicates completed merge actions in version control contexts.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.200}",
            $description:
              "Text color for merged state badges. Indicates completed merge actions in version control contexts.",
          },
          name: "cn-component-badge-merged-text",
          attributes: {
            category: "component",
            type: "badge",
            item: "merged",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "badge", "merged", "text"],
        },
        border: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.6",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-cyan-300) l c h / 0.6)",
          $description:
            "Border color for merged state badges. Defines the boundary of merge status indicators.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.6",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.cyan.300}",
            $description:
              "Border color for merged state badges. Defines the boundary of merge status indicators.",
          },
          name: "cn-component-badge-merged-border",
          attributes: {
            category: "component",
            type: "badge",
            item: "merged",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "badge", "merged", "border"],
        },
        background: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-cyan-500) l c h / 0.1)",
          $description:
            "Background color for merged state badges. Creates subtle but recognizable merge indicators.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.cyan.500}",
            $description:
              "Background color for merged state badges. Creates subtle but recognizable merge indicators.",
          },
          name: "cn-component-badge-merged-background",
          attributes: {
            category: "component",
            type: "badge",
            item: "merged",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "badge", "merged", "background"],
        },
      },
      ai: {
        text: {
          $type: "color",
          $value: "lch(98.27% 0.36 135.2)",
          $description:
            "Text color for AI-related badges. Ensures high contrast against AI badge gradient border.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.1}",
            $description:
              "Text color for AI-related badges. Ensures high contrast against AI badge gradient border.",
          },
          name: "cn-component-badge-ai-text",
          attributes: {
            category: "component",
            type: "badge",
            item: "ai",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "badge", "ai", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(5.2% 3.07 285.78)",
          $description:
            "Background color for AI-related badges. Creates a subtle backdrop that highlights the gradient border.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{background.3}",
            $description:
              "Background color for AI-related badges. Creates a subtle backdrop that highlights the gradient border.",
          },
          name: "cn-component-badge-ai-background",
          attributes: {
            category: "component",
            type: "badge",
            item: "ai",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "badge", "ai", "background"],
        },
        border: {
          $type: "color",
          $value:
            "linear-gradient(94deg, lch(90.02% 17.62 61.56) 0%, lch(72% 46.72 350.11) 35%, lch(65.49% 45.28 239) 65%, lch(74.15% 29 241) 100%)",
          $description:
            "Gradient border color for AI-related badges. Creates distinctive multi-color styling to highlight AI functionality.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value:
              "linear-gradient(94deg, {gradient.ai.gradient-stop-1} 0%, {gradient.ai.gradient-stop-2} 35%, {gradient.ai.gradient-stop-3} 65%, {gradient.ai.gradient-stop-4} 100%)",
            $description:
              "Gradient border color for AI-related badges. Creates distinctive multi-color styling to highlight AI functionality.",
          },
          name: "cn-component-badge-ai-border",
          attributes: {
            category: "component",
            type: "badge",
            item: "ai",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "badge", "ai", "border"],
        },
      },
    },
    breadcrumb: {
      "item-inactive": {
        $type: "color",
        $value: "lch(81.33% 4.52 285.46)",
        $description:
          "Text color for inactive breadcrumb items. Provides reduced emphasis for previous navigation steps.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.2}",
          $description:
            "Text color for inactive breadcrumb items. Provides reduced emphasis for previous navigation steps.",
        },
        name: "cn-component-breadcrumb-item-inactive",
        attributes: {
          category: "component",
          type: "breadcrumb",
          item: "item-inactive",
          themeable: true,
        },
        path: ["component", "breadcrumb", "item-inactive"],
      },
      "item-current": {
        $type: "color",
        $value: "lch(98.27% 0.36 135.2)",
        $description:
          "Text color for current breadcrumb item. Emphasizes the user's current location in the navigation hierarchy.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.1}",
          $description:
            "Text color for current breadcrumb item. Emphasizes the user's current location in the navigation hierarchy.",
        },
        name: "cn-component-breadcrumb-item-current",
        attributes: {
          category: "component",
          type: "breadcrumb",
          item: "item-current",
          themeable: true,
        },
        path: ["component", "breadcrumb", "item-current"],
      },
      separator: {
        $type: "color",
        $value: "lch(39.46% 8.98 286.89)",
        $description:
          "Color for breadcrumb separator characters. Creates visual distinction between breadcrumb items.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{state.disabled.text}",
          $description:
            "Color for breadcrumb separator characters. Creates visual distinction between breadcrumb items.",
        },
        name: "cn-component-breadcrumb-separator",
        attributes: {
          category: "component",
          type: "breadcrumb",
          item: "separator",
          themeable: true,
        },
        path: ["component", "breadcrumb", "separator"],
      },
    },
    btn: {
      primary: {
        text: {
          $type: "color",
          $value: "lch(100% 0 134.54)",
          $description:
            "Text and icon color for primary action buttons. Ensures maximum contrast and visibility for primary CTA elements.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{brand.onColor.600}",
            $description:
              "Text and icon color for primary action buttons. Ensures maximum contrast and visibility for primary CTA elements.",
          },
          name: "cn-component-btn-primary-text",
          attributes: {
            category: "component",
            type: "btn",
            item: "primary",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "btn", "primary", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(37.53% 36.5 254)",
          $description:
            "Background color for primary action buttons. Creates emphasis for the most important action in a given context.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{brand.color.600}",
            $description:
              "Background color for primary action buttons. Creates emphasis for the most important action in a given context.",
          },
          name: "cn-component-btn-primary-background",
          attributes: {
            category: "component",
            type: "btn",
            item: "primary",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "btn", "primary", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(37.53% 36.5 254)",
          $description:
            "Border color for primary action buttons. Matches background for clean, cohesive appearance.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.btn.primary.background}",
            $description:
              "Border color for primary action buttons. Matches background for clean, cohesive appearance.",
          },
          name: "cn-component-btn-primary-border",
          attributes: {
            category: "component",
            type: "btn",
            item: "primary",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "btn", "primary", "border"],
        },
      },
      secondary: {
        text: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Text and icon color for secondary action buttons. Provides readable contrast for supporting actions.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.2}",
            $description:
              "Text and icon color for secondary action buttons. Provides readable contrast for supporting actions.",
          },
          name: "cn-component-btn-secondary-text",
          attributes: {
            category: "component",
            type: "btn",
            item: "secondary",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "btn", "secondary", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(18.63% 6.73 287.29)",
          $description:
            "Background color for secondary action buttons. Creates visual hierarchy between primary and secondary actions.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.850}",
            $description:
              "Background color for secondary action buttons. Creates visual hierarchy between primary and secondary actions.",
          },
          name: "cn-component-btn-secondary-background",
          attributes: {
            category: "component",
            type: "btn",
            item: "secondary",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "btn", "secondary", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(18.63% 6.73 287.29)",
          $description:
            "Border color for secondary action buttons. Matches background for clean, cohesive appearance.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.btn.secondary.background}",
            $description:
              "Border color for secondary action buttons. Matches background for clean, cohesive appearance.",
          },
          name: "cn-component-btn-secondary-border",
          attributes: {
            category: "component",
            type: "btn",
            item: "secondary",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "btn", "secondary", "border"],
        },
      },
      outline: {
        background: {
          $type: "color",
          $value: "lch(3.66% 1.93 285.7)",
          $description: "Background color for outline buttons.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{background.2}",
            $description: "Background color for outline buttons.",
          },
          name: "cn-component-btn-outline-background",
          attributes: {
            category: "component",
            type: "btn",
            item: "outline",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "btn", "outline", "background"],
        },
        unselected: {
          text: {
            $type: "color",
            $value: "lch(81.33% 4.52 285.46)",
            $description:
              "Text color for unselected outline buttons. Provides readable contrast against transparent backgrounds.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.2}",
              $description:
                "Text color for unselected outline buttons. Provides readable contrast against transparent backgrounds.",
            },
            name: "cn-component-btn-outline-unselected-text",
            attributes: {
              category: "component",
              type: "btn",
              item: "outline",
              subitem: "unselected",
              state: "text",
              themeable: true,
            },
            path: ["component", "btn", "outline", "unselected", "text"],
          },
          icon: {
            $type: "color",
            $value: "lch(67.41% 4.51 285.56)",
            $description:
              "Icon color for unselected outline buttons. Creates subtle emphasis for button icons.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.3}",
              $description:
                "Icon color for unselected outline buttons. Creates subtle emphasis for button icons.",
            },
            name: "cn-component-btn-outline-unselected-icon",
            attributes: {
              category: "component",
              type: "btn",
              item: "outline",
              subitem: "unselected",
              state: "icon",
              themeable: true,
            },
            path: ["component", "btn", "outline", "unselected", "icon"],
          },
          border: {
            $type: "color",
            $value: "lch(39.46% 8.98 286.89)",
            $description:
              "Border color for unselected outline buttons. Defines the clickable area with a visible boundary.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{border.2}",
              $description:
                "Border color for unselected outline buttons. Defines the clickable area with a visible boundary.",
            },
            name: "cn-component-btn-outline-unselected-border",
            attributes: {
              category: "component",
              type: "btn",
              item: "outline",
              subitem: "unselected",
              state: "border",
              themeable: true,
            },
            path: ["component", "btn", "outline", "unselected", "border"],
          },
        },
        selected: {
          text: {
            $type: "color",
            $value: "lch(98.27% 0.36 135.2)",
            $description:
              "Text color for selected outline buttons. Increases contrast for active button states.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.1}",
              $description:
                "Text color for selected outline buttons. Increases contrast for active button states.",
            },
            name: "cn-component-btn-outline-selected-text",
            attributes: {
              category: "component",
              type: "btn",
              item: "outline",
              subitem: "selected",
              state: "text",
              themeable: true,
            },
            path: ["component", "btn", "outline", "selected", "text"],
          },
          icon: {
            $type: "color",
            $value: "lch(98.27% 0.36 135.2)",
            $description:
              "Icon color for selected outline buttons. Increases visibility for active button states.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.1}",
              $description:
                "Icon color for selected outline buttons. Increases visibility for active button states.",
            },
            name: "cn-component-btn-outline-selected-icon",
            attributes: {
              category: "component",
              type: "btn",
              item: "outline",
              subitem: "selected",
              state: "icon",
              themeable: true,
            },
            path: ["component", "btn", "outline", "selected", "icon"],
          },
          border: {
            $type: "color",
            $value: "lch(81.33% 4.52 285.46)",
            $description:
              "Border color for selected outline buttons. Creates stronger visual indication of the active state.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{border.1}",
              $description:
                "Border color for selected outline buttons. Creates stronger visual indication of the active state.",
            },
            name: "cn-component-btn-outline-selected-border",
            attributes: {
              category: "component",
              type: "btn",
              item: "outline",
              subitem: "selected",
              state: "border",
              themeable: true,
            },
            path: ["component", "btn", "outline", "selected", "border"],
          },
        },
      },
      ghost: {
        unselected: {
          text: {
            $type: "color",
            $value: "lch(81.33% 4.52 285.46)",
            $description:
              "Text color for unselected ghost buttons. Provides readable contrast for minimal styling.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.2}",
              $description:
                "Text color for unselected ghost buttons. Provides readable contrast for minimal styling.",
            },
            name: "cn-component-btn-ghost-unselected-text",
            attributes: {
              category: "component",
              type: "btn",
              item: "ghost",
              subitem: "unselected",
              state: "text",
              themeable: true,
            },
            path: ["component", "btn", "ghost", "unselected", "text"],
          },
          icon: {
            $type: "color",
            $value: "lch(67.41% 4.51 285.56)",
            $description:
              "Icon color for unselected ghost buttons. Creates subtle emphasis for button icons.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.3}",
              $description:
                "Icon color for unselected ghost buttons. Creates subtle emphasis for button icons.",
            },
            name: "cn-component-btn-ghost-unselected-icon",
            attributes: {
              category: "component",
              type: "btn",
              item: "ghost",
              subitem: "unselected",
              state: "icon",
              themeable: true,
            },
            path: ["component", "btn", "ghost", "unselected", "icon"],
          },
        },
        selected: {
          text: {
            $type: "color",
            $value: "lch(98.27% 0.36 135.2)",
            $description:
              "Text color for selected ghost buttons. Increases contrast for active button states.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.1}",
              $description:
                "Text color for selected ghost buttons. Increases contrast for active button states.",
            },
            name: "cn-component-btn-ghost-selected-text",
            attributes: {
              category: "component",
              type: "btn",
              item: "ghost",
              subitem: "selected",
              state: "text",
              themeable: true,
            },
            path: ["component", "btn", "ghost", "selected", "text"],
          },
          icon: {
            $type: "color",
            $value: "lch(98.27% 0.36 135.2)",
            $description:
              "Icon color for selected ghost buttons. Increases visibility for active button states.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.1}",
              $description:
                "Icon color for selected ghost buttons. Increases visibility for active button states.",
            },
            name: "cn-component-btn-ghost-selected-icon",
            attributes: {
              category: "component",
              type: "btn",
              item: "ghost",
              subitem: "selected",
              state: "icon",
              themeable: true,
            },
            path: ["component", "btn", "ghost", "selected", "icon"],
          },
        },
      },
      success: {
        text: {
          $type: "color",
          $value: "lch(74.15% 29 241)",
          $description:
            "Text color for success buttons. Communicates positive actions through readable cyan text.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.200}",
            $description:
              "Text color for success buttons. Communicates positive actions through readable cyan text.",
          },
          name: "cn-component-btn-success-text",
          attributes: {
            category: "component",
            type: "btn",
            item: "success",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "btn", "success", "text"],
        },
        background: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-cyan-500) l c h / 0.1)",
          $description:
            "Background color for success buttons. Creates subtle but recognizable positive action styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.cyan.500}",
            $description:
              "Background color for success buttons. Creates subtle but recognizable positive action styling.",
          },
          name: "cn-component-btn-success-background",
          attributes: {
            category: "component",
            type: "btn",
            item: "success",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "btn", "success", "background"],
        },
        border: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.6",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-cyan-300) l c h / 0.6)",
          $description:
            "Border color for success buttons. Provides definition for positive action buttons.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.6",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.cyan.300}",
            $description:
              "Border color for success buttons. Provides definition for positive action buttons.",
          },
          name: "cn-component-btn-success-border",
          attributes: {
            category: "component",
            type: "btn",
            item: "success",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "btn", "success", "border"],
        },
        state: {
          hover: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.15",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "lch(from var(--cn-colors-cyan-500) l c h / 0.15)",
            $description:
              "Hover state background color for success buttons. Creates subtle feedback for user interaction.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $extensions: {
                "studio.tokens": {
                  modify: {
                    type: "alpha",
                    value: "0.15",
                    space: "lch",
                  },
                },
              },
              $type: "color",
              $value: "{colors.cyan.500}",
              $description:
                "Hover state background color for success buttons. Creates subtle feedback for user interaction.",
            },
            name: "cn-component-btn-success-state-hover",
            attributes: {
              category: "component",
              type: "btn",
              item: "success",
              subitem: "state",
              state: "hover",
              themeable: true,
            },
            path: ["component", "btn", "success", "state", "hover"],
          },
          active: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.25",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "lch(from var(--cn-colors-cyan-500) l c h / 0.25)",
            $description:
              "Active state background color for success buttons. Provides stronger visual feedback for clicks/presses.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $extensions: {
                "studio.tokens": {
                  modify: {
                    type: "alpha",
                    value: "0.25",
                    space: "lch",
                  },
                },
              },
              $type: "color",
              $value: "{colors.cyan.500}",
              $description:
                "Active state background color for success buttons. Provides stronger visual feedback for clicks/presses.",
            },
            name: "cn-component-btn-success-state-active",
            attributes: {
              category: "component",
              type: "btn",
              item: "success",
              subitem: "state",
              state: "active",
              themeable: true,
            },
            path: ["component", "btn", "success", "state", "active"],
          },
        },
      },
      danger: {
        text: {
          $type: "color",
          $value: "lch(72.7% 48.17 33.53)",
          $description:
            "Text color for danger buttons. Communicates destructive or warning actions through high-contrast red text.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.red.200}",
            $description:
              "Text color for danger buttons. Communicates destructive or warning actions through high-contrast red text.",
          },
          name: "cn-component-btn-danger-text",
          attributes: {
            category: "component",
            type: "btn",
            item: "danger",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "btn", "danger", "text"],
        },
        background: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-red-500) l c h / 0.1)",
          $description:
            "Background color for danger buttons. Creates subtle but recognizable destructive action styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.red.500}",
            $description:
              "Background color for danger buttons. Creates subtle but recognizable destructive action styling.",
          },
          name: "cn-component-btn-danger-background",
          attributes: {
            category: "component",
            type: "btn",
            item: "danger",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "btn", "danger", "background"],
        },
        border: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.6",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-red-300) l c h / 0.6)",
          $description:
            "Border color for danger buttons. Provides definition for destructive action buttons.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.6",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.red.300}",
            $description:
              "Border color for danger buttons. Provides definition for destructive action buttons.",
          },
          name: "cn-component-btn-danger-border",
          attributes: {
            category: "component",
            type: "btn",
            item: "danger",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "btn", "danger", "border"],
        },
        state: {
          hover: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.15",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "lch(from var(--cn-colors-red-500) l c h / 0.15)",
            $description:
              "Hover state background color for danger buttons. Creates subtle feedback for user interaction.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $extensions: {
                "studio.tokens": {
                  modify: {
                    type: "alpha",
                    value: "0.15",
                    space: "lch",
                  },
                },
              },
              $type: "color",
              $value: "{colors.red.500}",
              $description:
                "Hover state background color for danger buttons. Creates subtle feedback for user interaction.",
            },
            name: "cn-component-btn-danger-state-hover",
            attributes: {
              category: "component",
              type: "btn",
              item: "danger",
              subitem: "state",
              state: "hover",
              themeable: true,
            },
            path: ["component", "btn", "danger", "state", "hover"],
          },
          active: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.25",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "lch(from var(--cn-colors-red-500) l c h / 0.25)",
            $description:
              "Active state background color for danger buttons. Provides stronger visual feedback for clicks/presses.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $extensions: {
                "studio.tokens": {
                  modify: {
                    type: "alpha",
                    value: "0.25",
                    space: "lch",
                  },
                },
              },
              $type: "color",
              $value: "{colors.red.500}",
              $description:
                "Active state background color for danger buttons. Provides stronger visual feedback for clicks/presses.",
            },
            name: "cn-component-btn-danger-state-active",
            attributes: {
              category: "component",
              type: "btn",
              item: "danger",
              subitem: "state",
              state: "active",
              themeable: true,
            },
            path: ["component", "btn", "danger", "state", "active"],
          },
        },
      },
      ai: {
        text: {
          $type: "color",
          $value: "lch(98.27% 0.36 135.2)",
          $description:
            "Text color for AI-powered buttons. Ensures high contrast against AI button gradient border.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.1}",
            $description:
              "Text color for AI-powered buttons. Ensures high contrast against AI button gradient border.",
          },
          name: "cn-component-btn-ai-text",
          attributes: {
            category: "component",
            type: "btn",
            item: "ai",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "btn", "ai", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(3.66% 1.93 285.7)",
          $description: "Background color for AI-powered buttons.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{background.2}",
            $description: "Background color for AI-powered buttons.",
          },
          name: "cn-component-btn-ai-background",
          attributes: {
            category: "component",
            type: "btn",
            item: "ai",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "btn", "ai", "background"],
        },
        border: {
          $type: "color",
          $value:
            "linear-gradient(94deg, lch(90.02% 17.62 61.56) 0%, lch(72% 46.72 350.11) 35%, lch(65.49% 45.28 239) 65%, lch(74.15% 29 241) 100%)",
          $description:
            "Gradient border color for AI-powered buttons. Creates distinctive multi-color styling to highlight AI functionality.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value:
              "linear-gradient(94deg, {gradient.ai.gradient-stop-1} 0%, {gradient.ai.gradient-stop-2} 35%, {gradient.ai.gradient-stop-3} 65%, {gradient.ai.gradient-stop-4} 100%)",
            $description:
              "Gradient border color for AI-powered buttons. Creates distinctive multi-color styling to highlight AI functionality.",
          },
          name: "cn-component-btn-ai-border",
          attributes: {
            category: "component",
            type: "btn",
            item: "ai",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "btn", "ai", "border"],
        },
      },
    },
    card: {
      background: {
        $type: "color",
        $value: "lch(3.66% 1.93 285.7)",
        $description:
          "Background color for card components. Creates a distinct surface that appears elevated from the page background.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.2}",
          $description:
            "Background color for card components. Creates a distinct surface that appears elevated from the page background.",
        },
        name: "cn-component-card-background",
        attributes: {
          category: "component",
          type: "card",
          item: "background",
          themeable: true,
        },
        path: ["component", "card", "background"],
      },
      border: {
        $type: "color",
        $value: "lch(39.46% 8.98 286.89)",
        $description:
          "Border color for card components. Defines the card boundaries and enhances visual separation from surrounding content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.2}",
          $description:
            "Border color for card components. Defines the card boundaries and enhances visual separation from surrounding content.",
        },
        name: "cn-component-card-border",
        attributes: {
          category: "component",
          type: "card",
          item: "border",
          themeable: true,
        },
        path: ["component", "card", "border"],
      },
    },
    dialog: {
      title: {
        $type: "color",
        $value: "lch(98.27% 0.36 135.2)",
        $description:
          "Text color for dialog titles. Ensures high visibility and emphasis for the modal heading.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.1}",
          $description:
            "Text color for dialog titles. Ensures high visibility and emphasis for the modal heading.",
        },
        name: "cn-component-dialog-title",
        attributes: {
          category: "component",
          type: "dialog",
          item: "title",
          themeable: true,
        },
        path: ["component", "dialog", "title"],
      },
      description: {
        $type: "color",
        $value: "lch(81.33% 4.52 285.46)",
        $description:
          "Text color for dialog content. Provides readable contrast for the modal's primary text content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.2}",
          $description:
            "Text color for dialog content. Provides readable contrast for the modal's primary text content.",
        },
        name: "cn-component-dialog-description",
        attributes: {
          category: "component",
          type: "dialog",
          item: "description",
          themeable: true,
        },
        path: ["component", "dialog", "description"],
      },
      background: {
        $type: "color",
        $value: "lch(5.2% 3.07 285.78)",
        $description:
          "Background color for dialog components. Creates a distinct surface for modal content that appears above the main UI.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.3}",
          $description:
            "Background color for dialog components. Creates a distinct surface for modal content that appears above the main UI.",
        },
        name: "cn-component-dialog-background",
        attributes: {
          category: "component",
          type: "dialog",
          item: "background",
          themeable: true,
        },
        path: ["component", "dialog", "background"],
      },
      border: {
        $type: "color",
        $value: "lch(39.46% 8.98 286.89)",
        $description: "Border color for dialog components.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.2}",
          $description: "Border color for dialog components.",
        },
        name: "cn-component-dialog-border",
        attributes: {
          category: "component",
          type: "dialog",
          item: "border",
          themeable: true,
        },
        path: ["component", "dialog", "border"],
      },
      backdrop: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.5",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "lch(from var(--cn-colors-chrome-950) l c h / 0.5)",
        $description:
          "Overlay color behind dialog components. Creates focus on the dialog by dimming content underneath.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.5",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "{colors.chrome.950}",
          $description:
            "Overlay color behind dialog components. Creates focus on the dialog by dimming content underneath.",
        },
        name: "cn-component-dialog-backdrop",
        attributes: {
          category: "component",
          type: "dialog",
          item: "backdrop",
          themeable: true,
        },
        path: ["component", "dialog", "backdrop"],
      },
    },
    dropdown: {
      background: {
        $type: "color",
        $value: "lch(3.66% 1.93 285.7)",
        $description:
          "Background color for dropdown menus. Creates a distinct surface for selectable options.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.2}",
          $description:
            "Background color for dropdown menus. Creates a distinct surface for selectable options.",
        },
        name: "cn-component-dropdown-background",
        attributes: {
          category: "component",
          type: "dropdown",
          item: "background",
          themeable: true,
        },
        path: ["component", "dropdown", "background"],
      },
      border: {
        $type: "color",
        $value: "lch(39.46% 8.98 286.89)",
        $description: "Border color for dropdown menus container.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.2}",
          $description: "Border color for dropdown menus container.",
        },
        name: "cn-component-dropdown-border",
        attributes: {
          category: "component",
          type: "dropdown",
          item: "border",
          themeable: true,
        },
        path: ["component", "dropdown", "border"],
      },
      item: {
        text: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Text color for dropdown menu items. Ensures readability of selectable options.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.2}",
            $description:
              "Text color for dropdown menu items. Ensures readability of selectable options.",
          },
          name: "cn-component-dropdown-item-text",
          attributes: {
            category: "component",
            type: "dropdown",
            item: "item",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "dropdown", "item", "text"],
        },
        delete: {
          text: {
            $type: "color",
            $value: "lch(72.7% 48.17 33.53)",
            $description: "Text color for dropdown menu delete-item.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.danger}",
              $description: "Text color for dropdown menu delete-item.",
            },
            name: "cn-component-dropdown-item-delete-text",
            attributes: {
              category: "component",
              type: "dropdown",
              item: "item",
              subitem: "delete",
              state: "text",
              themeable: true,
            },
            path: ["component", "dropdown", "item", "delete", "text"],
          },
          state: {
            hover: {
              $extensions: {
                "studio.tokens": {
                  modify: {
                    type: "alpha",
                    value: "0.1",
                    space: "lch",
                  },
                },
              },
              $type: "color",
              $value: "lch(from var(--cn-colors-red-500) l c h / 0.1)",
              $description:
                "Specific hover state color for dropdown delete-item.",
              filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
              isSource: true,
              original: {
                $extensions: {
                  "studio.tokens": {
                    modify: {
                      type: "alpha",
                      value: "0.1",
                      space: "lch",
                    },
                  },
                },
                $type: "color",
                $value: "{colors.red.500}",
                $description:
                  "Specific hover state color for dropdown delete-item.",
              },
              name: "cn-component-dropdown-item-delete-state-hover",
              attributes: {
                category: "component",
                type: "dropdown",
                item: "item",
                subitem: "delete",
                state: "state",
                themeable: true,
              },
              path: [
                "component",
                "dropdown",
                "item",
                "delete",
                "state",
                "hover",
              ],
            },
          },
        },
      },
    },
    diff: {
      grey: {
        $type: "color",
        $value: "lch(2.44% 1.49 285.81)",
        $description:
          "Neutral base color for the diff interface that allows code and difference highlights to remain visually prominent.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.1}",
          $description:
            "Neutral base color for the diff interface that allows code and difference highlights to remain visually prominent.",
        },
        name: "cn-component-diff-grey",
        attributes: {
          category: "component",
          type: "diff",
          item: "grey",
          themeable: true,
        },
        path: ["component", "diff", "grey"],
      },
      "add-content": {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.12",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "lch(from var(--cn-colors-cyan-500) l c h / 0.12)",
        $description:
          "Cyan background highlighting newly added code lines while maintaining readability.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.12",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "{colors.cyan.500}",
          $description:
            "Cyan background highlighting newly added code lines while maintaining readability.",
        },
        name: "cn-component-diff-add-content",
        attributes: {
          category: "component",
          type: "diff",
          item: "add-content",
          themeable: true,
        },
        path: ["component", "diff", "add-content"],
      },
      "add-lineNumber": {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.2",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "lch(from var(--cn-colors-cyan-500) l c h / 0.2)",
        $description:
          "Background for line numbers of added code, providing visual connection to added content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.2",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "{colors.cyan.500}",
          $description:
            "Background for line numbers of added code, providing visual connection to added content.",
        },
        name: "cn-component-diff-add-line-number",
        attributes: {
          category: "component",
          type: "diff",
          item: "add-lineNumber",
          themeable: true,
        },
        path: ["component", "diff", "add-lineNumber"],
      },
      "add-content-highlight": {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.25",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "lch(from var(--cn-colors-cyan-500) l c h / 0.25)",
        $description:
          "Stronger emphasis color for specific character changes within added lines.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.25",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "{colors.cyan.500}",
          $description:
            "Stronger emphasis color for specific character changes within added lines.",
        },
        name: "cn-component-diff-add-content-highlight",
        attributes: {
          category: "component",
          type: "diff",
          item: "add-content-highlight",
          themeable: true,
        },
        path: ["component", "diff", "add-content-highlight"],
      },
      "add-widget": {
        $type: "color",
        $value: "lch(8.25% 4.49 287.18)",
        $description:
          "Background for interactive UI elements related to added content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.900}",
          $description:
            "Background for interactive UI elements related to added content.",
        },
        name: "cn-component-diff-add-widget",
        attributes: {
          category: "component",
          type: "diff",
          item: "add-widget",
          themeable: true,
        },
        path: ["component", "diff", "add-widget"],
      },
      "add-widget-color": {
        $type: "color",
        $value: "lch(98.27% 0.36 135.2)",
        $description:
          "Text/icon color for add-related interactive elements, ensuring readability.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.1}",
          $description:
            "Text/icon color for add-related interactive elements, ensuring readability.",
        },
        name: "cn-component-diff-add-widget-color",
        attributes: {
          category: "component",
          type: "diff",
          item: "add-widget-color",
          themeable: true,
        },
        path: ["component", "diff", "add-widget-color"],
      },
      "del-content": {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.12",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "lch(from var(--cn-colors-red-500) l c h / 0.12)",
        $description:
          "Red background highlighting removed code lines without causing eye strain.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.12",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "{colors.red.500}",
          $description:
            "Red background highlighting removed code lines without causing eye strain.",
        },
        name: "cn-component-diff-del-content",
        attributes: {
          category: "component",
          type: "diff",
          item: "del-content",
          themeable: true,
        },
        path: ["component", "diff", "del-content"],
      },
      "del-lineNumber": {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.2",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "lch(from var(--cn-colors-red-500) l c h / 0.2)",
        $description:
          "Background for line numbers of deleted code, connecting numbers to removed content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.2",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "{colors.red.500}",
          $description:
            "Background for line numbers of deleted code, connecting numbers to removed content.",
        },
        name: "cn-component-diff-del-line-number",
        attributes: {
          category: "component",
          type: "diff",
          item: "del-lineNumber",
          themeable: true,
        },
        path: ["component", "diff", "del-lineNumber"],
      },
      "del-content-highlight": {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.25",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "lch(from var(--cn-colors-red-500) l c h / 0.25)",
        $description:
          "Stronger emphasis color for specific character changes within deleted lines.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.25",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "{colors.red.500}",
          $description:
            "Stronger emphasis color for specific character changes within deleted lines.",
        },
        name: "cn-component-diff-del-content-highlight",
        attributes: {
          category: "component",
          type: "diff",
          item: "del-content-highlight",
          themeable: true,
        },
        path: ["component", "diff", "del-content-highlight"],
      },
      "plain-content": {
        $type: "color",
        $value: "lch(2.44% 1.49 285.81)",
        $description:
          "Neutral background for unchanged code that allows modified content to stand out.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.1}",
          $description:
            "Neutral background for unchanged code that allows modified content to stand out.",
        },
        name: "cn-component-diff-plain-content",
        attributes: {
          category: "component",
          type: "diff",
          item: "plain-content",
          themeable: true,
        },
        path: ["component", "diff", "plain-content"],
      },
      "plain-lineNumber": {
        $type: "color",
        $value: "lch(2.44% 1.49 285.81)",
        $description:
          "Background for line numbers of unchanged code, maintaining visual rhythm.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.1}",
          $description:
            "Background for line numbers of unchanged code, maintaining visual rhythm.",
        },
        name: "cn-component-diff-plain-line-number",
        attributes: {
          category: "component",
          type: "diff",
          item: "plain-lineNumber",
          themeable: true,
        },
        path: ["component", "diff", "plain-lineNumber"],
      },
      "plain-lineNumber-color": {
        $type: "color",
        $value: "lch(67.41% 4.51 285.56)",
        $description:
          "Text color for unchanged line numbers, visually subdued compared to changed content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.3}",
          $description:
            "Text color for unchanged line numbers, visually subdued compared to changed content.",
        },
        name: "cn-component-diff-plain-line-number-color",
        attributes: {
          category: "component",
          type: "diff",
          item: "plain-lineNumber-color",
          themeable: true,
        },
        path: ["component", "diff", "plain-lineNumber-color"],
      },
      "empty-content": {
        $type: "color",
        $value: "lch(2.44% 1.49 285.81)",
        $description:
          "Background for placeholder spaces and empty lines, maintaining visual continuity.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.1}",
          $description:
            "Background for placeholder spaces and empty lines, maintaining visual continuity.",
        },
        name: "cn-component-diff-empty-content",
        attributes: {
          category: "component",
          type: "diff",
          item: "empty-content",
          themeable: true,
        },
        path: ["component", "diff", "empty-content"],
      },
      "hunk-content": {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.12",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "lch(from var(--cn-colors-blue-500) l c h / 0.12)",
        $description:
          "Background for diff section headers ('hunks') that indicate which part of the file is displayed.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.12",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "{colors.blue.500}",
          $description:
            "Background for diff section headers ('hunks') that indicate which part of the file is displayed.",
        },
        name: "cn-component-diff-hunk-content",
        attributes: {
          category: "component",
          type: "diff",
          item: "hunk-content",
          themeable: true,
        },
        path: ["component", "diff", "hunk-content"],
      },
      "hunk-lineNumber": {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.2",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "lch(from var(--cn-colors-blue-500) l c h / 0.2)",
        $description: "Background for line numbers in section headers.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.2",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "{colors.blue.500}",
          $description: "Background for line numbers in section headers.",
        },
        name: "cn-component-diff-hunk-line-number",
        attributes: {
          category: "component",
          type: "diff",
          item: "hunk-lineNumber",
          themeable: true,
        },
        path: ["component", "diff", "hunk-lineNumber"],
      },
      "hunk-content-color": {
        $type: "color",
        $value: "lch(81.33% 4.52 285.46)",
        $description:
          "Text color for section header content showing file position information.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.2}",
          $description:
            "Text color for section header content showing file position information.",
        },
        name: "cn-component-diff-hunk-content-color",
        attributes: {
          category: "component",
          type: "diff",
          item: "hunk-content-color",
          themeable: true,
        },
        path: ["component", "diff", "hunk-content-color"],
      },
      "expand-content": {
        $type: "color",
        $value: "lch(3.66% 1.93 285.7)",
        $description:
          "Background for controls that expand/collapse code sections to show additional context.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.2}",
          $description:
            "Background for controls that expand/collapse code sections to show additional context.",
        },
        name: "cn-component-diff-expand-content",
        attributes: {
          category: "component",
          type: "diff",
          item: "expand-content",
          themeable: true,
        },
        path: ["component", "diff", "expand-content"],
      },
    },
    input: {
      text: {
        $type: "color",
        $value: "lch(81.33% 4.52 285.46)",
        $description:
          "Text color for input field content. Ensures readability of user-entered information.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.2}",
          $description:
            "Text color for input field content. Ensures readability of user-entered information.",
        },
        name: "cn-component-input-text",
        attributes: {
          category: "component",
          type: "input",
          item: "text",
          themeable: true,
        },
        path: ["component", "input", "text"],
      },
      placeholder: {
        $type: "color",
        $value: "lch(67.41% 4.51 285.56)",
        $description:
          "Text color for input field placeholders. Provides lower-contrast guidance text that doesn't compete with entered content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.3}",
          $description:
            "Text color for input field placeholders. Provides lower-contrast guidance text that doesn't compete with entered content.",
        },
        name: "cn-component-input-placeholder",
        attributes: {
          category: "component",
          type: "input",
          item: "placeholder",
          themeable: true,
        },
        path: ["component", "input", "placeholder"],
      },
      icon: {
        $type: "color",
        $value: "lch(67.41% 4.51 285.56)",
        $description:
          "Color for icons within input components. Creates visual harmony with placeholder text and decorative elements.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.3}",
          $description:
            "Color for icons within input components. Creates visual harmony with placeholder text and decorative elements.",
        },
        name: "cn-component-input-icon",
        attributes: {
          category: "component",
          type: "input",
          item: "icon",
          themeable: true,
        },
        path: ["component", "input", "icon"],
      },
      background: {
        $type: "color",
        $value: "lch(3.66% 1.93 285.7)",
        $description:
          "Background color for input fields. Creates a distinct surface for user interaction and data entry.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.2}",
          $description:
            "Background color for input fields. Creates a distinct surface for user interaction and data entry.",
        },
        name: "cn-component-input-background",
        attributes: {
          category: "component",
          type: "input",
          item: "background",
          themeable: true,
        },
        path: ["component", "input", "background"],
      },
      border: {
        $type: "color",
        $value: "lch(39.46% 8.98 286.89)",
        $description:
          "Border color for input fields. Defines the input area with a visible boundary for improved usability.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.2}",
          $description:
            "Border color for input fields. Defines the input area with a visible boundary for improved usability.",
        },
        name: "cn-component-input-border",
        attributes: {
          category: "component",
          type: "input",
          item: "border",
          themeable: true,
        },
        path: ["component", "input", "border"],
      },
    },
    label: {
      text: {
        $type: "color",
        $value: "lch(98.27% 0.36 135.2)",
        $description:
          "Text color for form labels and field identifiers. Ensures high contrast for important contextual information.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.1}",
          $description:
            "Text color for form labels and field identifiers. Ensures high contrast for important contextual information.",
        },
        name: "cn-component-label-text",
        attributes: {
          category: "component",
          type: "label",
          item: "text",
          themeable: true,
        },
        path: ["component", "label", "text"],
      },
    },
    link: {
      default: {
        $type: "color",
        $value: "lch(74.15% 29 241)",
        $description:
          "Default color for text links. Creates distinct visual identification of interactive text elements.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.accent}",
          $description:
            "Default color for text links. Creates distinct visual identification of interactive text elements.",
        },
        name: "cn-component-link-default",
        attributes: {
          category: "component",
          type: "link",
          item: "default",
          themeable: true,
        },
        path: ["component", "link", "default"],
      },
      visited: {
        $type: "color",
        $value: "lch(65.49% 45.28 239)",
        $description:
          "Visited state color for text links. Differentiates links the user has already activated.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.300}",
          $description:
            "Visited state color for text links. Differentiates links the user has already activated.",
        },
        name: "cn-component-link-visited",
        attributes: {
          category: "component",
          type: "link",
          item: "visited",
          themeable: true,
        },
        path: ["component", "link", "visited"],
      },
    },
    "nav-tabs": {
      unselected: {
        text: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description: "Unselected tab item text.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.2}",
            $description: "Unselected tab item text.",
          },
          name: "cn-component-nav-tabs-unselected-text",
          attributes: {
            category: "component",
            type: "nav-tabs",
            item: "unselected",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "nav-tabs", "unselected", "text"],
        },
      },
      selected: {
        text: {
          $type: "color",
          $value: "lch(98.27% 0.36 135.2)",
          $description: "Selected tab item text.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.1}",
            $description: "Selected tab item text.",
          },
          name: "cn-component-nav-tabs-selected-text",
          attributes: {
            category: "component",
            type: "nav-tabs",
            item: "selected",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "nav-tabs", "selected", "text"],
        },
        border: {
          $type: "color",
          $value: "lch(65.49% 45.28 239)",
          $description: "Selected tab item border.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{border.focus}",
            $description: "Selected tab item border.",
          },
          name: "cn-component-nav-tabs-selected-border",
          attributes: {
            category: "component",
            type: "nav-tabs",
            item: "selected",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "nav-tabs", "selected", "border"],
        },
      },
      border: {
        $type: "color",
        $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
        $description: "Navigation container border.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.3}",
          $description: "Navigation container border.",
        },
        name: "cn-component-nav-tabs-border",
        attributes: {
          category: "component",
          type: "nav-tabs",
          item: "border",
          themeable: true,
        },
        path: ["component", "nav-tabs", "border"],
      },
      background: {
        $type: "color",
        $value: "lch(2.44% 1.49 285.81)",
        $description: "Navigation tabs container background.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.1}",
          $description: "Navigation tabs container background.",
        },
        name: "cn-component-nav-tabs-background",
        attributes: {
          category: "component",
          type: "nav-tabs",
          item: "background",
          themeable: true,
        },
        path: ["component", "nav-tabs", "background"],
      },
    },
    pipeline: {
      arrow: {
        border: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Border color for pipeline connection arrows. Defines the visual path between pipeline components.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{border.1}",
            $description:
              "Border color for pipeline connection arrows. Defines the visual path between pipeline components.",
          },
          name: "cn-component-pipeline-arrow-border",
          attributes: {
            category: "component",
            type: "pipeline",
            item: "arrow",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "pipeline", "arrow", "border"],
        },
        running: {
          border: {
            $type: "color",
            $value:
              "linear-gradient(90deg, lch(100% 0 134.54) 0%, lch(63.4% 48.44 281.2) 50%, lch(81.33% 4.52 285.46) 100%)",
            $description:
              "Gradient border color for active pipeline arrows. Visually indicates data flow between active pipeline components.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value:
                "linear-gradient(90deg, {gradient.pipeline.arrows.gradient-stop-1} 0%, {gradient.pipeline.arrows.gradient-stop-2} 50%, {gradient.pipeline.arrows.gradient-stop-3} 100%)",
              $description:
                "Gradient border color for active pipeline arrows. Visually indicates data flow between active pipeline components.",
            },
            name: "cn-component-pipeline-arrow-running-border",
            attributes: {
              category: "component",
              type: "pipeline",
              item: "arrow",
              subitem: "running",
              state: "border",
              themeable: true,
            },
            path: ["component", "pipeline", "arrow", "running", "border"],
          },
        },
      },
      card: {
        background: {
          $type: "color",
          $value:
            "radial-gradient(90% 100% at 15% 0%,lch(18.63% 6.73 287.29) 10%, lch(8.25% 4.49 287.18) 75%)",
          $description:
            "Gradient background for pipeline cards. Creates a visually distinctive surface for pipeline visualization elements.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value:
              "radial-gradient(90% 100% at 15% 0%,{gradient.pipeline.card.background.gradient-from} 10%, {gradient.pipeline.card.background.gradient-to} 75%)",
            $description:
              "Gradient background for pipeline cards. Creates a visually distinctive surface for pipeline visualization elements.",
          },
          name: "cn-component-pipeline-card-background",
          attributes: {
            category: "component",
            type: "pipeline",
            item: "card",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "pipeline", "card", "background"],
        },
        border: {
          $type: "color",
          $value:
            "radial-gradient(90% 100% at 15% 0%,lch(26.73% 7.48 287.06) 10%, lch(18.63% 6.73 287.29) 75%)",
          $description:
            "Gradient border for pipeline cards. Enhances the visual depth and distinction of pipeline components.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value:
              "radial-gradient(90% 100% at 15% 0%,{gradient.pipeline.card.border.gradient-from} 10%, {gradient.pipeline.card.border.gradient-to} 75%)",
            $description:
              "Gradient border for pipeline cards. Enhances the visual depth and distinction of pipeline components.",
          },
          name: "cn-component-pipeline-card-border",
          attributes: {
            category: "component",
            type: "pipeline",
            item: "card",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "pipeline", "card", "border"],
        },
        running: {
          border: {
            $type: "color",
            $value:
              "radial-gradient(604% 142% at 0% 0%, lch(74.82% 51.93 49.87) 0%, lch(from var(--cn-colors-chrome-800) l c h / 0.4) 30%, lch(74.82% 51.93 49.87) 100%)",
            $description:
              "Animated gradient border for running pipeline states. Provides visual indication of active processing.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value:
                "radial-gradient(604% 142% at 0% 0%, {gradient.pipeline.running.gradient-stop-1} 0%, {gradient.pipeline.running.gradient-stop-2} 30%, {gradient.pipeline.running.gradient-stop-3} 100%)",
              $description:
                "Animated gradient border for running pipeline states. Provides visual indication of active processing.",
            },
            name: "cn-component-pipeline-card-running-border",
            attributes: {
              category: "component",
              type: "pipeline",
              item: "card",
              subitem: "running",
              state: "border",
              themeable: true,
            },
            path: ["component", "pipeline", "card", "running", "border"],
          },
        },
        error: {
          border: {
            $type: "color",
            $value: "lch(65.59% 65.99 34.56)",
            $description:
              "Border color for error pipeline states. Clearly indicates failed or problematic pipeline execution.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{colors.red.300}",
              $description:
                "Border color for error pipeline states. Clearly indicates failed or problematic pipeline execution.",
            },
            name: "cn-component-pipeline-card-error-border",
            attributes: {
              category: "component",
              type: "pipeline",
              item: "card",
              subitem: "error",
              state: "border",
              themeable: true,
            },
            path: ["component", "pipeline", "card", "error", "border"],
          },
        },
        completed: {
          border: {
            $type: "color",
            $value: "lch(65.49% 45.28 239)",
            $description:
              "Border color for completed pipeline states. Indicates successful pipeline execution.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{colors.cyan.300}",
              $description:
                "Border color for completed pipeline states. Indicates successful pipeline execution.",
            },
            name: "cn-component-pipeline-card-completed-border",
            attributes: {
              category: "component",
              type: "pipeline",
              item: "card",
              subitem: "completed",
              state: "border",
              themeable: true,
            },
            path: ["component", "pipeline", "card", "completed", "border"],
          },
        },
      },
      "card-canvas": {
        1: {
          background: {
            $type: "color",
            $value: "lch(2.44% 1.49 285.81)",
            $description:
              "The background color for the primary/top-level canvas where pipeline components are arranged. Creates the base visual layer for the main workflow area.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{background.1}",
              $description:
                "The background color for the primary/top-level canvas where pipeline components are arranged. Creates the base visual layer for the main workflow area.",
            },
            name: "cn-component-pipeline-card-canvas-1-background",
            attributes: {
              category: "component",
              type: "pipeline",
              item: "card-canvas",
              subitem: "1",
              state: "background",
              themeable: true,
            },
            path: ["component", "pipeline", "card-canvas", "1", "background"],
          },
          border: {
            $type: "color",
            $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
            $description:
              "Solid border for the outermost pipeline canvas elements. Defines the boundaries of the top-level workflow container.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{border.3}",
              $description:
                "Solid border for the outermost pipeline canvas elements. Defines the boundaries of the top-level workflow container.",
            },
            name: "cn-component-pipeline-card-canvas-1-border",
            attributes: {
              category: "component",
              type: "pipeline",
              item: "card-canvas",
              subitem: "1",
              state: "border",
              themeable: true,
            },
            path: ["component", "pipeline", "card-canvas", "1", "border"],
          },
        },
        2: {
          background: {
            $type: "color",
            $value: "lch(3.66% 1.93 285.7)",
            $description:
              "Background color for nested/secondary canvas elements that appear within the main workflow. Provides visual distinction for grouped pipeline components.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{background.2}",
              $description:
                "Background color for nested/secondary canvas elements that appear within the main workflow. Provides visual distinction for grouped pipeline components.",
            },
            name: "cn-component-pipeline-card-canvas-2-background",
            attributes: {
              category: "component",
              type: "pipeline",
              item: "card-canvas",
              subitem: "2",
              state: "background",
              themeable: true,
            },
            path: ["component", "pipeline", "card-canvas", "2", "background"],
          },
          border: {
            $type: "color",
            $value: "lch(39.46% 8.98 286.89)",
            $description:
              "Border styling applied to nested canvas containers. Creates clear visual boundaries between different sections within the pipeline visualization.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{border.2}",
              $description:
                "Border styling applied to nested canvas containers. Creates clear visual boundaries between different sections within the pipeline visualization.",
            },
            name: "cn-component-pipeline-card-canvas-2-border",
            attributes: {
              category: "component",
              type: "pipeline",
              item: "card-canvas",
              subitem: "2",
              state: "border",
              themeable: true,
            },
            path: ["component", "pipeline", "card-canvas", "2", "border"],
          },
        },
      },
      background: {
        dotes: {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.6",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-chrome-850) l c h / 0.6)",
          $description:
            "Refers to the dotted pattern visible in the background of the workspace.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.6",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.chrome.850}",
            $description:
              "Refers to the dotted pattern visible in the background of the workspace.",
          },
          name: "cn-component-pipeline-background-dotes",
          attributes: {
            category: "component",
            type: "pipeline",
            item: "background",
            subitem: "dotes",
            themeable: true,
          },
          path: ["component", "pipeline", "background", "dotes"],
        },
      },
    },
    sidebar: {
      background: {
        $type: "color",
        $value: "lch(2.44% 1.49 285.81)",
        $description:
          "Background color for navigation components. Creates a consistent foundation for navigation elements.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.pure.black}",
          $description:
            "Background color for navigation components. Creates a consistent foundation for navigation elements.",
        },
        name: "cn-component-sidebar-background",
        attributes: {
          category: "component",
          type: "sidebar",
          item: "background",
          themeable: true,
        },
        path: ["component", "sidebar", "background"],
      },
      border: {
        $type: "color",
        $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
        $description:
          "Border color for navigation components. Creates visual boundaries and separation from adjacent content.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.3}",
          $description:
            "Border color for navigation components. Creates visual boundaries and separation from adjacent content.",
        },
        name: "cn-component-sidebar-border",
        attributes: {
          category: "component",
          type: "sidebar",
          item: "border",
          themeable: true,
        },
        path: ["component", "sidebar", "border"],
      },
      separator: {
        $type: "color",
        $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
        $description:
          "Color for separators between navigation sections. Creates visual organization within the navigation structure.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.3}",
          $description:
            "Color for separators between navigation sections. Creates visual organization within the navigation structure.",
        },
        name: "cn-component-sidebar-separator",
        attributes: {
          category: "component",
          type: "sidebar",
          item: "separator",
          themeable: true,
        },
        path: ["component", "sidebar", "separator"],
      },
      hover: {
        $type: "color",
        $value: "lch(from var(--cn-colors-pure-white) l c h / 0.08)",
        $description: "Hover state for navigation items.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{state.hover}",
          $description: "Hover state for navigation items.",
        },
        name: "cn-component-sidebar-hover",
        attributes: {
          category: "component",
          type: "sidebar",
          item: "hover",
          themeable: true,
        },
        path: ["component", "sidebar", "hover"],
      },
      selected: {
        $type: "color",
        $value: "lch(from var(--cn-colors-pure-white) l c h / 0.1)",
        $description: "Selected state for navigation items.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{state.selected}",
          $description: "Selected state for navigation items.",
        },
        name: "cn-component-sidebar-selected",
        attributes: {
          category: "component",
          type: "sidebar",
          item: "selected",
          themeable: true,
        },
        path: ["component", "sidebar", "selected"],
      },
      item: {
        unselected: {
          text: {
            $type: "color",
            $value: "lch(81.33% 4.52 285.46)",
            $description:
              "Text color for unselected navigation items. Provides readable but less emphasized styling for available options.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.2}",
              $description:
                "Text color for unselected navigation items. Provides readable but less emphasized styling for available options.",
            },
            name: "cn-component-sidebar-item-unselected-text",
            attributes: {
              category: "component",
              type: "sidebar",
              item: "item",
              subitem: "unselected",
              state: "text",
              themeable: true,
            },
            path: ["component", "sidebar", "item", "unselected", "text"],
          },
          icon: {
            $type: "color",
            $value: "lch(67.41% 4.51 285.56)",
            $description:
              "Icon color for unselected navigation items. Creates subtle visual indicators for navigation options.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.3}",
              $description:
                "Icon color for unselected navigation items. Creates subtle visual indicators for navigation options.",
            },
            name: "cn-component-sidebar-item-unselected-icon",
            attributes: {
              category: "component",
              type: "sidebar",
              item: "item",
              subitem: "unselected",
              state: "icon",
              themeable: true,
            },
            path: ["component", "sidebar", "item", "unselected", "icon"],
          },
        },
        selected: {
          text: {
            $type: "color",
            $value: "lch(98.27% 0.36 135.2)",
            $description:
              "Text color for selected navigation items. Increases contrast to highlight the current location.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.1}",
              $description:
                "Text color for selected navigation items. Increases contrast to highlight the current location.",
            },
            name: "cn-component-sidebar-item-selected-text",
            attributes: {
              category: "component",
              type: "sidebar",
              item: "item",
              subitem: "selected",
              state: "text",
              themeable: true,
            },
            path: ["component", "sidebar", "item", "selected", "text"],
          },
          icon: {
            $type: "color",
            $value: "lch(98.27% 0.36 135.2)",
            $description:
              "Icon color for selected navigation items. Creates stronger visual indication of the current selection.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.1}",
              $description:
                "Icon color for selected navigation items. Creates stronger visual indication of the current selection.",
            },
            name: "cn-component-sidebar-item-selected-icon",
            attributes: {
              category: "component",
              type: "sidebar",
              item: "item",
              subitem: "selected",
              state: "icon",
              themeable: true,
            },
            path: ["component", "sidebar", "item", "selected", "icon"],
          },
        },
      },
      logo: {
        text: {
          $type: "color",
          $value: "lch(98.27% 0.36 135.2)",
          $description: "Text color for Logo in sidebar navigation.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.1}",
            $description: "Text color for Logo in sidebar navigation.",
          },
          name: "cn-component-sidebar-logo-text",
          attributes: {
            category: "component",
            type: "sidebar",
            item: "logo",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "sidebar", "logo", "text"],
        },
        icon: {
          $type: "color",
          $value: "lch(65.49% 45.28 239)",
          $description: "Icon color for Logo in sidebar navigation.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.300}",
            $description: "Icon color for Logo in sidebar navigation.",
          },
          name: "cn-component-sidebar-logo-icon",
          attributes: {
            category: "component",
            type: "sidebar",
            item: "logo",
            subitem: "icon",
            themeable: true,
          },
          path: ["component", "sidebar", "logo", "icon"],
        },
      },
      search: {
        background: {
          $type: "color",
          $value: "lch(2.44% 1.49 285.81)",
          $description:
            "Search input specific background on sidebar navigation.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.sidebar.background}",
            $description:
              "Search input specific background on sidebar navigation.",
          },
          name: "cn-component-sidebar-search-background",
          attributes: {
            category: "component",
            type: "sidebar",
            item: "search",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "sidebar", "search", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(39.46% 8.98 286.89)",
          $description: "Search input specific border on sidebar navigation.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{border.2}",
            $description: "Search input specific border on sidebar navigation.",
          },
          name: "cn-component-sidebar-search-border",
          attributes: {
            category: "component",
            type: "sidebar",
            item: "search",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "sidebar", "search", "border"],
        },
        placeholder: {
          $type: "color",
          $value: "lch(67.41% 4.51 285.56)",
          $description:
            "Search input specific placeholder on sidebar navigation.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.3}",
            $description:
              "Search input specific placeholder on sidebar navigation.",
          },
          name: "cn-component-sidebar-search-placeholder",
          attributes: {
            category: "component",
            type: "sidebar",
            item: "search",
            subitem: "placeholder",
            themeable: true,
          },
          path: ["component", "sidebar", "search", "placeholder"],
        },
        btn: {
          background: {
            $type: "color",
            $value: "lch(5.2% 3.07 285.78)",
            $description:
              "Search input specific button background on sidebar navigation.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{background.3}",
              $description:
                "Search input specific button background on sidebar navigation.",
            },
            name: "cn-component-sidebar-search-btn-background",
            attributes: {
              category: "component",
              type: "sidebar",
              item: "search",
              subitem: "btn",
              state: "background",
              themeable: true,
            },
            path: ["component", "sidebar", "search", "btn", "background"],
          },
          border: {
            $type: "color",
            $value: "lch(39.46% 8.98 286.89)",
            $description:
              "Search input specific button border on sidebar navigation.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{border.2}",
              $description:
                "Search input specific button border on sidebar navigation.",
            },
            name: "cn-component-sidebar-search-btn-border",
            attributes: {
              category: "component",
              type: "sidebar",
              item: "search",
              subitem: "btn",
              state: "border",
              themeable: true,
            },
            path: ["component", "sidebar", "search", "btn", "border"],
          },
          text: {
            $type: "color",
            $value: "lch(67.41% 4.51 285.56)",
            $description:
              "Search input specific button text on sidebar navigation.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.3}",
              $description:
                "Search input specific button text on sidebar navigation.",
            },
            name: "cn-component-sidebar-search-btn-text",
            attributes: {
              category: "component",
              type: "sidebar",
              item: "search",
              subitem: "btn",
              state: "text",
              themeable: true,
            },
            path: ["component", "sidebar", "search", "btn", "text"],
          },
        },
      },
      footer: {
        username: {
          $type: "color",
          $value: "lch(98.27% 0.36 135.2)",
          $description: "Username in the footer sidebar navigation menu.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.1}",
            $description: "Username in the footer sidebar navigation menu.",
          },
          name: "cn-component-sidebar-footer-username",
          attributes: {
            category: "component",
            type: "sidebar",
            item: "footer",
            subitem: "username",
            themeable: true,
          },
          path: ["component", "sidebar", "footer", "username"],
        },
        data: {
          $type: "color",
          $value: "lch(67.41% 4.51 285.56)",
          $description: "User data in the footer sidebar navigation menu.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.3}",
            $description: "User data in the footer sidebar navigation menu.",
          },
          name: "cn-component-sidebar-footer-data",
          attributes: {
            category: "component",
            type: "sidebar",
            item: "footer",
            subitem: "data",
            themeable: true,
          },
          path: ["component", "sidebar", "footer", "data"],
        },
      },
    },
    scrollbar: {
      thumb: {
        $type: "color",
        $value: "lch(18.63% 6.73 287.29)",
        $description:
          "Color for scrollbar thumb/handle elements. Provides subtle contrast against the scrollbar track for improved usability.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.850}",
          $description:
            "Color for scrollbar thumb/handle elements. Provides subtle contrast against the scrollbar track for improved usability.",
        },
        name: "cn-component-scrollbar-thumb",
        attributes: {
          category: "component",
          type: "scrollbar",
          item: "thumb",
          themeable: true,
        },
        path: ["component", "scrollbar", "thumb"],
      },
    },
    selection: {
      unselected: {
        item: {
          $type: "color",
          $value: "lch(67.41% 4.51 285.56)",
          $description:
            "Color for unselected items in selection controls. Provides readable but less emphasized styling for available options.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.3}",
            $description:
              "Color for unselected items in selection controls. Provides readable but less emphasized styling for available options.",
          },
          name: "cn-component-selection-unselected-item",
          attributes: {
            category: "component",
            type: "selection",
            item: "unselected",
            subitem: "item",
            themeable: true,
          },
          path: ["component", "selection", "unselected", "item"],
        },
        background: {
          $type: "color",
          $value: "lch(2.44% 1.49 285.81)",
          $description:
            "Background color for unselected state in selection controls. Creates visual distinction from selected items.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{background.1}",
            $description:
              "Background color for unselected state in selection controls. Creates visual distinction from selected items.",
          },
          name: "cn-component-selection-unselected-background",
          attributes: {
            category: "component",
            type: "selection",
            item: "unselected",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "selection", "unselected", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Border color for unselected elements in selection controls. Defines the clickable area with a visible boundary.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{border.1}",
            $description:
              "Border color for unselected elements in selection controls. Defines the clickable area with a visible boundary.",
          },
          name: "cn-component-selection-unselected-border",
          attributes: {
            category: "component",
            type: "selection",
            item: "unselected",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "selection", "unselected", "border"],
        },
      },
      selected: {
        item: {
          $type: "color",
          $value: "lch(5.2% 3.07 285.78)",
          $description:
            "Color for selected items in selection controls. Creates high contrast against selected background state.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.950}",
            $description:
              "Color for selected items in selection controls. Creates high contrast against selected background state.",
          },
          name: "cn-component-selection-selected-item",
          attributes: {
            category: "component",
            type: "selection",
            item: "selected",
            subitem: "item",
            themeable: true,
          },
          path: ["component", "selection", "selected", "item"],
        },
        background: {
          $type: "color",
          $value: "lch(100% 0 134.54)",
          $description:
            "Background color for selected state in selection controls. Creates strong visual indication of active selection.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.pure.white}",
            $description:
              "Background color for selected state in selection controls. Creates strong visual indication of active selection.",
          },
          name: "cn-component-selection-selected-background",
          attributes: {
            category: "component",
            type: "selection",
            item: "selected",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "selection", "selected", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(100% 0 134.54)",
          $description:
            "Border color for selected elements in selection controls. Reinforces the selected state with consistent styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.pure.white}",
            $description:
              "Border color for selected elements in selection controls. Reinforces the selected state with consistent styling.",
          },
          name: "cn-component-selection-selected-border",
          attributes: {
            category: "component",
            type: "selection",
            item: "selected",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "selection", "selected", "border"],
        },
      },
    },
    separator: {
      background: {
        $type: "color",
        $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
        $description:
          "Background color for separator elements. Creates visual division between content sections with a subtle line or space.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.3}",
          $description:
            "Background color for separator elements. Creates visual division between content sections with a subtle line or space.",
        },
        name: "cn-component-separator-background",
        attributes: {
          category: "component",
          type: "separator",
          item: "background",
          themeable: true,
        },
        path: ["component", "separator", "background"],
      },
    },
    skeleton: {
      background: {
        $type: "color",
        $value:
          "linear-gradient(90deg, lch(18.63% 6.73 287.29) 0%, lch(26.73% 7.48 287.06) 50%, lch(18.63% 6.73 287.29) 100%)",
        $description:
          'Animation color that sweeps across skeleton elements. Creates a "shimmer" effect indicating content loading states.',
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value:
            "linear-gradient(90deg, {gradient.skeleton.gradient-stop-1} 0%, {gradient.skeleton.gradient-stop-2} 50%, {gradient.skeleton.gradient-stop-3} 100%)",
          $description:
            'Animation color that sweeps across skeleton elements. Creates a "shimmer" effect indicating content loading states.',
        },
        name: "cn-component-skeleton-background",
        attributes: {
          category: "component",
          type: "skeleton",
          item: "background",
          themeable: true,
        },
        path: ["component", "skeleton", "background"],
      },
    },
    slider: {
      track: {
        base: {
          $type: "color",
          $value: "lch(18.63% 6.73 287.29)",
          $description:
            "Background color for slider tracks. Represents the full range of available values in an unselected state.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.850}",
            $description:
              "Background color for slider tracks. Represents the full range of available values in an unselected state.",
          },
          name: "cn-component-slider-track-base",
          attributes: {
            category: "component",
            type: "slider",
            item: "track",
            subitem: "base",
            themeable: true,
          },
          path: ["component", "slider", "track", "base"],
        },
        progress: {
          $type: "color",
          $value: "lch(65.49% 45.28 239)",
          $description:
            "Filled portion color for slider tracks. Visually represents the selected value or range within the track.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.300}",
            $description:
              "Filled portion color for slider tracks. Visually represents the selected value or range within the track.",
          },
          name: "cn-component-slider-track-progress",
          attributes: {
            category: "component",
            type: "slider",
            item: "track",
            subitem: "progress",
            themeable: true,
          },
          path: ["component", "slider", "track", "progress"],
        },
      },
      "track-segments": {
        base: {
          $type: "color",
          $value: "lch(46.46% 7.5 286.37)",
          $description:
            "Color for segment markers on the unfilled track portion. Creates visual indicators for specific values or intervals.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.600}",
            $description:
              "Color for segment markers on the unfilled track portion. Creates visual indicators for specific values or intervals.",
          },
          name: "cn-component-slider-track-segments-base",
          attributes: {
            category: "component",
            type: "slider",
            item: "track-segments",
            subitem: "base",
            themeable: true,
          },
          path: ["component", "slider", "track-segments", "base"],
        },
        progress: {
          $type: "color",
          $value: "lch(37.53% 36.5 254)",
          $description:
            "Color for segment markers on the filled track portion. Maintains visibility of markers within the selected range.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.600}",
            $description:
              "Color for segment markers on the filled track portion. Maintains visibility of markers within the selected range.",
          },
          name: "cn-component-slider-track-segments-progress",
          attributes: {
            category: "component",
            type: "slider",
            item: "track-segments",
            subitem: "progress",
            themeable: true,
          },
          path: ["component", "slider", "track-segments", "progress"],
        },
      },
      handle: {
        background: {
          $type: "color",
          $value: "lch(90.71% 0.38 284.93)",
          $description:
            "Background color for slider handles. Creates a distinct, interactive element for adjusting values.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.100}",
            $description:
              "Background color for slider handles. Creates a distinct, interactive element for adjusting values.",
          },
          name: "cn-component-slider-handle-background",
          attributes: {
            category: "component",
            type: "slider",
            item: "handle",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "slider", "handle", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(18.63% 6.73 287.29)",
          $description:
            "Border color for slider handles. Provides definition and contrast for the interactive control.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.850}",
            $description:
              "Border color for slider handles. Provides definition and contrast for the interactive control.",
          },
          name: "cn-component-slider-handle-border",
          attributes: {
            category: "component",
            type: "slider",
            item: "handle",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "slider", "handle", "border"],
        },
      },
    },
    "status-indicator": {
      completed: {
        $type: "color",
        $value: "lch(65.49% 45.28 239)",
        $description:
          "Color for success status indicators. Communicates completed or positive states.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.300}",
          $description:
            "Color for success status indicators. Communicates completed or positive states.",
        },
        name: "cn-component-status-indicator-completed",
        attributes: {
          category: "component",
          type: "status-indicator",
          item: "completed",
          themeable: true,
        },
        path: ["component", "status-indicator", "completed"],
      },
      cancelled: {
        $type: "color",
        $value: "lch(65.59% 65.99 34.56)",
        $description:
          "Color for danger status indicators. Communicates error or critical warning states.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.red.300}",
          $description:
            "Color for danger status indicators. Communicates error or critical warning states.",
        },
        name: "cn-component-status-indicator-cancelled",
        attributes: {
          category: "component",
          type: "status-indicator",
          item: "cancelled",
          themeable: true,
        },
        path: ["component", "status-indicator", "cancelled"],
      },
      warning: {
        $type: "color",
        $value: "lch(63.38% 78.04 52.26)",
        $description:
          "Color for warning status indicators. Communicates caution or potential issue states.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.orange.300}",
          $description:
            "Color for warning status indicators. Communicates caution or potential issue states.",
        },
        name: "cn-component-status-indicator-warning",
        attributes: {
          category: "component",
          type: "status-indicator",
          item: "warning",
          themeable: true,
        },
        path: ["component", "status-indicator", "warning"],
      },
      running: {
        $type: "color",
        $value: "lch(63.38% 78.04 52.26)",
        $description:
          "Color for running status indicators. Communicates active or in-progress operations.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.orange.300}",
          $description:
            "Color for running status indicators. Communicates active or in-progress operations.",
        },
        name: "cn-component-status-indicator-running",
        attributes: {
          category: "component",
          type: "status-indicator",
          item: "running",
          themeable: true,
        },
        path: ["component", "status-indicator", "running"],
      },
      merged: {
        $type: "color",
        $value: "lch(65.49% 45.28 239)",
        $description:
          "Color for merged status indicators. Communicates successful integration or completion in version control contexts.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.300}",
          $description:
            "Color for merged status indicators. Communicates successful integration or completion in version control contexts.",
        },
        name: "cn-component-status-indicator-merged",
        attributes: {
          category: "component",
          type: "status-indicator",
          item: "merged",
          themeable: true,
        },
        path: ["component", "status-indicator", "merged"],
      },
      "action-required": {
        $type: "color",
        $value: "lch(63.4% 48.44 281.2)",
        $description:
          "Color for action-required status indicators. Communicates that user attention or intervention is needed.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.blue.300}",
          $description:
            "Color for action-required status indicators. Communicates that user attention or intervention is needed.",
        },
        name: "cn-component-status-indicator-action-required",
        attributes: {
          category: "component",
          type: "status-indicator",
          item: "action-required",
          themeable: true,
        },
        path: ["component", "status-indicator", "action-required"],
      },
      waiting: {
        $type: "color",
        $value: "lch(67.41% 4.51 285.56)",
        $description:
          "Color for pending status indicators. Communicates in waiting states.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.400}",
          $description:
            "Color for pending status indicators. Communicates in waiting states.",
        },
        name: "cn-component-status-indicator-waiting",
        attributes: {
          category: "component",
          type: "status-indicator",
          item: "waiting",
          themeable: true,
        },
        path: ["component", "status-indicator", "waiting"],
      },
    },
    switch: {
      unselected: {
        thumb: {
          $type: "color",
          $value: "lch(67.41% 4.51 285.56)",
          $description:
            "Color for the movable thumb element in unselected switch controls. Creates visual contrast against the track.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.3}",
            $description:
              "Color for the movable thumb element in unselected switch controls. Creates visual contrast against the track.",
          },
          name: "cn-component-switch-unselected-thumb",
          attributes: {
            category: "component",
            type: "switch",
            item: "unselected",
            subitem: "thumb",
            themeable: true,
          },
          path: ["component", "switch", "unselected", "thumb"],
        },
        background: {
          $type: "color",
          $value: "lch(3.66% 1.93 285.7)",
          $description:
            "Background color for the unselected state of switch controls. Creates visual distinction from the selected state.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{background.2}",
            $description:
              "Background color for the unselected state of switch controls. Creates visual distinction from the selected state.",
          },
          name: "cn-component-switch-unselected-background",
          attributes: {
            category: "component",
            type: "switch",
            item: "unselected",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "switch", "unselected", "background"],
        },
      },
      selected: {
        thumb: {
          $type: "color",
          $value: "lch(5.2% 3.07 285.78)",
          $description:
            "Color for the movable thumb element in selected switch controls. Provides clear contrast against the active track.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.950}",
            $description:
              "Color for the movable thumb element in selected switch controls. Provides clear contrast against the active track.",
          },
          name: "cn-component-switch-selected-thumb",
          attributes: {
            category: "component",
            type: "switch",
            item: "selected",
            subitem: "thumb",
            themeable: true,
          },
          path: ["component", "switch", "selected", "thumb"],
        },
        background: {
          $type: "color",
          $value: "lch(100% 0 134.54)",
          $description:
            "Background color for the selected state of switch controls. Creates strong visual indication of active state.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.pure.white}",
            $description:
              "Background color for the selected state of switch controls. Creates strong visual indication of active state.",
          },
          name: "cn-component-switch-selected-background",
          attributes: {
            category: "component",
            type: "switch",
            item: "selected",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "switch", "selected", "background"],
        },
      },
    },
    table: {
      header: {
        text: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Text color for table header cells. Ensures readability of column labels and titles.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.2}",
            $description:
              "Text color for table header cells. Ensures readability of column labels and titles.",
          },
          name: "cn-component-table-header-text",
          attributes: {
            category: "component",
            type: "table",
            item: "header",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "table", "header", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(5.2% 3.07 285.78)",
          $description:
            "Background color for table header rows. Creates visual distinction between headers and data rows.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{background.3}",
            $description:
              "Background color for table header rows. Creates visual distinction between headers and data rows.",
          },
          name: "cn-component-table-header-background",
          attributes: {
            category: "component",
            type: "table",
            item: "header",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "table", "header", "background"],
        },
      },
      row: {
        "alternate-background": {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.1",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-chrome-200) l c h / 0.1)",
          $description:
            "Background color for alternate table rows. Improves readability by differentiating adjacent rows.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.1",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.chrome.200}",
            $description:
              "Background color for alternate table rows. Improves readability by differentiating adjacent rows.",
          },
          name: "cn-component-table-row-alternate-background",
          attributes: {
            category: "component",
            type: "table",
            item: "row",
            subitem: "alternate-background",
            themeable: true,
          },
          path: ["component", "table", "row", "alternate-background"],
        },
        border: {
          $type: "color",
          $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
          $description:
            "Border color for table rows. Provides subtle separation between data rows.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{border.3}",
            $description:
              "Border color for table rows. Provides subtle separation between data rows.",
          },
          name: "cn-component-table-row-border",
          attributes: {
            category: "component",
            type: "table",
            item: "row",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "table", "row", "border"],
        },
      },
      cell: {
        text: {
          $type: "color",
          $value: "lch(98.27% 0.36 135.2)",
          $description:
            "Text color for table cell content. Ensures high readability of tabular data.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.1}",
            $description:
              "Text color for table cell content. Ensures high readability of tabular data.",
          },
          name: "cn-component-table-cell-text",
          attributes: {
            category: "component",
            type: "table",
            item: "cell",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "table", "cell", "text"],
        },
      },
    },
    tabs: {
      background: {
        $type: "color",
        $value: "lch(2.44% 1.49 285.81)",
        $description:
          "Background color for the tabs container. Creates a consistent foundation for tab elements.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.1}",
          $description:
            "Background color for the tabs container. Creates a consistent foundation for tab elements.",
        },
        name: "cn-component-tabs-background",
        attributes: {
          category: "component",
          type: "tabs",
          item: "background",
          themeable: true,
        },
        path: ["component", "tabs", "background"],
      },
      border: {
        $type: "color",
        $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
        $description:
          "Border color for tab containers and separators. Provides subtle definition for tab boundaries.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.3}",
          $description:
            "Border color for tab containers and separators. Provides subtle definition for tab boundaries.",
        },
        name: "cn-component-tabs-border",
        attributes: {
          category: "component",
          type: "tabs",
          item: "border",
          themeable: true,
        },
        path: ["component", "tabs", "border"],
      },
      item: {
        unselected: {
          text: {
            $type: "color",
            $value: "lch(67.41% 4.51 285.56)",
            $description:
              "Text color for unselected tab items. Provides reduced emphasis for available but inactive tabs.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.3}",
              $description:
                "Text color for unselected tab items. Provides reduced emphasis for available but inactive tabs.",
            },
            name: "cn-component-tabs-item-unselected-text",
            attributes: {
              category: "component",
              type: "tabs",
              item: "item",
              subitem: "unselected",
              state: "text",
              themeable: true,
            },
            path: ["component", "tabs", "item", "unselected", "text"],
          },
          background: {
            $type: "color",
            $value: "lch(2.44% 1.49 285.81)",
            $description:
              "Background color for unselected tab items. Creates visual distinction from the active tab.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{background.1}",
              $description:
                "Background color for unselected tab items. Creates visual distinction from the active tab.",
            },
            name: "cn-component-tabs-item-unselected-background",
            attributes: {
              category: "component",
              type: "tabs",
              item: "item",
              subitem: "unselected",
              state: "background",
              themeable: true,
            },
            path: ["component", "tabs", "item", "unselected", "background"],
          },
          border: {
            $type: "color",
            $value: "lch(2.44% 1.49 285.81)",
            $description:
              "Border color for unselected tab items. Maintains consistent styling with the tab background.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{component.tabs.item.unselected.background}",
              $description:
                "Border color for unselected tab items. Maintains consistent styling with the tab background.",
            },
            name: "cn-component-tabs-item-unselected-border",
            attributes: {
              category: "component",
              type: "tabs",
              item: "item",
              subitem: "unselected",
              state: "border",
              themeable: true,
            },
            path: ["component", "tabs", "item", "unselected", "border"],
          },
        },
        selected: {
          text: {
            $type: "color",
            $value: "lch(98.27% 0.36 135.2)",
            $description:
              "Text color for the selected tab item. Increases contrast to highlight the active tab.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{text.1}",
              $description:
                "Text color for the selected tab item. Increases contrast to highlight the active tab.",
            },
            name: "cn-component-tabs-item-selected-text",
            attributes: {
              category: "component",
              type: "tabs",
              item: "item",
              subitem: "selected",
              state: "text",
              themeable: true,
            },
            path: ["component", "tabs", "item", "selected", "text"],
          },
          background: {
            $type: "color",
            $value: "lch(5.2% 3.07 285.78)",
            $description:
              "Background color for the selected tab item. Creates strong visual indication of the active tab.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{background.3}",
              $description:
                "Background color for the selected tab item. Creates strong visual indication of the active tab.",
            },
            name: "cn-component-tabs-item-selected-background",
            attributes: {
              category: "component",
              type: "tabs",
              item: "item",
              subitem: "selected",
              state: "background",
              themeable: true,
            },
            path: ["component", "tabs", "item", "selected", "background"],
          },
          border: {
            $type: "color",
            $value: "lch(39.46% 8.98 286.89)",
            $description:
              "Border color for the selected tab item. Reinforces the active state with defined boundaries.",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{border.2}",
              $description:
                "Border color for the selected tab item. Reinforces the active state with defined boundaries.",
            },
            name: "cn-component-tabs-item-selected-border",
            attributes: {
              category: "component",
              type: "tabs",
              item: "item",
              subitem: "selected",
              state: "border",
              themeable: true,
            },
            path: ["component", "tabs", "item", "selected", "border"],
          },
        },
      },
    },
    tag: {
      blue: {
        text: {
          $type: "color",
          $value: "lch(89.92% 10.91 279.8)",
          $description:
            "Text color for blue tags. Ensures readability while maintaining the blue color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.blue.100}",
            $description:
              "Text color for blue tags. Ensures readability while maintaining the blue color theme.",
          },
          name: "cn-component-tag-blue-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "blue",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "blue", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(18.28% 39.2 280.4)",
          $description:
            "Background color for blue tags. Creates a distinct surface with blue theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.blue.800}",
            $description:
              "Background color for blue tags. Creates a distinct surface with blue theme styling.",
          },
          name: "cn-component-tag-blue-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "blue",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "blue", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(2.52% 22.28 283.9)",
          $description:
            "Subtle background variation for blue tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.blue.950}",
            $description:
              "Subtle background variation for blue tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-blue-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "blue",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "blue", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(18.28% 39.2 280.4)",
          $description: "Border color for blue tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.blue.background}",
            $description: "Border color for blue tags.",
          },
          name: "cn-component-tag-blue-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "blue",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "blue", "border"],
        },
      },
      brown: {
        text: {
          $type: "color",
          $value: "lch(90.24% 19.27 79.52)",
          $description:
            "Text color for brown tags. Ensures readability while maintaining the brown color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.brown.100}",
            $description:
              "Text color for brown tags. Ensures readability while maintaining the brown color theme.",
          },
          name: "cn-component-tag-brown-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "brown",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "brown", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(19.16% 20.96 58.49)",
          $description:
            "Background color for brown tags. Creates a distinct surface with brown theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.brown.800}",
            $description:
              "Background color for brown tags. Creates a distinct surface with brown theme styling.",
          },
          name: "cn-component-tag-brown-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "brown",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "brown", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(3% 4.01 51.14)",
          $description:
            "Subtle background variation for brown tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.brown.950}",
            $description:
              "Subtle background variation for brown tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-brown-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "brown",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "brown", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(19.16% 20.96 58.49)",
          $description: "Border color for brown tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.brown.background}",
            $description: "Border color for brown tags.",
          },
          name: "cn-component-tag-brown-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "brown",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "brown", "border"],
        },
      },
      cyan: {
        text: {
          $type: "color",
          $value: "lch(90.24% 13.5 239.5)",
          $description:
            "Text color for cyan tags. Ensures readability while maintaining the cyan color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.100}",
            $description:
              "Text color for cyan tags. Ensures readability while maintaining the cyan color theme.",
          },
          name: "cn-component-tag-cyan-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "cyan",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "cyan", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(19.49% 23 261.5)",
          $description:
            "Background color for cyan tags. Creates a distinct surface with cyan theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.800}",
            $description:
              "Background color for cyan tags. Creates a distinct surface with cyan theme styling.",
          },
          name: "cn-component-tag-cyan-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "cyan",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "cyan", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(3.09% 7.5 268)",
          $description:
            "Subtle background variation for cyan tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.950}",
            $description:
              "Subtle background variation for cyan tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-cyan-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "cyan",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "cyan", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(19.49% 23 261.5)",
          $description: "Border color for cyan tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.cyan.background}",
            $description: "Border color for cyan tags.",
          },
          name: "cn-component-tag-cyan-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "cyan",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "cyan", "border"],
        },
      },
      green: {
        text: {
          $type: "color",
          $value: "lch(90.24% 13.5 239.5)",
          $description:
            "Text color for green tags, replaced with cyan for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.100}",
            $description:
              "Text color for green tags, replaced with cyan for tritanopia visibility.",
          },
          name: "cn-component-tag-green-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "green",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "green", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(19.49% 23 261.5)",
          $description:
            "Background color for green tags, replaced with cyan for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.800}",
            $description:
              "Background color for green tags, replaced with cyan for tritanopia visibility.",
          },
          name: "cn-component-tag-green-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "green",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "green", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(3.09% 7.5 268)",
          $description:
            "Subtle background variation for green tags, replaced with cyan for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.950}",
            $description:
              "Subtle background variation for green tags, replaced with cyan for tritanopia visibility.",
          },
          name: "cn-component-tag-green-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "green",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "green", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(19.49% 23 261.5)",
          $description: "Border color for green tags, replaced with cyan.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.green.background}",
            $description: "Border color for green tags, replaced with cyan.",
          },
          name: "cn-component-tag-green-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "green",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "green", "border"],
        },
      },
      indigo: {
        text: {
          $type: "color",
          $value: "lch(89.8% 14.62 283.7)",
          $description:
            "Text color for indigo tags. Ensures readability while maintaining the indigo color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.indigo.100}",
            $description:
              "Text color for indigo tags. Ensures readability while maintaining the indigo color theme.",
          },
          name: "cn-component-tag-indigo-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "indigo",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "indigo", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(14.93% 84.93 302.33)",
          $description:
            "Background color for indigo tags. Creates a distinct surface with indigo theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.indigo.800}",
            $description:
              "Background color for indigo tags. Creates a distinct surface with indigo theme styling.",
          },
          name: "cn-component-tag-indigo-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "indigo",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "indigo", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(2.17% 29.85 290.49)",
          $description:
            "Subtle background variation for indigo tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.indigo.950}",
            $description:
              "Subtle background variation for indigo tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-indigo-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "indigo",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "indigo", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(14.93% 84.93 302.33)",
          $description: "Border color for indigo tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.indigo.background}",
            $description: "Border color for indigo tags.",
          },
          name: "cn-component-tag-indigo-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "indigo",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "indigo", "border"],
        },
      },
      lime: {
        text: {
          $type: "color",
          $value: "lch(91.05% 29.33 126.46)",
          $description:
            "Text color for lime tags. Ensures readability while maintaining the lime color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.lime.100}",
            $description:
              "Text color for lime tags. Ensures readability while maintaining the lime color theme.",
          },
          name: "cn-component-tag-lime-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "lime",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "lime", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(19.97% 21.1 123.91)",
          $description:
            "Background color for lime tags. Creates a distinct surface with lime theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.lime.800}",
            $description:
              "Background color for lime tags. Creates a distinct surface with lime theme styling.",
          },
          name: "cn-component-tag-lime-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "lime",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "lime", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(3.2% 4.34 131.4)",
          $description:
            "Subtle background variation for lime tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.lime.950}",
            $description:
              "Subtle background variation for lime tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-lime-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "lime",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "lime", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(19.97% 21.1 123.91)",
          $description: "Border color for lime tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.lime.background}",
            $description: "Border color for lime tags.",
          },
          name: "cn-component-tag-lime-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "lime",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "lime", "border"],
        },
      },
      mint: {
        text: {
          $type: "color",
          $value: "lch(91.09% 25.48 176.08)",
          $description:
            "Text color for mint tags. Ensures readability while maintaining the mint color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.mint.100}",
            $description:
              "Text color for mint tags. Ensures readability while maintaining the mint color theme.",
          },
          name: "cn-component-tag-mint-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "mint",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "mint", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(20.24% 23.29 164.22)",
          $description:
            "Background color for mint tags. Creates a distinct surface with mint theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.mint.800}",
            $description:
              "Background color for mint tags. Creates a distinct surface with mint theme styling.",
          },
          name: "cn-component-tag-mint-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "mint",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "mint", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(3.26% 5.16 160.96)",
          $description:
            "Subtle background variation for mint tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.mint.950}",
            $description:
              "Subtle background variation for mint tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-mint-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "mint",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "mint", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(20.24% 23.29 164.22)",
          $description: "Border color for mint tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.mint.background}",
            $description: "Border color for mint tags.",
          },
          name: "cn-component-tag-mint-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "mint",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "mint", "border"],
        },
      },
      orange: {
        text: {
          $type: "color",
          $value: "lch(90.02% 17.62 61.56)",
          $description:
            "Text color for orange tags. Ensures readability while maintaining the orange color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.100}",
            $description:
              "Text color for orange tags. Ensures readability while maintaining the orange color theme.",
          },
          name: "cn-component-tag-orange-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "orange",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "orange", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(18.69% 35.31 45.59)",
          $description:
            "Background color for orange tags. Creates a distinct surface with orange theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.800}",
            $description:
              "Background color for orange tags. Creates a distinct surface with orange theme styling.",
          },
          name: "cn-component-tag-orange-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "orange",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "orange", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(2.93% 6.64 36.42)",
          $description:
            "Subtle background variation for orange tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.950}",
            $description:
              "Subtle background variation for orange tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-orange-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "orange",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "orange", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(18.69% 35.31 45.59)",
          $description: "Border color for orange tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.orange.background}",
            $description: "Border color for orange tags.",
          },
          name: "cn-component-tag-orange-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "orange",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "orange", "border"],
        },
      },
      pink: {
        text: {
          $type: "color",
          $value: "lch(89.61% 13.47 350.26)",
          $description:
            "Text color for pink tags. Ensures readability while maintaining the pink color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.pink.100}",
            $description:
              "Text color for pink tags. Ensures readability while maintaining the pink color theme.",
          },
          name: "cn-component-tag-pink-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "pink",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "pink", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(18.05% 31.95 349.99)",
          $description:
            "Background color for pink tags. Creates a distinct surface with pink theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.pink.800}",
            $description:
              "Background color for pink tags. Creates a distinct surface with pink theme styling.",
          },
          name: "cn-component-tag-pink-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "pink",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "pink", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(2.74% 8.62 350.99)",
          $description:
            "Subtle background variation for pink tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.pink.950}",
            $description:
              "Subtle background variation for pink tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-pink-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "pink",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "pink", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(18.05% 31.95 349.99)",
          $description: "Border color for pink tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.pink.background}",
            $description: "Border color for pink tags.",
          },
          name: "cn-component-tag-pink-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "pink",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "pink", "border"],
        },
      },
      purple: {
        text: {
          $type: "color",
          $value: "lch(90.24% 13.5 239.5)",
          $description:
            "Text color for purple tags, replaced with cyan for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.100}",
            $description:
              "Text color for purple tags, replaced with cyan for tritanopia visibility.",
          },
          name: "cn-component-tag-purple-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "purple",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "purple", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(19.49% 23 261.5)",
          $description:
            "Background color for purple tags, replaced with cyan for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.800}",
            $description:
              "Background color for purple tags, replaced with cyan for tritanopia visibility.",
          },
          name: "cn-component-tag-purple-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "purple",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "purple", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(3.09% 7.5 268)",
          $description:
            "Subtle background variation for purple tags, replaced with cyan for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.950}",
            $description:
              "Subtle background variation for purple tags, replaced with cyan for tritanopia visibility.",
          },
          name: "cn-component-tag-purple-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "purple",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "purple", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(19.49% 23 261.5)",
          $description: "Border color for purple tags, replaced with cyan.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.purple.background}",
            $description: "Border color for purple tags, replaced with cyan.",
          },
          name: "cn-component-tag-purple-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "purple",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "purple", "border"],
        },
      },
      red: {
        text: {
          $type: "color",
          $value: "lch(89.81% 13.4 32.67)",
          $description:
            "Text color for red tags. Ensures readability while maintaining the red color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.red.100}",
            $description:
              "Text color for red tags. Ensures readability while maintaining the red color theme.",
          },
          name: "cn-component-tag-red-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "red",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "red", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(18.31% 42.35 35.83)",
          $description:
            "Background color for red tags. Creates a distinct surface with red theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.red.800}",
            $description:
              "Background color for red tags. Creates a distinct surface with red theme styling.",
          },
          name: "cn-component-tag-red-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "red",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "red", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(2.8% 10.22 21.65)",
          $description:
            "Subtle background variation for red tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.red.950}",
            $description:
              "Subtle background variation for red tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-red-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "red",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "red", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(18.31% 42.35 35.83)",
          $description: "Border color for red tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.red.background}",
            $description: "Border color for red tags.",
          },
          name: "cn-component-tag-red-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "red",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "red", "border"],
        },
      },
      violet: {
        text: {
          $type: "color",
          $value: "lch(90.24% 13.5 239.5)",
          $description:
            "Text color for violet tags, replaced with cyan for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.100}",
            $description:
              "Text color for violet tags, replaced with cyan for tritanopia visibility.",
          },
          name: "cn-component-tag-violet-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "violet",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "violet", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(19.49% 23 261.5)",
          $description:
            "Background color for violet tags, replaced with cyan for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.800}",
            $description:
              "Background color for violet tags, replaced with cyan for tritanopia visibility.",
          },
          name: "cn-component-tag-violet-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "violet",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "violet", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(3.09% 7.5 268)",
          $description:
            "Subtle background variation for violet tags, replaced with cyan for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.cyan.950}",
            $description:
              "Subtle background variation for violet tags, replaced with cyan for tritanopia visibility.",
          },
          name: "cn-component-tag-violet-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "violet",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "violet", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(19.49% 23 261.5)",
          $description: "Border color for violet tags, replaced with cyan.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.violet.background}",
            $description: "Border color for violet tags, replaced with cyan.",
          },
          name: "cn-component-tag-violet-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "violet",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "violet", "border"],
        },
      },
      yellow: {
        text: {
          $type: "color",
          $value: "lch(90.02% 17.62 61.56)",
          $description:
            "Text color for yellow tags, replaced with orange for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.100}",
            $description:
              "Text color for yellow tags, replaced with orange for tritanopia visibility.",
          },
          name: "cn-component-tag-yellow-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "yellow",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "yellow", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(18.69% 35.31 45.59)",
          $description:
            "Background color for yellow tags, replaced with orange for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.800}",
            $description:
              "Background color for yellow tags, replaced with orange for tritanopia visibility.",
          },
          name: "cn-component-tag-yellow-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "yellow",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "yellow", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(2.93% 6.64 36.42)",
          $description:
            "Subtle background variation for yellow tags, replaced with orange for tritanopia visibility.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.950}",
            $description:
              "Subtle background variation for yellow tags, replaced with orange for tritanopia visibility.",
          },
          name: "cn-component-tag-yellow-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "yellow",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "yellow", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(18.69% 35.31 45.59)",
          $description: "Border color for yellow tags, replaced with orange.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.yellow.background}",
            $description: "Border color for yellow tags, replaced with orange.",
          },
          name: "cn-component-tag-yellow-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "yellow",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "yellow", "border"],
        },
      },
      gray: {
        text: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Text color for gray tags. Ensures readability while maintaining the gray color theme.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.200}",
            $description:
              "Text color for gray tags. Ensures readability while maintaining the gray color theme.",
          },
          name: "cn-component-tag-gray-text",
          attributes: {
            category: "component",
            type: "tag",
            item: "gray",
            subitem: "text",
            themeable: true,
          },
          path: ["component", "tag", "gray", "text"],
        },
        background: {
          $type: "color",
          $value: "lch(18.63% 6.73 287.29)",
          $description:
            "Background color for gray tags. Creates a distinct surface with gray theme styling.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.850}",
            $description:
              "Background color for gray tags. Creates a distinct surface with gray theme styling.",
          },
          name: "cn-component-tag-gray-background",
          attributes: {
            category: "component",
            type: "tag",
            item: "gray",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "tag", "gray", "background"],
        },
        "background-subtle": {
          $type: "color",
          $value: "lch(8.25% 4.49 287.18)",
          $description:
            "Subtle background variation for gray tags. Provides a softer alternative for less emphasis.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.chrome.900}",
            $description:
              "Subtle background variation for gray tags. Provides a softer alternative for less emphasis.",
          },
          name: "cn-component-tag-gray-background-subtle",
          attributes: {
            category: "component",
            type: "tag",
            item: "gray",
            subitem: "background-subtle",
            themeable: true,
          },
          path: ["component", "tag", "gray", "background-subtle"],
        },
        border: {
          $type: "color",
          $value: "lch(18.63% 6.73 287.29)",
          $description: "Border color for gray tags.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.tag.gray.background}",
            $description: "Border color for gray tags.",
          },
          name: "cn-component-tag-gray-border",
          attributes: {
            category: "component",
            type: "tag",
            item: "gray",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "tag", "gray", "border"],
        },
      },
    },
    toast: {
      default: {
        title: {
          $type: "color",
          $value: "lch(98.27% 0.36 135.2)",
          $description:
            "Title text color for informational toast notifications. Ensures high visibility for the notification headline.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.1}",
            $description:
              "Title text color for informational toast notifications. Ensures high visibility for the notification headline.",
          },
          name: "cn-component-toast-default-title",
          attributes: {
            category: "component",
            type: "toast",
            item: "default",
            subitem: "title",
            themeable: true,
          },
          path: ["component", "toast", "default", "title"],
        },
        description: {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          $description:
            "Description text color for informational toast notifications. Provides readable contrast for notification content.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{text.2}",
            $description:
              "Description text color for informational toast notifications. Provides readable contrast for notification content.",
          },
          name: "cn-component-toast-default-description",
          attributes: {
            category: "component",
            type: "toast",
            item: "default",
            subitem: "description",
            themeable: true,
          },
          path: ["component", "toast", "default", "description"],
        },
        background: {
          $type: "color",
          $value: "lch(5.2% 3.07 285.78)",
          $description:
            "Background color for informational toast notifications. Creates visual distinction from UI content beneath.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{background.3}",
            $description:
              "Background color for informational toast notifications. Creates visual distinction from UI content beneath.",
          },
          name: "cn-component-toast-default-background",
          attributes: {
            category: "component",
            type: "toast",
            item: "default",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "toast", "default", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
          $description:
            "Border color for informational toast notifications. Subtly defines the notification's boundaries.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{border.3}",
            $description:
              "Border color for informational toast notifications. Subtly defines the notification's boundaries.",
          },
          name: "cn-component-toast-default-border",
          attributes: {
            category: "component",
            type: "toast",
            item: "default",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "toast", "default", "border"],
        },
      },
      danger: {
        title: {
          $type: "color",
          $value: "lch(100% 0 134.54)",
          $description:
            "Title text color for danger toast notifications. Provides maximum contrast against the error background.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.pure.white}",
            $description:
              "Title text color for danger toast notifications. Provides maximum contrast against the error background.",
          },
          name: "cn-component-toast-danger-title",
          attributes: {
            category: "component",
            type: "toast",
            item: "danger",
            subitem: "title",
            themeable: true,
          },
          path: ["component", "toast", "danger", "title"],
        },
        description: {
          $type: "color",
          $value: "lch(100% 0 134.54)",
          $description:
            "Description text color for danger toast notifications. Ensures readability of critical information.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.pure.white}",
            $description:
              "Description text color for danger toast notifications. Ensures readability of critical information.",
          },
          name: "cn-component-toast-danger-description",
          attributes: {
            category: "component",
            type: "toast",
            item: "danger",
            subitem: "description",
            themeable: true,
          },
          path: ["component", "toast", "danger", "description"],
        },
        background: {
          $type: "color",
          $value: "lch(27.3% 54.82 37.68)",
          $description:
            "Background color for danger toast notifications. Creates high-visibility indication of errors or warnings.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.red.700}",
            $description:
              "Background color for danger toast notifications. Creates high-visibility indication of errors or warnings.",
          },
          name: "cn-component-toast-danger-background",
          attributes: {
            category: "component",
            type: "toast",
            item: "danger",
            subitem: "background",
            themeable: true,
          },
          path: ["component", "toast", "danger", "background"],
        },
        border: {
          $type: "color",
          $value: "lch(27.3% 54.82 37.68)",
          $description:
            "Border color for danger toast notifications. Reinforces the critical nature of the notification message.",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{component.toast.danger.background}",
            $description:
              "Border color for danger toast notifications. Reinforces the critical nature of the notification message.",
          },
          name: "cn-component-toast-danger-border",
          attributes: {
            category: "component",
            type: "toast",
            item: "danger",
            subitem: "border",
            themeable: true,
          },
          path: ["component", "toast", "danger", "border"],
        },
      },
    },
    tooltip: {
      text: {
        $type: "color",
        $value: "lch(81.33% 4.52 285.46)",
        $description:
          "Text color for tooltip content. Ensures readability of helpful contextual information.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{text.2}",
          $description:
            "Text color for tooltip content. Ensures readability of helpful contextual information.",
        },
        name: "cn-component-tooltip-text",
        attributes: {
          category: "component",
          type: "tooltip",
          item: "text",
          themeable: true,
        },
        path: ["component", "tooltip", "text"],
      },
      background: {
        $type: "color",
        $value: "lch(5.2% 3.07 285.78)",
        $description:
          "Background color for tooltips. Creates a distinct surface for contextual information that appears above UI elements.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{background.3}",
          $description:
            "Background color for tooltips. Creates a distinct surface for contextual information that appears above UI elements.",
        },
        name: "cn-component-tooltip-background",
        attributes: {
          category: "component",
          type: "tooltip",
          item: "background",
          themeable: true,
        },
        path: ["component", "tooltip", "background"],
      },
      border: {
        $type: "color",
        $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.7)",
        $description:
          "Border color for tooltips. Creates a distinct surface for contextual information that appears above UI elements.",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{border.3}",
          $description:
            "Border color for tooltips. Creates a distinct surface for contextual information that appears above UI elements.",
        },
        name: "cn-component-tooltip-border",
        attributes: {
          category: "component",
          type: "tooltip",
          item: "border",
          themeable: true,
        },
        path: ["component", "tooltip", "border"],
      },
    },
  },
  shadow: {
    0: {
      $type: "shadow",
      $value: "0 0 0 0 lch(from var(--cn-colors-pure-black) l c h / 0)",
      $description:
        "No shadow. \nCommon uses: Flat designs, disabled states, removing shadows on mobile.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "boxShadow",
        },
      },
      original: {
        $type: "shadow",
        $value: {
          blur: "0",
          spread: "0",
          color: "{shadow-color.0}",
          type: "dropShadow",
          offsetX: "0",
          offsetY: "0",
        },
        $description:
          "No shadow. \nCommon uses: Flat designs, disabled states, removing shadows on mobile.",
        $extensions: {
          "studio.tokens": {
            originalType: "boxShadow",
          },
        },
      },
      name: "cn-shadow-0",
      attributes: {
        category: "shadow",
        type: "0",
        themeable: true,
      },
      path: ["shadow", "0"],
    },
    1: {
      $type: "shadow",
      $value: "0 1px 2px 0 lch(from var(--cn-colors-pure-black) l c h / 0.6)",
      $description:
        "Small shadow. \nCommon uses: Buttons in their rest state, form inputs, subtle UI elements.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "boxShadow",
        },
      },
      original: {
        $type: "shadow",
        $value: {
          blur: "2",
          spread: "0",
          color: "{shadow-color.1}",
          type: "dropShadow",
          offsetX: "0",
          offsetY: "1",
        },
        $description:
          "Small shadow. \nCommon uses: Buttons in their rest state, form inputs, subtle UI elements.",
        $extensions: {
          "studio.tokens": {
            originalType: "boxShadow",
          },
        },
      },
      name: "cn-shadow-1",
      attributes: {
        category: "shadow",
        type: "1",
        themeable: true,
      },
      path: ["shadow", "1"],
    },
    2: {
      $type: "shadow",
      $value:
        "0 1px 3px 0 lch(from var(--cn-colors-pure-black) l c h / 0.6), 0 1px 2px -1px lch(from var(--cn-colors-pure-black) l c h / 0.6)",
      $description:
        "Default shadow. \nCommon uses: Cards, dropdowns, popovers in their default state.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "boxShadow",
        },
      },
      original: {
        $type: "shadow",
        $value: [
          {
            blur: "3",
            spread: "0",
            color: "{shadow-color.2}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "1",
          },
          {
            blur: "2",
            spread: "-1",
            color: "{shadow-color.2}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "1",
          },
        ],
        $description:
          "Default shadow. \nCommon uses: Cards, dropdowns, popovers in their default state.",
        $extensions: {
          "studio.tokens": {
            originalType: "boxShadow",
          },
        },
      },
      name: "cn-shadow-2",
      attributes: {
        category: "shadow",
        type: "2",
        themeable: true,
      },
      path: ["shadow", "2"],
    },
    3: {
      $type: "shadow",
      $value:
        "0 4px 6px -1px lch(from var(--cn-colors-pure-black) l c h / 0.5), 0 2px 4px -2px lch(from var(--cn-colors-pure-black) l c h / 0.5)",
      $description:
        "Medium shadow. \nCommon uses: Elevated cards, active buttons, interactive elements on hover.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "boxShadow",
        },
      },
      original: {
        $type: "shadow",
        $value: [
          {
            blur: "6",
            spread: "-1",
            color: "{shadow-color.3}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "4",
          },
          {
            blur: "4",
            spread: "-2",
            color: "{shadow-color.3}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "2",
          },
        ],
        $description:
          "Medium shadow. \nCommon uses: Elevated cards, active buttons, interactive elements on hover.",
        $extensions: {
          "studio.tokens": {
            originalType: "boxShadow",
          },
        },
      },
      name: "cn-shadow-3",
      attributes: {
        category: "shadow",
        type: "3",
        themeable: true,
      },
      path: ["shadow", "3"],
    },
    4: {
      $type: "shadow",
      $value:
        "0 10px 15px -3px lch(from var(--cn-colors-pure-black) l c h / 0.5), 0 4px 6px -4px lch(from var(--cn-colors-pure-black) l c h / 0.5)",
      $description:
        "Large shadow. \nCommon uses: Modals, floating panels, navigation dropdowns.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "boxShadow",
        },
      },
      original: {
        $type: "shadow",
        $value: [
          {
            blur: "15",
            spread: "-3",
            color: "{shadow-color.4}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "10",
          },
          {
            blur: "6",
            spread: "-4",
            color: "{shadow-color.4}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "4",
          },
        ],
        $description:
          "Large shadow. \nCommon uses: Modals, floating panels, navigation dropdowns.",
        $extensions: {
          "studio.tokens": {
            originalType: "boxShadow",
          },
        },
      },
      name: "cn-shadow-4",
      attributes: {
        category: "shadow",
        type: "4",
        themeable: true,
      },
      path: ["shadow", "4"],
    },
    5: {
      $type: "shadow",
      $value:
        "0 20px 25px -5px lch(from var(--cn-colors-pure-black) l c h / 0.5), 0 8px 10px -6px lch(from var(--cn-colors-pure-black) l c h / 0.5)",
      $description:
        "Extra large shadow. \nCommon uses: Large modals, sidebars, elevated content sections.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "boxShadow",
        },
      },
      original: {
        $type: "shadow",
        $value: [
          {
            blur: "25",
            spread: "-5",
            color: "{shadow-color.5}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "20",
          },
          {
            blur: "10",
            spread: "-6",
            color: "{shadow-color.5}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "8",
          },
        ],
        $description:
          "Extra large shadow. \nCommon uses: Large modals, sidebars, elevated content sections.",
        $extensions: {
          "studio.tokens": {
            originalType: "boxShadow",
          },
        },
      },
      name: "cn-shadow-5",
      attributes: {
        category: "shadow",
        type: "5",
        themeable: true,
      },
      path: ["shadow", "5"],
    },
    6: {
      $type: "shadow",
      $value:
        "0 25px 50px -12px lch(from var(--cn-colors-pure-black) l c h / 0.6)",
      $description:
        "Extra extra large shadow.\nCommon uses: This aggressive shadow is typically used sparingly in UI design, primarily for elements that need maximum visual emphasis and elevation.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "boxShadow",
        },
      },
      original: {
        $type: "shadow",
        $value: {
          blur: "50",
          spread: "-12",
          color: "{shadow-color.6}",
          type: "dropShadow",
          offsetX: "0",
          offsetY: "25",
        },
        $description:
          "Extra extra large shadow.\nCommon uses: This aggressive shadow is typically used sparingly in UI design, primarily for elements that need maximum visual emphasis and elevation.",
        $extensions: {
          "studio.tokens": {
            originalType: "boxShadow",
          },
        },
      },
      name: "cn-shadow-6",
      attributes: {
        category: "shadow",
        type: "6",
        themeable: true,
      },
      path: ["shadow", "6"],
    },
    inner: {
      $type: "shadow",
      $value:
        "inset 0 2px 4px 0 lch(from var(--cn-colors-pure-white) l c h / 0.1)",
      $description:
        "Inner shadow. \nCommon uses: Pressed buttons, selected states, inset form fields.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "boxShadow",
        },
      },
      original: {
        $type: "shadow",
        $value: {
          blur: "4",
          spread: "0",
          color: "{shadow-color.inner}",
          type: "innerShadow",
          offsetX: "0",
          offsetY: "2",
        },
        $description:
          "Inner shadow. \nCommon uses: Pressed buttons, selected states, inset form fields.",
        $extensions: {
          "studio.tokens": {
            originalType: "boxShadow",
          },
        },
      },
      name: "cn-shadow-inner",
      attributes: {
        category: "shadow",
        type: "inner",
        themeable: true,
      },
      path: ["shadow", "inner"],
    },
  },
  "shadow-color": {
    0: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-black) l c h / 0)",
      $description:
        "Transparent shadow color. Used when no shadow effect is desired.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.black}",
        $description:
          "Transparent shadow color. Used when no shadow effect is desired.",
      },
      name: "cn-shadow-color-0",
      attributes: {
        category: "shadow-color",
        type: "0",
        themeable: true,
      },
      path: ["shadow-color", "0"],
    },
    1: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.6",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-black) l c h / 0.6)",
      $description:
        "Light shadow color with 60% opacity. Creates subtle depth for small UI elements.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.6",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.black}",
        $description:
          "Light shadow color with 60% opacity. Creates subtle depth for small UI elements.",
      },
      name: "cn-shadow-color-1",
      attributes: {
        category: "shadow-color",
        type: "1",
        themeable: true,
      },
      path: ["shadow-color", "1"],
    },
    2: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.6",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-black) l c h / 0.6)",
      $description:
        "Medium shadow color with 60% opacity. Provides balanced depth for common UI components.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.6",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.black}",
        $description:
          "Medium shadow color with 60% opacity. Provides balanced depth for common UI components.",
      },
      name: "cn-shadow-color-2",
      attributes: {
        category: "shadow-color",
        type: "2",
        themeable: true,
      },
      path: ["shadow-color", "2"],
    },
    3: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.5",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-black) l c h / 0.5)",
      $description:
        "Medium shadow color with 50% opacity. Creates moderate depth for elevated components.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.5",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.black}",
        $description:
          "Medium shadow color with 50% opacity. Creates moderate depth for elevated components.",
      },
      name: "cn-shadow-color-3",
      attributes: {
        category: "shadow-color",
        type: "3",
        themeable: true,
      },
      path: ["shadow-color", "3"],
    },
    4: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.5",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-black) l c h / 0.5)",
      $description:
        "Deep shadow color with 50% opacity. Provides significant depth for floating elements.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.5",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.black}",
        $description:
          "Deep shadow color with 50% opacity. Provides significant depth for floating elements.",
      },
      name: "cn-shadow-color-4",
      attributes: {
        category: "shadow-color",
        type: "4",
        themeable: true,
      },
      path: ["shadow-color", "4"],
    },
    5: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.5",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-black) l c h / 0.5)",
      $description:
        "Very deep shadow color with 50% opacity. Creates dramatic elevation for modal content.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.5",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.black}",
        $description:
          "Very deep shadow color with 50% opacity. Creates dramatic elevation for modal content.",
      },
      name: "cn-shadow-color-5",
      attributes: {
        category: "shadow-color",
        type: "5",
        themeable: true,
      },
      path: ["shadow-color", "5"],
    },
    6: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.6",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-black) l c h / 0.6)",
      $description:
        "Extremely deep shadow color with 60% opacity. Provides maximum depth for highly elevated elements.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.6",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.black}",
        $description:
          "Extremely deep shadow color with 60% opacity. Provides maximum depth for highly elevated elements.",
      },
      name: "cn-shadow-color-6",
      attributes: {
        category: "shadow-color",
        type: "6",
        themeable: true,
      },
      path: ["shadow-color", "6"],
    },
    inner: {
      $extensions: {
        "studio.tokens": {
          modify: {
            type: "alpha",
            value: "0.1",
            space: "lch",
          },
        },
      },
      $type: "color",
      $value: "lch(from var(--cn-colors-pure-white) l c h / 0.1)",
      $description:
        "Subtle inner shadow color with 10% opacity. Creates inset effect for pressed or focused states.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      original: {
        $extensions: {
          "studio.tokens": {
            modify: {
              type: "alpha",
              value: "0.1",
              space: "lch",
            },
          },
        },
        $type: "color",
        $value: "{colors.pure.white}",
        $description:
          "Subtle inner shadow color with 10% opacity. Creates inset effect for pressed or focused states.",
      },
      name: "cn-shadow-color-inner",
      attributes: {
        category: "shadow-color",
        type: "inner",
        themeable: true,
      },
      path: ["shadow-color", "inner"],
    },
  },
  ring: {
    focus: {
      $type: "shadow",
      $value:
        "0 0 0 2px lch(2.44% 1.49 285.81), 0 0 0 4px lch(65.49% 45.28 239)",
      $description:
        "Focus ring effect with background offset and accent border.",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "boxShadow",
        },
      },
      original: {
        $type: "shadow",
        $value: [
          {
            blur: "0",
            spread: "2",
            color: "{background.1}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "0",
          },
          {
            blur: "0",
            spread: "4",
            color: "{border.focus}",
            type: "dropShadow",
            offsetX: "0",
            offsetY: "0",
          },
        ],
        $description:
          "Focus ring effect with background offset and accent border.",
        $extensions: {
          "studio.tokens": {
            originalType: "boxShadow",
          },
        },
      },
      name: "cn-ring-focus",
      attributes: {
        category: "ring",
        type: "focus",
        themeable: true,
      },
      path: ["ring", "focus"],
    },
  },
  gradient: {
    ai: {
      "gradient-stop-1": {
        $type: "color",
        $value: "lch(90.02% 17.62 61.56)",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.orange.100}",
        },
        name: "cn-gradient-ai-gradient-stop-1",
        attributes: {
          category: "gradient",
          type: "ai",
          item: "gradient-stop-1",
          themeable: true,
        },
        path: ["gradient", "ai", "gradient-stop-1"],
      },
      "gradient-stop-2": {
        $type: "color",
        $value: "lch(72% 46.72 350.11)",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.pink.200}",
        },
        name: "cn-gradient-ai-gradient-stop-2",
        attributes: {
          category: "gradient",
          type: "ai",
          item: "gradient-stop-2",
          themeable: true,
        },
        path: ["gradient", "ai", "gradient-stop-2"],
      },
      "gradient-stop-3": {
        $type: "color",
        $value: "lch(65.49% 45.28 239)",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.300}",
        },
        name: "cn-gradient-ai-gradient-stop-3",
        attributes: {
          category: "gradient",
          type: "ai",
          item: "gradient-stop-3",
          themeable: true,
        },
        path: ["gradient", "ai", "gradient-stop-3"],
      },
      "gradient-stop-4": {
        $type: "color",
        $value: "lch(74.15% 29 241)",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.200}",
        },
        name: "cn-gradient-ai-gradient-stop-4",
        attributes: {
          category: "gradient",
          type: "ai",
          item: "gradient-stop-4",
          themeable: true,
        },
        path: ["gradient", "ai", "gradient-stop-4"],
      },
    },
    skeleton: {
      "gradient-stop-1": {
        $type: "color",
        $value: "lch(18.63% 6.73 287.29)",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.850}",
        },
        name: "cn-gradient-skeleton-gradient-stop-1",
        attributes: {
          category: "gradient",
          type: "skeleton",
          item: "gradient-stop-1",
          themeable: true,
        },
        path: ["gradient", "skeleton", "gradient-stop-1"],
      },
      "gradient-stop-2": {
        $type: "color",
        $value: "lch(26.73% 7.48 287.06)",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.800}",
        },
        name: "cn-gradient-skeleton-gradient-stop-2",
        attributes: {
          category: "gradient",
          type: "skeleton",
          item: "gradient-stop-2",
          themeable: true,
        },
        path: ["gradient", "skeleton", "gradient-stop-2"],
      },
      "gradient-stop-3": {
        $type: "color",
        $value: "lch(18.63% 6.73 287.29)",
        filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.850}",
        },
        name: "cn-gradient-skeleton-gradient-stop-3",
        attributes: {
          category: "gradient",
          type: "skeleton",
          item: "gradient-stop-3",
          themeable: true,
        },
        path: ["gradient", "skeleton", "gradient-stop-3"],
      },
    },
    pipeline: {
      running: {
        "gradient-stop-1": {
          $type: "color",
          $value: "lch(74.82% 51.93 49.87)",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.200}",
          },
          name: "cn-gradient-pipeline-running-gradient-stop-1",
          attributes: {
            category: "gradient",
            type: "pipeline",
            item: "running",
            subitem: "gradient-stop-1",
            themeable: true,
          },
          path: ["gradient", "pipeline", "running", "gradient-stop-1"],
        },
        "gradient-stop-2": {
          $extensions: {
            "studio.tokens": {
              modify: {
                type: "alpha",
                value: "0.4",
                space: "lch",
              },
            },
          },
          $type: "color",
          $value: "lch(from var(--cn-colors-chrome-800) l c h / 0.4)",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $extensions: {
              "studio.tokens": {
                modify: {
                  type: "alpha",
                  value: "0.4",
                  space: "lch",
                },
              },
            },
            $type: "color",
            $value: "{colors.chrome.800}",
          },
          name: "cn-gradient-pipeline-running-gradient-stop-2",
          attributes: {
            category: "gradient",
            type: "pipeline",
            item: "running",
            subitem: "gradient-stop-2",
            themeable: true,
          },
          path: ["gradient", "pipeline", "running", "gradient-stop-2"],
        },
        "gradient-stop-3": {
          $type: "color",
          $value: "lch(74.82% 51.93 49.87)",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.orange.200}",
          },
          name: "cn-gradient-pipeline-running-gradient-stop-3",
          attributes: {
            category: "gradient",
            type: "pipeline",
            item: "running",
            subitem: "gradient-stop-3",
            themeable: true,
          },
          path: ["gradient", "pipeline", "running", "gradient-stop-3"],
        },
      },
      arrows: {
        "gradient-stop-1": {
          $type: "color",
          $value: "lch(100% 0 134.54)",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.pure.white}",
          },
          name: "cn-gradient-pipeline-arrows-gradient-stop-1",
          attributes: {
            category: "gradient",
            type: "pipeline",
            item: "arrows",
            subitem: "gradient-stop-1",
            themeable: true,
          },
          path: ["gradient", "pipeline", "arrows", "gradient-stop-1"],
        },
        "gradient-stop-2": {
          $type: "color",
          $value: "lch(63.4% 48.44 281.2)",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{colors.blue.300}",
          },
          name: "cn-gradient-pipeline-arrows-gradient-stop-2",
          attributes: {
            category: "gradient",
            type: "pipeline",
            item: "arrows",
            subitem: "gradient-stop-2",
            themeable: true,
          },
          path: ["gradient", "pipeline", "arrows", "gradient-stop-2"],
        },
        "gradient-stop-3": {
          $type: "color",
          $value: "lch(81.33% 4.52 285.46)",
          filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
          isSource: true,
          original: {
            $type: "color",
            $value: "{border.1}",
          },
          name: "cn-gradient-pipeline-arrows-gradient-stop-3",
          attributes: {
            category: "gradient",
            type: "pipeline",
            item: "arrows",
            subitem: "gradient-stop-3",
            themeable: true,
          },
          path: ["gradient", "pipeline", "arrows", "gradient-stop-3"],
        },
      },
      card: {
        background: {
          "gradient-from": {
            $type: "color",
            $value: "lch(18.63% 6.73 287.29)",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{colors.chrome.850}",
            },
            name: "cn-gradient-pipeline-card-background-gradient-from",
            attributes: {
              category: "gradient",
              type: "pipeline",
              item: "card",
              subitem: "background",
              state: "gradient-from",
              themeable: true,
            },
            path: [
              "gradient",
              "pipeline",
              "card",
              "background",
              "gradient-from",
            ],
          },
          "gradient-to": {
            $type: "color",
            $value: "lch(8.25% 4.49 287.18)",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{colors.chrome.900}",
            },
            name: "cn-gradient-pipeline-card-background-gradient-to",
            attributes: {
              category: "gradient",
              type: "pipeline",
              item: "card",
              subitem: "background",
              state: "gradient-to",
              themeable: true,
            },
            path: ["gradient", "pipeline", "card", "background", "gradient-to"],
          },
        },
        border: {
          "gradient-from": {
            $type: "color",
            $value: "lch(26.73% 7.48 287.06)",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{colors.chrome.800}",
            },
            name: "cn-gradient-pipeline-card-border-gradient-from",
            attributes: {
              category: "gradient",
              type: "pipeline",
              item: "card",
              subitem: "border",
              state: "gradient-from",
              themeable: true,
            },
            path: ["gradient", "pipeline", "card", "border", "gradient-from"],
          },
          "gradient-to": {
            $type: "color",
            $value: "lch(18.63% 6.73 287.29)",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{colors.chrome.850}",
            },
            name: "cn-gradient-pipeline-card-border-gradient-to",
            attributes: {
              category: "gradient",
              type: "pipeline",
              item: "card",
              subitem: "border",
              state: "gradient-to",
              themeable: true,
            },
            path: ["gradient", "pipeline", "card", "border", "gradient-to"],
          },
        },
      },
      widget: {
        number: {
          "gradient-from": {
            $type: "color",
            $value: "lch(81.33% 4.52 285.46)",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{colors.chrome.200}",
            },
            name: "cn-gradient-pipeline-widget-number-gradient-from",
            attributes: {
              category: "gradient",
              type: "pipeline",
              item: "widget",
              subitem: "number",
              state: "gradient-from",
              themeable: true,
            },
            path: ["gradient", "pipeline", "widget", "number", "gradient-from"],
          },
          "gradient-to": {
            $type: "color",
            $value: "lch(46.46% 7.5 286.37)",
            filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
            isSource: true,
            original: {
              $type: "color",
              $value: "{colors.chrome.600}",
            },
            name: "cn-gradient-pipeline-widget-number-gradient-to",
            attributes: {
              category: "gradient",
              type: "pipeline",
              item: "widget",
              subitem: "number",
              state: "gradient-to",
              themeable: true,
            },
            path: ["gradient", "pipeline", "widget", "number", "gradient-to"],
          },
        },
        blob: {
          big: {
            "gradient-from": {
              $type: "color",
              $value: "lch(18.63% 6.73 287.29)",
              filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
              isSource: true,
              original: {
                $type: "color",
                $value: "{colors.chrome.850}",
              },
              name: "cn-gradient-pipeline-widget-blob-big-gradient-from",
              attributes: {
                category: "gradient",
                type: "pipeline",
                item: "widget",
                subitem: "blob",
                state: "big",
                themeable: true,
              },
              path: [
                "gradient",
                "pipeline",
                "widget",
                "blob",
                "big",
                "gradient-from",
              ],
            },
            "gradient-to": {
              $type: "color",
              $value: "lch(5.2% 3.07 285.78)",
              filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
              isSource: true,
              original: {
                $type: "color",
                $value: "{colors.chrome.950}",
              },
              name: "cn-gradient-pipeline-widget-blob-big-gradient-to",
              attributes: {
                category: "gradient",
                type: "pipeline",
                item: "widget",
                subitem: "blob",
                state: "big",
                themeable: true,
              },
              path: [
                "gradient",
                "pipeline",
                "widget",
                "blob",
                "big",
                "gradient-to",
              ],
            },
          },
          small: {
            "gradient-from": {
              $type: "color",
              $value: "lch(26.73% 7.48 287.06)",
              filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
              isSource: true,
              original: {
                $type: "color",
                $value: "{colors.chrome.800}",
              },
              name: "cn-gradient-pipeline-widget-blob-small-gradient-from",
              attributes: {
                category: "gradient",
                type: "pipeline",
                item: "widget",
                subitem: "blob",
                state: "small",
                themeable: true,
              },
              path: [
                "gradient",
                "pipeline",
                "widget",
                "blob",
                "small",
                "gradient-from",
              ],
            },
            "gradient-to": {
              $type: "color",
              $value: "lch(18.63% 6.73 287.29)",
              filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
              isSource: true,
              original: {
                $type: "color",
                $value: "{colors.chrome.850}",
              },
              name: "cn-gradient-pipeline-widget-blob-small-gradient-to",
              attributes: {
                category: "gradient",
                type: "pipeline",
                item: "widget",
                subitem: "blob",
                state: "small",
                themeable: true,
              },
              path: [
                "gradient",
                "pipeline",
                "widget",
                "blob",
                "small",
                "gradient-to",
              ],
            },
          },
        },
      },
    },
  },
  iconStrokeWidth: {
    xxs: {
      $type: "dimension",
      $value: "1.1px",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "borderWidth",
        },
      },
      original: {
        $type: "dimension",
        $value: "1.1",
        $extensions: {
          "studio.tokens": {
            originalType: "borderWidth",
          },
        },
      },
      name: "cn-icon-stroke-width-xxs",
      attributes: {
        category: "iconStrokeWidth",
        type: "xxs",
        themeable: true,
      },
      path: ["iconStrokeWidth", "xxs"],
    },
    xs: {
      $type: "dimension",
      $value: "1px",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "borderWidth",
        },
      },
      original: {
        $type: "dimension",
        $value: "1",
        $extensions: {
          "studio.tokens": {
            originalType: "borderWidth",
          },
        },
      },
      name: "cn-icon-stroke-width-xs",
      attributes: {
        category: "iconStrokeWidth",
        type: "xs",
        themeable: true,
      },
      path: ["iconStrokeWidth", "xs"],
    },
    sm: {
      $type: "dimension",
      $value: "1.1px",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "borderWidth",
        },
      },
      original: {
        $type: "dimension",
        $value: "1.1",
        $extensions: {
          "studio.tokens": {
            originalType: "borderWidth",
          },
        },
      },
      name: "cn-icon-stroke-width-sm",
      attributes: {
        category: "iconStrokeWidth",
        type: "sm",
        themeable: true,
      },
      path: ["iconStrokeWidth", "sm"],
    },
    default: {
      $type: "dimension",
      $value: "1.1px",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "borderWidth",
        },
      },
      original: {
        $type: "dimension",
        $value: "1.1",
        $extensions: {
          "studio.tokens": {
            originalType: "borderWidth",
          },
        },
      },
      name: "cn-icon-stroke-width-default",
      attributes: {
        category: "iconStrokeWidth",
        type: "default",
        themeable: true,
      },
      path: ["iconStrokeWidth", "default"],
    },
    md: {
      $type: "dimension",
      $value: "1.4px",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "borderWidth",
        },
      },
      original: {
        $type: "dimension",
        $value: "1.4",
        $extensions: {
          "studio.tokens": {
            originalType: "borderWidth",
          },
        },
      },
      name: "cn-icon-stroke-width-md",
      attributes: {
        category: "iconStrokeWidth",
        type: "md",
        themeable: true,
      },
      path: ["iconStrokeWidth", "md"],
    },
    lg: {
      $type: "dimension",
      $value: "2px",
      filePath: "design-tokens/mode/dark/high-contrast-tritanopia.json",
      isSource: true,
      $extensions: {
        "studio.tokens": {
          originalType: "borderWidth",
        },
      },
      original: {
        $type: "dimension",
        $value: "2",
        $extensions: {
          "studio.tokens": {
            originalType: "borderWidth",
          },
        },
      },
      name: "cn-icon-stroke-width-lg",
      attributes: {
        category: "iconStrokeWidth",
        type: "lg",
        themeable: true,
      },
      path: ["iconStrokeWidth", "lg"],
    },
  },
  brand: {
    color: {
      50: {
        $type: "color",
        $value: "lch(95.4% 5 238.5)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.50}",
        },
        name: "cn-brand-color-50",
        attributes: {
          category: "brand",
          type: "color",
          item: "50",
          themeable: true,
        },
        path: ["brand", "color", "50"],
      },
      100: {
        $type: "color",
        $value: "lch(90.24% 13.5 239.5)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.100}",
        },
        name: "cn-brand-color-100",
        attributes: {
          category: "brand",
          type: "color",
          item: "100",
          themeable: true,
        },
        path: ["brand", "color", "100"],
      },
      200: {
        $type: "color",
        $value: "lch(74.15% 29 241)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.200}",
        },
        name: "cn-brand-color-200",
        attributes: {
          category: "brand",
          type: "color",
          item: "200",
          themeable: true,
        },
        path: ["brand", "color", "200"],
      },
      300: {
        $type: "color",
        $value: "lch(65.49% 45.28 239)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.300}",
        },
        name: "cn-brand-color-300",
        attributes: {
          category: "brand",
          type: "color",
          item: "300",
          themeable: true,
        },
        path: ["brand", "color", "300"],
      },
      400: {
        $type: "color",
        $value: "lch(56.15% 44.5 246.5)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.400}",
        },
        name: "cn-brand-color-400",
        attributes: {
          category: "brand",
          type: "color",
          item: "400",
          themeable: true,
        },
        path: ["brand", "color", "400"],
      },
      500: {
        $type: "color",
        $value: "lch(46.84% 41.5 250)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.500}",
        },
        name: "cn-brand-color-500",
        attributes: {
          category: "brand",
          type: "color",
          item: "500",
          themeable: true,
        },
        path: ["brand", "color", "500"],
      },
      600: {
        $type: "color",
        $value: "lch(37.53% 36.5 254)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.600}",
        },
        name: "cn-brand-color-600",
        attributes: {
          category: "brand",
          type: "color",
          item: "600",
          themeable: true,
        },
        path: ["brand", "color", "600"],
      },
      700: {
        $type: "color",
        $value: "lch(28.81% 30 257.5)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.700}",
        },
        name: "cn-brand-color-700",
        attributes: {
          category: "brand",
          type: "color",
          item: "700",
          themeable: true,
        },
        path: ["brand", "color", "700"],
      },
      800: {
        $type: "color",
        $value: "lch(19.49% 23 261.5)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.800}",
        },
        name: "cn-brand-color-800",
        attributes: {
          category: "brand",
          type: "color",
          item: "800",
          themeable: true,
        },
        path: ["brand", "color", "800"],
      },
      900: {
        $type: "color",
        $value: "lch(10.76% 15.5 265)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.900}",
        },
        name: "cn-brand-color-900",
        attributes: {
          category: "brand",
          type: "color",
          item: "900",
          themeable: true,
        },
        path: ["brand", "color", "900"],
      },
      950: {
        $type: "color",
        $value: "lch(3.09% 7.5 268)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.cyan.950}",
        },
        name: "cn-brand-color-950",
        attributes: {
          category: "brand",
          type: "color",
          item: "950",
          themeable: true,
        },
        path: ["brand", "color", "950"],
      },
    },
    onColor: {
      50: {
        $type: "color",
        $value: "lch(5.2% 3.07 285.78)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.950}",
        },
        name: "cn-brand-on-color-50",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "50",
          themeable: true,
        },
        path: ["brand", "onColor", "50"],
      },
      100: {
        $type: "color",
        $value: "lch(5.2% 3.07 285.78)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.950}",
        },
        name: "cn-brand-on-color-100",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "100",
          themeable: true,
        },
        path: ["brand", "onColor", "100"],
      },
      200: {
        $type: "color",
        $value: "lch(5.2% 3.07 285.78)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.950}",
        },
        name: "cn-brand-on-color-200",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "200",
          themeable: true,
        },
        path: ["brand", "onColor", "200"],
      },
      300: {
        $type: "color",
        $value: "lch(5.2% 3.07 285.78)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.950}",
        },
        name: "cn-brand-on-color-300",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "300",
          themeable: true,
        },
        path: ["brand", "onColor", "300"],
      },
      400: {
        $type: "color",
        $value: "lch(5.2% 3.07 285.78)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.chrome.950}",
        },
        name: "cn-brand-on-color-400",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "400",
          themeable: true,
        },
        path: ["brand", "onColor", "400"],
      },
      500: {
        $type: "color",
        $value: "lch(100% 0 134.54)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.pure.white}",
        },
        name: "cn-brand-on-color-500",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "500",
          themeable: true,
        },
        path: ["brand", "onColor", "500"],
      },
      600: {
        $type: "color",
        $value: "lch(100% 0 134.54)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.pure.white}",
        },
        name: "cn-brand-on-color-600",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "600",
          themeable: true,
        },
        path: ["brand", "onColor", "600"],
      },
      700: {
        $type: "color",
        $value: "lch(100% 0 134.54)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.pure.white}",
        },
        name: "cn-brand-on-color-700",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "700",
          themeable: true,
        },
        path: ["brand", "onColor", "700"],
      },
      800: {
        $type: "color",
        $value: "lch(100% 0 134.54)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.pure.white}",
        },
        name: "cn-brand-on-color-800",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "800",
          themeable: true,
        },
        path: ["brand", "onColor", "800"],
      },
      900: {
        $type: "color",
        $value: "lch(100% 0 134.54)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.pure.white}",
        },
        name: "cn-brand-on-color-900",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "900",
          themeable: true,
        },
        path: ["brand", "onColor", "900"],
      },
      950: {
        $type: "color",
        $value: "lch(100% 0 134.54)",
        filePath: "design-tokens/brand/Harness.json",
        isSource: true,
        original: {
          $type: "color",
          $value: "{colors.pure.white}",
        },
        name: "cn-brand-on-color-950",
        attributes: {
          category: "brand",
          type: "onColor",
          item: "950",
          themeable: true,
        },
        path: ["brand", "onColor", "950"],
      },
    },
  },
};
