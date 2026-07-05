# Presentation Brief — Canary AI-Readiness

Paste this whole file into Claude / a slide generator. It's the finalized deck:
~15 slides (numbered 1, 1a, 2–9, 9a, 9b, 10–12) + a Q&A backup. Each slide has
**content** and a **visual** spec — build the visual, don't just bullet the text.
Slide order is the presentation order.

---

## Meta (for the generator)

- **Title:** Prototypes That Actually Look Like Harness. What It Takes to Get There with AI.
- **Audience:** Exec + design/eng leadership. Mixed technical depth.
- **Tone:** Direct, evidence-led, no hype. Confidence levels stated, not buried.
- **Voice:** "I" for decisions and judgment (the goal, the observation, building the harness, the pivots, the reframe). Results stated in the work's own voice ("the data showed," "0/5 → 5/5"). "We" for the team asks. Establish authorship once on slide 1, then let substance carry it.
- **Narrative spine:** the GOAL (PMs & designers turn Figma into prototypes that look like real Harness, with AI) → the GAP I hit (in-context = great, out-of-context = imitations; access is NOT the cause) → what the data shows causes it (repo context, not the package) → what closes it (route through kitchen sink, which already provides that context; Code Connect as accelerant). Every slide serves that north star — keep it visible.
- **Two payoffs, one lever:** fidelity AND token-efficiency move together. Handing an agent the real component = accurate + cheap; making it reconstruct from pixels = imitation + expensive. Don't treat cost as a separate axis; it's the co-payoff of the same fix.
- **Design:** Clean, data-forward. Neutral palette; ONE accent color, used only for key numbers and the expected-vs-found contrast. Green = correct/used-our-component, red = wrong/hand-rolled/imitation — use consistently on slides 6, 7, 9, 9a.
- **Visual-heavy:** every slide gets a diagram, chart, grid, or before/after. No text-only slides.
- **Never-strip rule:** the confidence caveats on slides 4, 6, 9, 9a, 11 must survive the design pass. In an exec room they are what makes the claims credible.

---

## Slide 1 — Title

**Content:**
- Title: Prototypes That Actually Look Like Harness. What It Takes to Get There with AI.
- Subtitle: Why PM/designer prototypes come out as imitations — and why the fix is mostly something we already built.
- Footer: Investigation & implementation: [Your name] · [date] · Design Systems

**Visual:** Full-bleed title. Background motif: two badge mockups side by side —
one crisp/on-brand, one slightly-off "imitation" — foreshadowing the fidelity gap.

---

## Slide 1a — The goal (open here)

**Content:**
- Headline: The goal: PMs and designers turn Figma designs into prototypes that actually look like Harness — with AI, no eng handoff
- Prototyping is how product decisions get made. If prototypes don't look like the real platform, they mislead — and reworking them wastes cycles
- The catch I hit myself: **prototyping inside platformUI (which consumes Canary) → results are great. The same design built with Figma MCP outside that context → an imitation** — right idea, off-brand execution
- Not an access problem: PMs *can* install `@harnessio/ui` — results are still mixed. **The differentiator is the repo context, not the package.**
- That gap is the whole problem. This deck: why it happens, and the cheapest way to close it.

**Visual:** Two-panel "same design, two workflows" comparison:
```
   IN platformUI CONTEXT               BARE / OUT-OF-CONTEXT
   ┌───────────────────────┐          ┌───────────────────────┐
   │  ✅ real components     │          │  ❌ imitation           │
   │  ✅ on-brand tokens     │          │  ❌ off-spec, raw colors │
   │  ✅ cheap (1 import)    │          │  ❌ expensive (rebuilt)  │
   └───────────────────────┘          └───────────────────────┘
   (package installed in BOTH — context is what differs)
```
Speaker note: This isn't hypothetical — it's my own workflow, and PMs report the
same. The rest of the deck shows this split is measurable and fixable, and that
the fix is mostly something we already have.

---

## Slide 2 — So I audited what agents can actually see

