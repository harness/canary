# UUI-3063 — `set/*/outline/text` → `secondary/text` Consolidation

Removes the per-color **outline** _text_ color from the `set/*` design tokens and routes
everything to `set/*/secondary/text`. The outline _surface_ stays — only `outline/text`
is removed; `outline/bg` and `outline/border` are kept.

- **Branch:** `feat/UUI-3063-Set-Text-Color-Cosolidation`
- **Source of truth:** `packages/core-design-system/design-tokens/mode/**/*.json`
  (24 mode files — light/dark × default/dimmer/high-contrast × color-vision variants)
- **CSS var pattern:** `--cn-set-<color>-outline-text`
- **Tailwind classes:** `text-cn-<color>-outline` (via `packages/ui/tailwind-design-system.ts`)
- **Separate workstream** from the UUI-3038 unused type-token removal.

> Values below are for `light/default`; the other 23 modes follow the same structure.

> **Not a pure rename.** For 13 of 15 colors, `outline.text` was the **-700** shade and
> `secondary.text` is **-800**, so text lands one step darker after migration. Anything
> still using `text-cn-<color>-outline` or `--cn-set-<color>-outline-text` will render
> slightly darker — expected, but a real visual diff to watch in review.

---

## `set/*/outline/text` removed → merged into `secondary/text`

15 removed, `ai` kept.

| Color        | outline.text (old) | → secondary.text (new)   | Visual change?         |
| ------------ | ------------------ | ------------------------ | ---------------------- |
| blue         | blue.700           | blue.800                 | darker                 |
| brown        | brown.700          | brown.800                | darker                 |
| cyan         | cyan.700           | cyan.800                 | darker                 |
| danger       | red.700            | red.800                  | darker                 |
| forest-green | forest.700         | forest.800               | darker                 |
| gray         | gray.850           | pure.black               | darker                 |
| indigo       | indigo.700         | indigo.800               | darker                 |
| mint         | mint.700           | mint.800                 | darker                 |
| orange       | orange.700         | orange.800               | darker                 |
| pink         | pink.700           | pink.800                 | darker                 |
| purple       | purple.700         | purple.800               | darker                 |
| success      | lime.700           | lime.800                 | darker                 |
| warning      | yellow.700         | yellow.800               | darker                 |
| brand        | indigo.800         | indigo.800               | none (identical)       |
| violet       | violet.800         | violet.800               | none (identical)       |
| **ai**       | pure.black         | _(no secondary variant)_ | **KEPT — not removed** |

`set.ai.outline.text` is deliberately retained — `ai` has no `secondary` variant and its
use case is special. Not an open question.

## Consumer tokens repointed (`outline.text` → `secondary.text`)

13 tokens.

| Token                           | Repointed via |
| ------------------------------- | ------------- |
| `text.success`                  | set.success   |
| `text.danger`                   | set.danger    |
| `text.warning`                  | set.warning   |
| `text.merged`                   | set.purple    |
| `comp.diff.hljs-keyword`        | set.purple    |
| `comp.diff.hljs-title-class`    | set.warning   |
| `comp.diff.hljs-string`         | set.success   |
| `comp.diff.hljs-title-function` | set.blue      |
| `comp.diff.hljs-name`           | set.danger    |
| `comp.diff.hljs-literal`        | set.cyan      |
| `comp.diff.hljs-attr`           | set.orange    |
| `comp.monaco.constant`          | set.orange    |
| `comp.monaco.invalid-text`      | set.warning   |

## Downstream

- **platformUI** consumes `@harnessio/ui` as published/versioned npm packages (not a live
  link), so removal only breaks it on version upgrade — migrate platformUI's `text-cn-*-outline`
  - var usages and coordinate with the version bump.
- Figma variables are synced via Tokens Studio; `$themes.json` is not hand-edited.
