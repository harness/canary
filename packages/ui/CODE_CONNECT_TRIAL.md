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