**Content:**
- Headline: To find the cause, I audited how legible Canary is to an AI agent
- Canary — 118 components, our tokens, the library our apps depend on
- An AI agent is a new hire who's never seen our code — what can it discover, and does it build correctly?
- Audited five areas and scored each

**Visual:** Scorecard as a 5-bar rating strip (filled squares out of 5):
```
Token architecture   ■■■■□  4/5
Machine-legibility    ■■□□□  2/5
Design↔code drift     ■■□□□  2/5
Documentation         ■■□□□  2/5
Governance            ■■■□□  3/5
```

---

## Slide 3 — The hypothesis

**Content:**
- Headline: I went in expecting a documentation problem
- The intuitive story: 118 components, no agent guide for the main library, a stale design doc → agents must be lost
- So I did the obvious thing first: wrote the missing agent guide (`AGENTS.md`) — the fix everyone assumes
- Expected fix: better docs for agents

**Visual:** A big labeled arrow / hypothesis card:
```
   HYPOTHESIS
   ┌─────────────────────────────┐
   │  Agents fail →              │
   │  because docs are thin →    │
   │  so the fix is better docs  │
   └─────────────────────────────┘
```
Speaker note: I didn't theorize the fix — I built it, then tested whether it worked.

---

## Slide 4 — What the data said

**Content:**
- Headline: Agents read our docs — but they build from our code. When the two disagree, code wins.
- Tested directly: same build task, with our docs vs. docs stripped. Agents *did* read the docs (logged reading them early) — the output barely changed either way
- In one trial the agent read a stale guide, noted "this looks out of date," then overrode it with the real code and built correctly
- Even the agent guide I wrote, measured head-to-head: it **halves discovery time** (speed), but doesn't change what gets built (correctness)
- Confidence tag: Strong signal, not proof — 4 trials, small samples, one model family

**Visual:** Split card, HYPOTHESIS (struck through) vs. FINDING:
```
   EXPECTED                    FOUND
   "The fix is docs"    →      "Agents read docs, but BUILD from code.
   (struck through)            Code is the stronger signal —
                               docs only move the output where code is silent."
```
Speaker note: The guide isn't wasted — it's read, and it speeds orientation for
agents and new hires. It just isn't the *correctness* lever. And this sets up the
whole story: the imitation problem happens exactly where there's no code to read.

---

## Slide 5 — How I tested it

**Content:**
- Headline: I built an A/B harness — like A/B testing a UI, but for a design-system change
- Give an agent a real task ("build an integrations panel with our library")
- Run it twice: with the change, without. Compare the code it ships.
- Repeatable → it becomes the regression test for any future change

**Visual:** Simple flow diagram:
```
  Real build task
        │
   ┌────┴────┐
   ▼         ▼
 WITH      WITHOUT      ──►  compare generated code  ──►  did the change matter?
 change    change
```
Speaker note: This harness is the reusable asset — returns on slide 10.

---

## Slide 6 — The evidence [DATA VISUAL]

**Content:**
- Headline: Four trials, 24 build runs — docs changed the outcome in only one
- 3 of 4 trials: no measurable difference, docs vs. no docs
- 1 trial moved — and only because the doc was actively *wrong*
- Caption: The lesson isn't "docs don't matter." It's "docs matter only where they're wrong."

**Visual:** 4-row trial chart. Three flat "no change" bars, one with a jump:
```
  Trial 1 (docs vs none)      ▓▓▓▓▓  =  ▓▓▓▓▓   no change
  Trial 2 (boundary docs)     ▓▓▓▓▓  =  ▓▓▓▓▓   no change
  Trial 3 (filters doc)       ▓▓▓▓▓  =  ▓▓▓▓▓   no change
  Trial 4 (WRONG doc fixed)   ▓▓░░░ →  ▓▓▓▓▓   1/3 → 3/3  ◄ accent color
```

---

## Slide 7 — The crystal-clear example

