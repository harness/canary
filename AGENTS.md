# Canary — Agent Guide

## Delivery and investigation guardrails

- Start with the user-visible outcome, the smallest useful deliverable and a concrete done condition. Preparation artifacts alone are not delivery unless the user requested them.
- Default to no more than 10 minutes of initial investigation before making a useful change or stating the specific blocker. This is a reassessment checkpoint, not permission to skip necessary verification.
- At each 15-minute checkpoint during sustained work, assess what usable result exists and whether the current investigation still serves the outcome. Narrow or abandon low-value branches autonomously. Do not make the user manage routine scope decisions.
- Reuse existing instructions, examples, scripts and evidence. Read documentation on demand; do not load entire documentation trees or benchmark archives for ordinary implementation tasks.
- Run checks appropriate to the change and required repository checks. After they pass, repeat or broaden verification only for a new change, failure or concrete unresolved risk. Do not build a validation framework for a small documentation change.
- Do not start another benchmark, reference-freezing cycle, MCP server, CLI or documentation hierarchy by default. State the decision it would unlock and why existing tools cannot answer it; obtain scope authorization before substantial additional work.
- Keep incidental findings separate from the requested deliverable. Record unrelated defects as follow-ups instead of letting them block adoption. Preserve explicitly agreed acceptance standards; never silently waive defects to declare success.
- Report delivered changes, verification, remaining blockers and measured outcomes. Label hypotheses and unknown costs. Never claim speed, token or accuracy improvements without supporting measurements.
- These checkpoints are not requests for repeated approval. Continue authorized work independently; ask only for a material scope change or a decision that requires the user's judgment.

PNPM monorepo containing shared component libraries and packages for the Harness Unified UI. Consumed primarily by `frontend/platformUI`.

## Tech Stack

- **Language**: TypeScript
- **Package manager**: PNPM (monorepo)
- **Build**: Vite
- **Styling**: Tailwind CSS
- **React constraint**: All packages must support React 17

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@harnessio/ui` | `packages/ui/` | Main component library (Radix UI + ShadCN + Tailwind) |
| `@harnessio/ai-chat-core` | `packages/ai-chat-core/` | Framework-agnostic AI chat state machine |
| `@harnessio/filters` | `packages/filters/` | Filter/search components |
| `@harnessio/forms` | `packages/forms/` | React Hook Form + Zod/Yup form primitives |
| `@harnessio/pipeline-graph` | `packages/pipeline-graph/` | Pipeline visualization graph |
| `@harnessio/yaml-editor` | `packages/yaml-editor/` | Monaco-based YAML editor |
| `@harnessio/core-design-system` | `packages/core-design-system/` | Design tokens and themes (style-dictionary) |

## Common Commands

```bash
pnpm install          # Install all dependencies
pnpm build            # Build all packages
pnpm lint             # Lint all packages
pnpm typecheck        # Type-check all packages
pnpm test             # Run tests across all packages
pnpm clean            # Remove all dist/ and node_modules/
```

## Package-Level Docs

Packages with detailed agent guides:

- [`packages/ai-chat-core/AGENTS.md`](packages/ai-chat-core/AGENTS.md) — AI chat runtime: stream protocol, plugins, capabilities, React hooks
- [`packages/filters/AGENTS.md`](packages/filters/AGENTS.md) — URL-driven filter state: parsers, router integration, saved filters
