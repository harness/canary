# Presentation Brief — Canary AI-Readiness

Paste this whole file into Claude / a slide generator. It's the finalized deck:
~16 slides (numbered 1, 1a, 2–9, 9a, 9b, 9c, 10–12) + a Q&A backup. Each slide has
**content** and a **visual** spec — build the visual, don't just bullet the text.
Slide order is the presentation order.

---

## Meta (for the generator)

- **Title:** Prototypes That Actually Look Like Harness. What It Takes to Get There with AI.
- **Audience:** Exec + design/eng leadership. Mixed technical depth.
- **Tone:** Direct, evidence-led, no hype. Confidence levels stated, not buried.
- **Voice:** "I" for decisions and judgment (the goal, the observation, building the harness, the pivots, the reframe). Results stated in the work's own voice ("the data showed," "0/5 → 5/5"). "We" for the team asks. Establish authorship once on slide 1, then let substance carry it.
- **Narrative spine:** the GOAL (PMs & designers prototype in real Harness fidelity, cheaply, without living in the codebase) → the GAP I hit (in-repo = great, out-of-repo = imitations) → what the data shows causes it → what closes it. Every slide serves that north star — keep it visible.
- **Two payoffs, one lever:** fidelity AND token-efficiency move together. Handing an agent the real component = accurate + cheap; making it reconstruct from pixels = imitation + expensive. Don't treat cost as a separate axis; it's the co-payoff of the same fix.
- **Design:** Clean, data-forward. Neutral palette; ONE accent color, used only for key numbers and the expected-vs-found contrast. Green = correct/used-our-component, red = wrong/hand-rolled/imitation — use consistently on slides 6, 7, 9, 9a.
- **Visual-heavy:** every slide gets a diagram, chart, grid, or before/after. No text-only slides.
- **Never-strip rule:** the confidence caveats on slides 4, 6, 9, 9a, 11 must survive the design pass. In an exec room they are what makes the claims credible.

---

## Slide 1 — Title

**Content:**
- Title: Prototypes That Actually Look Like Harness. What It Takes to Get There with AI.
- Subtitle: Why PM/designer prototypes come out looking like imitations of our design system — and what closes the gap.
- Footer: Investigation & implementation: [Your name] · [date] · Design Systems

**Visual:** Full-bleed title. Background motif: two badge mockups side by side —
one crisp/on-brand, one slightly-off "imitation" — foreshadowing the fidelity gap.

---

## Slide 1a — The goal (open here)

**Content:**
- Headline: The goal: PMs and designers prototype in real Harness fidelity — accurately, cheaply, without living in the codebase
- Prototyping is how product decisions get made. If prototypes don't look like the real platform, they mislead — and reworking them wastes cycles
- The dream: a designer or PM turns a Figma design into working, on-brand Harness UI with AI — no eng handoff, no repo expertise
- The catch I hit myself: **when I prototype inside platformUI (which consumes Canary), results are great. When I use Figma MCP to build the same design outside Canary, the output looks like an imitation** — right idea, wrong execution, off-brand
- That gap is the whole problem. This deck is: why it happens, and what closes it.

**Visual:** Two-panel "same design, two workflows" comparison:
```
   IN-REPO (platformUI + Canary)        OUT-OF-REPO (Figma MCP, no Canary)
   ┌───────────────────────┐            ┌───────────────────────┐
   │  ✅ real components     │            │  ❌ imitation           │
   │  ✅ on-brand            │            │  ❌ raw colors, off-spec │
   │  ✅ cheap (1 import)    │            │  ❌ expensive (rebuilt)  │
   └───────────────────────┘            └───────────────────────┘
```
Speaker note: This isn't a hypothetical — it's my own workflow. The rest of the
deck shows this exact split is a measurable, fixable phenomenon, not bad luck.

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

## Slide 9b — Fidelity AND cost move together [DATA VISUAL]

**Content:**
- Headline: The imitation path isn't just off-brand — it's expensive. The fix delivers both.
- Reconstructing a component from pixels = wrong execution AND wasted tokens. Referencing the real component = accurate AND cheap (one import).
- Signal from the trials: stripping context roughly **doubled discovery cost** (turns / time / $); the Code-Connect-on runs resolved in **fewer tool calls** than the off runs that had to rebuild.
- So fidelity and token-efficiency are not a tradeoff — the same lever (hand the agent the real component vs. make it guess) delivers both.
- Confidence tag: Directional — cost measured in the doc trials; handoff cost delta observed, not yet formally tallied per-run.

**Visual:** Two bars, same task:
```
   IMITATION PATH (rebuild from pixels)   ▓▓▓▓▓▓▓▓  high tokens · off-brand ❌
   REFERENCE PATH (real component)        ▓▓▓        low tokens · on-brand  ✅
```

---

## Slide 9c — Fidelity needs TWO things (a lever we shouldn't miss)