**Content:**
- Headline: Our design doc described a component that doesn't exist — and it made agents build the wrong thing
- Our DESIGN.md pointed agents to a `Badge` component at `packages/ui/src/components/badge.tsx`
- **That file does not exist.** The real components are three: `Tag` (labels), `StatusBadge` (status), `CounterBadge` (counts)
- Asked an agent to build a panel with a count → it used `Text`, the wrong component, because the doc blurred the three together
- Fixed the doc, re-ran the test: **wrong 2 of 3 → correct 3 of 3**
- Callout: A wrong doc is worse than no doc — an agent copies a stated fact verbatim

**Visual:** Before/after, red→green:
```
  DOC SAID (❌)                      REALITY (✅)
  Badge → badge.tsx                  Tag         → labels
  (one component)                    StatusBadge → status
                                     CounterBadge→ counts
  Agent built: <Text>42</Text>  →   Agent built: <CounterBadge>42</CounterBadge>
```

---

## Slide 8 — What I did about it [3-part visual]

**Content:**
- Headline: I changed the plan three times, each time because the data said to
- 1. **Stopped** writing new how-to docs → measured zero effect; upkeep for no return
- 2. **Hunted docs that state false things** → the real bug source. Found & fixed:
  - a doc listing button styles (`solid`, `surface`) that don't exist
  - a package guide calling itself "no UI included" while it ships 4 UI components
  - a color token `cn-set-lime` used in docs — the real name is `cn-set-forest-green`
- 3. **Built Figma→code binding (Code Connect)** → for the one gap docs can't fill

**Visual:** 3 columns, each with an icon and a one-line verb: STOP (docs) · FIX (wrong facts) · BUILD (Code Connect). Use the accent color only on "FIX" and "BUILD".

---

## Slide 9 — Code Connect: the outcome [PROOF SLIDE]

**Content:**
- Headline: When an agent starts from a Figma design, Code Connect is the difference between right and rebuilt-from-scratch
- Tested directly: agent builds a badge from a Figma frame, Code Connect on vs. off, 20 runs, scored by reading the actual generated file
- **Off: 0 of 5 used our component** — every run hand-rolled a custom badge with raw colors (the exact drift the audit flagged)
- **On: 5 of 5 used the real `CounterBadge`** — correct component, import, props
- Confidence tag: Clean result in the pilot — n=5, one component, one model family. Directional, not a population estimate.

**Visual:** Giant before/after number, accent color:
```
        CODE CONNECT OFF          CODE CONNECT ON
             0 / 5          →          5 / 5
        hand-rolled div           real CounterBadge
        raw hex colors            @harnessio/ui
```

---

## Slide 9a — The 2×2 (this IS the imitation problem) [DATA VISUAL]

**Content:**
- Headline: The imitation gap I hit is the red cell — and it's exactly where PMs and designers live
- Caption: Give the agent the codebase and it finds the component itself — Code Connect adds nothing (in-repo prototyping = why my platformUI results are great). Take the codebase away — a Figma frame, a designer prototyping outside the repo — and it hand-rolls an imitation. **PMs and designers are structurally in that bottom-left cell, always.** Code Connect is the fix for exactly the people the goal is about.

**Visual:** 2×2 grid, green cells = used our component, red cell = hand-rolled:
```
                          Code Connect OFF     Code Connect ON
   ┌──────────────────┬───────────────────┬───────────────────┐
   │ Figma only       │      0/5   ❌       │      5/5   ✅      │
   │ (design handoff) │   hand-rolled      │   CounterBadge    │
   ├──────────────────┼───────────────────┼───────────────────┤
   │ Figma + repo     │      5/5   ✅       │      5/5   ✅      │
   │ access           │   (read source)    │   CounterBadge    │
   └──────────────────┴───────────────────┴───────────────────┘
```
Speaker note: The "redundant in-repo" cell isn't a weakness — it's the scoping
insight. Engineers are covered; the goal is PMs and designers, and they never
have the repo. Reframe the ask: not "bet on a maybe-future," but "the people we're
enabling already live in the low-fidelity cell — do we close it for them?"

---

## Slide 9b — The fix we already have: prototype in repo context [DATA VISUAL]

