# Presentation Brief — Canary AI-Readiness

Paste this whole file into Claude / a slide generator. It's the finalized deck:
13 slides + backup. Each slide has **content** and a **visual** spec — build the
visual, don't just bullet the text.

---

## Meta (for the generator)

- **Title:** We Audited Canary for AI-Readiness. I Expected a Docs Problem. The Data Said Otherwise.
- **Audience:** Exec + design/eng leadership. Mixed technical depth.
- **Tone:** Direct, evidence-led, no hype. Confidence levels stated, not buried.
- **Voice:** "I" for decisions and judgment (hypothesis, building the harness, the pivots, the reframe). Results stated in the work's own voice ("the data showed," "0/5 → 5/5"). "We" for the team asks. Establish authorship once on slide 1, then let substance carry it.
- **Narrative spine:** expected X → found Y → what I did → what it proves. Keep it visible.
- **Design:** Clean, data-forward. Neutral palette; ONE accent color, used only for key numbers and the expected-vs-found contrast. Green = correct/used-our-component, red = wrong/hand-rolled — use consistently on slides 6, 7, 9, 9a.
- **Visual-heavy:** every slide gets a diagram, chart, grid, or before/after. No text-only slides.
- **Never-strip rule:** the confidence caveats on slides 4, 6, 9, 9a, 11 must survive the design pass. In an exec room they are what makes the claims credible.

---

## Slide 1 — Title

**Content:**
- Title: We Audited Canary for AI-Readiness. I Expected a Docs Problem. The Data Said Otherwise.
- Subtitle: What I set out to measure, what surprised me, and what shipped because of it.
- Footer: Investigation & implementation: [Your name] · [date] · Design Systems

**Visual:** Full-bleed title. Optional faint background motif: a Figma frame and a
code bracket `{ }` with an arrow between them — foreshadows the design→code thesis.

---

## Slide 2 — Why the audit

**Content:**
- Headline: As coding agents start building with our design system, one question mattered: can they use it correctly?
- Canary — 118 components, our tokens, the library our apps depend on
- AI agents (a new hire who's never seen our code) increasingly write the UI
- We audited five areas and scored each

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
- Headline: Agents don't read our docs. They read our code — and mostly get it right with no docs at all
- Tested directly: same build task, with our docs vs. docs stripped
- Either way, agents produced near-identical, mostly-correct code
- Even the agent guide I wrote, measured head-to-head: it **halves discovery time**, but doesn't change what gets built — speed, not correctness
- Confidence tag: Strong signal, not proof — 4 trials, small samples, one model family

**Visual:** Split card, HYPOTHESIS (struck through) vs. FINDING:
```
   EXPECTED                    FOUND
   "The fix is docs"    →      "Docs barely move
   (struck through)            what a capable agent builds"
```
Speaker note: The guide isn't wasted — it makes agents and new hires faster. It just isn't the *correctness* lever we assumed. That's the finding.

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

## Slide 9a — The 2×2 (the whole insight in one grid) [DATA VISUAL]

**Content:**
- Headline: ...but only where there's no code to read. That's the whole insight in one grid.
- Caption: The only failure is design-handoff with no Code Connect. Give the agent the codebase and it finds the component itself — Code Connect adds nothing. Take the codebase away (a Figma frame, a designer prototyping) and Code Connect is the only thing that works.

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
Speaker note: Docs AND repo access both fail on the same axis — no code to read.
Code Connect is the fix for exactly that quadrant. So its ROI is a bet on how much
generation starts from Figma frames without repo context — not urgent for
in-repo engineers today, decisive for design-handoff and design-scoped agents.

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
- Headline: I expected a docs problem. I found a fork in the road — and made it safe to choose.
- The evidence points to one real decision, not a to-do list: **Code Connect is decisive for design→code handoff (0/5 → 5/5), and redundant once an agent can read the repo.** So the question is strategic, not technical:

**THE FORK — Are we betting on design-first generation? (UI built from Figma, by people and agents who don't live in the repo)**

- **If YES →** Code Connect is infrastructure, not a pilot. I've de-risked it: proven it works, bounded exactly where it pays off. Fund the rollout to the high-traffic component set + stand up an **AI-legibility gate** — CI that fails on wrong facts (phantom paths, stale variants), with the A/B harness as the regression instrument.
- **If NO →** we just avoided a rollout our own data says is pointless for in-repo work. Bank the cheap wins (the fact-fixes) and move on.
- Either answer is a win — because we measured instead of guessed.
- Horizon (one line): *And the method — measure legibility, fix wrong facts, bind the handoff — generalizes to any codebase. For a dev-tools company whose customers increasingly build with AI, Canary is the proving ground.*
- Footer caveat: Evidence, not proof — small samples, one model family, pilot on one component family. The fork is real; the exact ROI needs a second component family to confirm.

**Visual:** A literal fork-in-the-road diagram — one path in, two paths out:
```
                          ┌──────────────────────────────┐
              YES ───────►│ Code Connect = infrastructure │
             ╱            │ Fund rollout + AI-legibility  │
   ┌──────────────┐       │ CI gate (harness = regression)│
   │  THE BET:     │      └──────────────────────────────┘
   │  design-first │
   │  generation?  │      ┌──────────────────────────────┐
   └──────────────┘       │ Bank the fact-fixes,          │
              ╲   NO ────►│ skip the rollout our own data │
                          │ says is redundant in-repo     │
                          └──────────────────────────────┘

        Either branch is a win — because we measured.
```
Speaker note: This is a decision only leadership can make — I've made it safe to
make either way. Don't frame it as "approve my rollout"; frame it as "pick the
branch, both are de-risked." If the room leans into the horizon line, that's the
cue to open the company-wide AI-legibility conversation — but let the data lead.

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

---

## Backup slide (Q&A only) — methodology

**Content (hold in reserve, don't present):**
- Harness: fresh headless agents, isolated git worktrees, identical prompts, on/off = the single variable
- Doc trials: 4 trials × 6 runs = 24; badge trial baseline 1/3 → 3/3
- Code Connect trial: 2×2, 5 runs/arm = 20; scored by parsing the generated file, not self-report
- Switch for Code Connect arms: `get_design_context` `disableCodeConnect` flag (verified it flips the output: generic div vs. real component)
- Caveats: single model family (Sonnet 4.6), small n, badge family only. Directional. Next step: repeat on a second component family.
- Started from a commissioned external scan; independently verified and corrected it (caught 4 errors, incl. the phantom `badge.tsx` and a non-existent issue number).
