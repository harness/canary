# Code Connect Handoff Trial — Results

**Question:** Does Code Connect change what an AI agent builds from a Figma design?

**Method:** 2×2 ablation, 5 runs per arm (20 total), Figma MCP `get_design_context`
on the CounterBadge node (`1782:29559`). Switch = `disableCodeConnect`. Task:
build a notification badge from the Figma node. **Scoring: the generated `.tsx`
file was parsed** for a real `@harnessio/ui` import + `<CounterBadge>` usage — not
agent self-report.

| Arm | Correct (used CounterBadge) | Failure mode |
|-----|------|------|
| Pure handoff (Figma only) · Code Connect ON  | **5/5** | — |
| Pure handoff (Figma only) · Code Connect OFF | **0/5** | hand-rolled div/span, raw Tailwind + hardcoded hex |
| Repo access · Code Connect ON  | 5/5 | — |
| Repo access · Code Connect OFF | 5/5 | found CounterBadge by reading source |

## Findings

1. **On the design→code handoff path, Code Connect is decisive: 0/5 → 5/5.**
   With no code to read, it is the only thing that routes the agent to the real
   component. Without it, every agent rebuilt a bespoke badge with raw hex — the
   exact design-system drift the audit flagged. *Confidence: high.*

2. **With repo access, Code Connect adds nothing measurable: 5/5 either way.**
   Reading source substitutes for it. *Confidence: high.*

## Interpretation

Code Connect's value is precisely the gap our documentation trials exposed:
agents ignore docs because they read code — but in the Figma-handoff scenario
there is no code to read, and that is exactly where Code Connect goes from
irrelevant to decisive. **Its ROI scales with how much generation happens from
Figma frames without repo context** (designers prototyping, design-scoped agents,
early handoff).

Caveats: one component, one model family, n=5 per arm. Directional and clean, not
a population estimate.

---

## Follow-up: Kitchen-sink context trial

**Question:** Does prototyping *inside kitchen sink* (platformUI context) reach
fidelity on its own — i.e. is the free, existing path as good as Code Connect?

**Method:** Same Figma node + task, agents building INSIDE
`platformUI/apps/kitchen-sink` (real app, `@harnessio/ui` installed, real usage
files). 2 arms × 5 runs, file-parsed scoring. Opus 4.8.

| Arm | Used CounterBadge |
|-----|-------------------|
| Kitchen sink · Code Connect OFF | **5/5** |
| Kitchen sink · Code Connect ON  | **5/5** |

**Finding:** Kitchen-sink context alone reaches full fidelity (5/5) — the real
component, on-brand, zero raw values — with no Code Connect. Code Connect adds
nothing measurable on top of repo context. This confirms the 2×2's repo-access
row directly, in the actual prototyping environment, and establishes kitchen sink
as the primary, already-built fidelity path. Code Connect's remaining value is the
no-repo segment (Figma-only, won't clone) and first-try handoff speed — not
fidelity for kitchen-sink users.

Caveat: n=5/arm, one component (CounterBadge), Opus 4.8. Directional and clean.