**Content:**
- Headline: There are two ways to reach fidelity — add Code Connect, or put the prototype in repo context. We already built the second one.
- The 2×2 has two routes from imitation (0/5) to fidelity (5/5): move *right* (add Code Connect) **or** move *down* (give the agent repo context). Repo context alone = 5/5.
- **Kitchen sink** — our existing app that runs `@harnessio/ui` inside the platformUI context — IS the bottom row. It already exists, it's free, no shared-file publish, no mapping upkeep.
- **Cost rides along:** in-context = the agent references the real component (accurate AND cheap, one import); out-of-context = it rebuilds from pixels (off-brand AND expensive — stripping context roughly **doubled discovery cost**). Fidelity and token-efficiency are the same lever.
- So the primary move isn't new infrastructure — it's **routing AI prototyping through kitchen-sink-in-platformUI.**
- Confidence tag: The 2×2 is measured; "kitchen sink = the repo-access row" is the direct implication, worth a confirming run.

**Visual:** the 2×2 with the two arrows to fidelity called out:
```
                       CC OFF        CC ON
   Figma only          0/5  ❌   ──►  5/5 ✅   ◄ Code Connect route
                         │
                         ▼ repo-context route (Kitchen Sink)
   Repo access          5/5  ✅        5/5 ✅

   Two roads to 5/5. Kitchen Sink is already built.
```
Speaker note: This is the measurement paying off — the free, existing fix reaches
the same cell as the expensive one. Kitchen sink is the lead; Code Connect earns a
narrower role on the next slide.

---

## Slide 10 — Why it scales

**Content:**
- Headline: This is a down payment, not a one-off
- 1. **A reusable measuring instrument** — any design-system change can be tested before we spend on it. "Does this help?" goes from argument to an afternoon. (It just kept us from over-investing in Code Connect when kitchen sink already reaches the same fidelity.)
- 2. **It rewrites the priority list** — "write more agent docs" is the expensive default and it's low-return. The wins, cheapest first: **put the agent in real context (kitchen sink)**, **fix wrong facts**, **bind Figma→code (Code Connect) where context isn't available**.
- 3. **The groundwork is paid** — Code Connect proven on the badge family; kitchen sink already exists. Scaling either is mostly mechanical.

**Visual:** return-per-effort bars, cheapest-high-value first:
```
   Route through Kitchen Sink   ▓▓▓▓▓▓▓▓  high return · ~free (exists)
   Fix wrong facts              ▓▓▓▓▓     good return · cheap
   Code Connect rollout         ▓▓▓        real return · scoped effort
   Write more agent docs        ▓          low return · ongoing upkeep
```

---

## Slide 11 — Takeaway + the decision

**Content:**
- Headline: The imitation gap is real, measured, and mostly closable with what we already have.
- What the evidence establishes: the low-fidelity output isn't an access problem — it's a *context* problem. Prototyping in the platformUI context (where the real components and usage live) reaches fidelity; bare/out-of-context doesn't. **Kitchen sink already provides that context.**

**THE ASK — Make kitchen-sink-in-platformUI the default AI prototyping path, then layer accelerants.**

- **1. Route AI prototyping through kitchen sink (primary, ~free).** It already reaches the fidelity cell. Make it the sanctioned path for PMs/designers, with a short "prototype here with AI" guide. Biggest fidelity gain for the least effort.
- **2. Code Connect as accelerant + no-repo answer (scoped).** Even in-context it speeds Figma→component handoff and nails the confusable families (badge, overlays) first-try — and it's the *only* fix for people who won't clone a repo (pure Figma Make). Pilot is proven; scope the rollout to high-traffic components.
- **3. Keep docs factually correct (cheap, ongoing).** Wrong facts are the one doc failure that misleads agents. Stand up an **AI-legibility CI gate** (fails on phantom paths / stale variants), with the A/B harness as the regression instrument.
- The win: the free, existing fix (kitchen sink) does the heavy lifting — we know because we measured, instead of defaulting to the expensive build.
- Horizon (one line): *And the method — measure legibility, fix wrong facts, put the agent in real context — generalizes to any codebase. For a dev-tools company whose customers increasingly build with AI, Canary is the proving ground.*
- Footer caveat: Evidence, not proof — small samples, mostly one model family, pilot on one component family. Gap reproduced in the trial and in real workflow; confirm with a second component family.

