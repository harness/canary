# UUI-3038 — Removed Type Tokens

Cleanup of type/typography tokens confirmed unused in **both** Canary and Platform UI
(verified via Canary grep + Harness Code search of platformUI before removal).

- **Commit:** `82a75dba7` — `chore: [UUI-3038]: Removal of unused tokens`
- **Files touched:**
  - `packages/core-design-system/design-tokens/core/typography.json`
  - `packages/core-design-system/design-tokens/breakpoint/desktop.json`
- **Not a remap:** nothing was repointed — these tokens had no surviving references.
- **Separate workstream** from the `set/*/outline/text → secondary` consolidation (UUI-3063).

> `$themes.json` (Tokens Studio Figma-sync map) was intentionally **not** hand-edited —
> regenerate via Tokens Studio sync.

---

## fontWeight (`core/typography.json`)

| Token                           | Value           | Notes                             |
| ------------------------------- | --------------- | --------------------------------- |
| `fontWeight.default.normal.100` | Thin            |                                   |
| `fontWeight.default.normal.200` | ExtraLight      |                                   |
| `fontWeight.default.normal.800` | ExtraBold       |                                   |
| `fontWeight.default.normal.900` | Black           |                                   |
| `fontWeight.default.italic.*`   | 100–900 (all 9) | entire italic branch removed      |
| `fontWeight.mono.normal.100`    | Thin            |                                   |
| `fontWeight.mono.normal.200`    | ExtraLight      |                                   |
| `fontWeight.mono.normal.800`    | ExtraBold       |                                   |
| `fontWeight.mono.italic.*`      | 100–800 (all 8) | entire mono italic branch removed |

_Kept: default/mono normal 300, 400, 500, 600, 700._

## fontSize (`core/typography.json`)

| Token         | Value          |
| ------------- | -------------- |
| `fontSize.13` | 3.75rem (60px) |
| `fontSize.14` | 4.5rem (72px)  |
| `fontSize.16` | 8rem (128px)   |

_Kept: 15 (96px). 11/12 still in use → deferred to UUI-2492._

## tracking / letterSpacing (`core/typography.json`)

| Token             | Value | Notes           |
| ----------------- | ----- | --------------- |
| `tracking.widest` | 0.1em | "All caps text" |

_Kept: `tracking.tighter` / `tracking.wider` still in use → deferred to UUI-2492._

## textCase (`core/typography.json`)

| Token                 | Value      |
| --------------------- | ---------- |
| `textCase.lowercase`  | lowercase  |
| `textCase.capitalize` | capitalize |

## Composite typography styles (`breakpoint/desktop.json`)

| Token                         | Notes                 |
| ----------------------------- | --------------------- |
| `body.normal-line-through`    | strikethrough body    |
| `comp.link.default-underline` | underlined link       |
| `comp.link.sm-underline`      | small underlined link |
| `comp.markdown.content.lead`  | lead paragraph        |

## lineHeight — 75 matrix cells across 17 sizes (`core/typography.json`)

Each size has up to 6 variants (`none / tight / snug / normal / relaxed / loose`).
Removed per size:

| Size      | Variants removed                    | Count  | Kept                                    |
| --------- | ----------------------------------- | ------ | --------------------------------------- |
| 0         | all                                 | 6      | —                                       |
| 1         | tight, snug, normal, relaxed, loose | 5      | none                                    |
| 2         | none, tight, snug, relaxed, loose   | 5      | normal                                  |
| 3         | tight, normal, relaxed, loose       | 4      | none, snug                              |
| 4         | tight, relaxed, loose               | 3      | none, snug, normal                      |
| 5         | none, loose                         | 2      | tight, snug, normal, relaxed            |
| 6         | loose                               | 1      | none, tight, snug, normal, relaxed      |
| 7         | none, normal, relaxed, loose        | 4      | tight, snug                             |
| 8         | snug, relaxed, loose                | 3      | none, tight, normal                     |
| 9         | none, tight, relaxed, loose         | 4      | snug, normal                            |
| 10        | normal, relaxed, loose              | 3      | none, tight, snug                       |
| 11        | all                                 | 6      | —                                       |
| 12        | all                                 | 6      | —                                       |
| 13        | all                                 | 6      | —                                       |
| 14        | all                                 | 6      | —                                       |
| 15        | tight, snug, normal, relaxed, loose | 5      | none                                    |
| 16        | all                                 | 6      | —                                       |
| **Total** |                                     | **75** | (27 cells + `multiplier` keys retained) |

---

## Totals

| Category         | Removed |
| ---------------- | ------- |
| lineHeight cells | 75      |
| fontWeight       | 21      |
| fontSize         | 3       |
| tracking         | 1       |
| textCase         | 2       |
| composite styles | 4       |