**Content:**
- Headline: Knowing the right component isn't enough — the prototype also has to be able to run it
- Fidelity out-of-repo needs both: **(1) the binding** — which component (`CounterBadge`) → Code Connect provides this; **(2) access** — can the prototype actually `import` and run `@harnessio/ui`?
- Open question worth checking: if the package isn't trivially installable where PMs prototype, Code Connect hands them the right import and the prototype *still breaks* — so they fall back to imitation
- We have a hint: the registry is gated (we hit install-auth failures all weekend). Part of the imitation problem may be *access*, not Figma-MCP quality
- **Potential cheapest win of all:** make `@harnessio/ui` + a prototype starter trivially consumable outside the repo — may recover most fidelity before any Code Connect
- Confidence tag: Hypothesis, moderate — flagged for verification, not yet tested

**Visual:** Two-gate diagram to a working prototype:
```
   Figma design ──► [ Gate 1: which component? ]  ──► [ Gate 2: can it run it? ] ──► ✅ fidelity
                        Code Connect                    package installable?
                        (proven)                        (unverified — check this)
```
Speaker note: Don't headline Code Connect if publishing the package for
prototyping gets us most of the way for a fraction of the effort. Verify Gate 2.

---

## Slide 10 — Why it scales

**Content:**
- Headline: This is a down payment, not a one-off
- 1. **A reusable measuring instrument** — any design-system change can be tested before we spend on it. "Does this help?" goes from argument to an afternoon.
- 2. **It rewrites the priority list** — "write more agent docs" is the expensive default and it's low-return. "Fix wrong facts" and "bind Figma to code" are the wins.
- 3. **The expensive part is paid** — Code Connect setup is done; scaling from 3 components to the full library is mostly mechanical.

**Visual:** 3 stacked "leverage" bars — low (more docs), medium (fix wrong facts),
high (Figma→code binding) — showing return-per-effort, not effort.

---

## Slide 11 — Takeaway + the decision

**Content:**
- Headline: The imitation gap is real, measured, and fixable. The decision is how far we close it.
- What the evidence establishes: the low-fidelity output PMs and designers get is the "no code to read" cell — and **Code Connect closes it (0/5 → 5/5)**. The people the goal is about live there permanently. This isn't a bet on a maybe-future; it's the workflow they have today.

**THE DECISION — How far do we go to make design→code prototyping produce real Harness fidelity?**

- **Full commitment →** Code Connect is infrastructure, not a pilot. De-risked: proven it works, bounded where it pays off. Fund the rollout to the high-traffic component set, **verify the package is consumable outside the repo** (the second fidelity gate), and stand up an **AI-legibility CI gate** that fails on wrong facts (phantom paths, stale variants), with the A/B harness as the regression instrument.
- **Cheapest-win first →** verify the package-access gate before any rollout — if PMs can't install `@harnessio/ui`, fixing that may recover most fidelity for a fraction of the effort. Bank the fact-fixes; scope Code Connect after.
- **Hold →** we've already banked the fact-fixes and proven the mechanism. Revisit when design-first prototyping is a bigger share of how UI gets made.
- Every path is informed by data, not guesswork — that's the win.
- Horizon (one line): *And the method — measure legibility, fix wrong facts, bind the handoff — generalizes to any codebase. For a dev-tools company whose customers increasingly build with AI, Canary is the proving ground.*
- Footer caveat: Evidence, not proof — small samples, one model family, pilot on one component family. The gap is real and reproduced (in the trial and in my own workflow); exact ROI needs a second component family + the package-access check to confirm.

**Visual:** The goal at top, three funded-depth options beneath it:
```
   GOAL: PM/designer prototypes that look like real Harness — accurate & cheap
   ────────────────────────────────────────────────────────────────────────
     FULL          → Code Connect rollout + package access + AI-legibility CI gate
     CHEAPEST-WIN  → verify package install first; scope Code Connect after
     HOLD          → bank fact-fixes; revisit as design-first grows
   ────────────────────────────────────────────────────────────────────────
        Every path is data-informed — the gap is measured, not guessed.
```
Speaker note: Frame as "how far do we go," not "approve my rollout." All three are
legitimate and de-risked. Push the cheapest-win check (package access) as the
honest next move regardless of appetite — it may beat Code Connect on ROI. If the
room leans into the horizon line, open the company-wide AI-legibility conversation
— but let the data lead.

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

**Open verification (before a full commitment):**
- Package access — can `@harnessio/ui` be installed/run where PMs prototype? (registry is gated; may be a bigger fidelity lever than Code Connect)
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
- Caveats: small n, badge family only, mostly one model family. Directional. Next steps: package-access check, second component family, visual-fidelity scoring.
- Started from a commissioned external scan; independently verified and corrected it (caught 4 errors, incl. the phantom `badge.tsx` and a non-existent issue number).