**Visual:** Goal at top, tiered fixes by leverage:
```
   GOAL: Figma → prototypes that actually look like Harness, with AI
   ────────────────────────────────────────────────────────────────
   PRIMARY (free, exists)  → Route AI prototyping through Kitchen Sink
                             (platformUI context = the fidelity cell)
   ACCELERANT (scoped)     → Code Connect: faster handoff, first-try
                             component pick, + the no-repo segment
   HYGIENE (cheap/ongoing) → AI-legibility CI gate: fail on wrong facts
   ────────────────────────────────────────────────────────────────
     Heavy lifting from what we already built — because we measured.
```
Speaker note: Lead with kitchen sink — the credible, cheap, already-built win.
Code Connect is the accelerant, not the headline; be ready to say "component
choice wasn't PMs' main gap, context was." If the room leans into the horizon
line, open the company-wide AI-legibility conversation — but let the data lead.

---

## Slide 12 — Appendix: what shipped (the receipts)

**Content:**
- Headline: What shipped — the full workstream
- Framing line (small): The narrative above is the insight. This is the complete body of work behind it.

**Visual:** Clean table:
```
  Shipped                     What it does                                    Status
  ──────────────────────────────────────────────────────────────────────────────────
  packages/ui/AGENTS.md       First agent guide for the 118-component         In review
                              library — cuts agent discovery time ~2×
  DESIGN.md badge fix         Fixed phantom badge.tsx → real Tag /             In review · trial-backed
                              StatusBadge / CounterBadge boundary
  Wrong-fact fixes            False token names, component options, a         In review
                              "headless" guide that ships UI
  Code Connect (badge family) Figma→code binding — live & verified            Published
  Code Connect handoff trial  2×2 ablation, 20 runs, 0/5 → 5/5 on handoff     CODE_CONNECT_TRIAL.md
```
Footer: Plus the reusable A/B harness and the data behind every claim —
`CODE_CONNECT_TRIAL.md`, `AI_READINESS_FINDINGS.md`.

**Open verification (before scaling):**
- Package access is NOT the blocker — resolved: PMs can install `@harnessio/ui`; results still mixed. The differentiator is repo *context* (platformUI / kitchen sink), not the package.
- Kitchen-sink confirmation — run the trial inside kitchen sink to confirm it lands in the 5/5 fidelity cell as the 2×2 predicts
- Second component family — confirm the 0/5→5/5 pattern holds beyond badges
- Visual-fidelity score — measure prototype-vs-spec pixel fidelity, not just component choice

---

## Backup slide (Q&A only) — methodology

**Content (hold in reserve, don't present):**
- Harness: fresh headless agents, isolated git worktrees, identical prompts, on/off = the single variable
- Doc trials: 4 trials × 6 runs = 24; badge trial baseline 1/3 → 3/3 (Sonnet 4.6)
- Code Connect trial: 2×2, 5 runs/arm = 20; scored by parsing the generated file, not self-report
- Switch for Code Connect arms: `get_design_context` `disableCodeConnect` flag (verified it flips the output: generic div vs. real component)
- The in-repo/out-of-repo fidelity gap was first observed in my own prototyping workflow (platformUI = high fidelity; Figma MCP outside Canary = imitation), then reproduced as the trial's 2×2. Anecdote and measurement are the same phenomenon.
- Access ruled out as the cause: PMs can install the package; fidelity still varies by context. Kitchen sink (runs `@harnessio/ui` in platformUI context) is the existing in-context path = the 2×2's repo-access row.
- Caveats: small n, badge family only, mostly one model family. Directional. Next steps: confirm kitchen-sink fidelity, second component family, visual-fidelity scoring.
- Started from a commissioned external scan; independently verified and corrected it (caught 4 errors, incl. the phantom `badge.tsx` and a non-existent issue number).
