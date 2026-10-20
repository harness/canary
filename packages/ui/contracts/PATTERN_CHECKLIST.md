# Pattern Contract Checklist

Use this when writing a pattern: the rules for composing components on one kind of screen. A pattern is two files in `src/patterns/<kebab>/`. The manifest holds the structure (which components, which slots, which props each slot allows, examples). The guide holds the rules and why they exist. StatusBadgePattern (`src/patterns/status-badge-pattern/`) is the worked example throughout.

Items marked **(validator)** are checked by `pnpm ds:validate`; the rest need a person. The templates (`TEMPLATE.pattern.manifest.json` and `TEMPLATE.pattern.guide.md`) carry the same guidance in place, as `[TK]` hints and HTML comments. Comments never reach the agent reference, so you can keep them or delete them.

## When something is a pattern

- [ ] The rule is about how components combine on a screen, not about one component's props. "Wrap the badge in a live region" is a pattern rule. "StatusBadge needs a text label" is a component rule.
- [ ] The rule would apply to more than one screen. A one-off layout is not a pattern.
- [ ] If a component guide already holds a composition rule, move it here instead of copying it. Retire the old ID with its replacement in `rule-ids.md`, such as `SBD-005 (SBP-001)`.

## 1. Scaffold

- [ ] Pick a prefix of 2 to 5 capital letters and add a row to `contracts/rule-ids.md`. The Component column holds the pattern's name in PascalCase, such as `StatusBadgePattern`. Never reuse a prefix or an ID.
- [ ] Run `pnpm ds:scaffold <PatternName> --prefix <PREFIX> --pattern` from `packages/ui`. It writes both files from the templates. **(scaffolder)**
- [ ] The prefix is registered to this pattern name. **(scaffolder, validator)**

## 2. Manifest

**purpose**

- [ ] `summary` is one sentence naming what the screen shows and which components it uses. StatusBadgePattern: "Show the state of a pipeline execution (a run, a stage or a step) as one badge that announces its changes."
- [ ] Each `useWhen` describes the data or the situation, not the component. StatusBadgePattern: "The value is an ExecutionState from src/types/execution.ts."
- [ ] Each `doNotUseWhen` names what to use instead and cites the rule: "The value is a stable attribute, not a state. Use Tag (SBD-001)."

**components**

- [ ] One entry per component the pattern uses. `export` is the code export, copied from the component's manifest. **(validator)**
- [ ] `manifest` points to the component's manifest. When the component has no contract, set `manifest` to `null` and give `path` to its source file instead. **(validator: the path must exist)**
- [ ] `role` says what the component does here, in a few words: "Renders the state."

**anatomy**

- [ ] One slot per part of the composition. `slot` is a camelCase name such as `badge` or `liveRegion`. **(validator)**
- [ ] `fill` is a component export from `components`, or a plain element such as `div[aria-live=polite]`.
- [ ] `required` is `true`, `false`, or a short condition: "when the state can change while visible".
- [ ] `props` lists only the values this pattern allows for a prop, when it narrows the component. StatusBadgePattern allows four of StatusBadge's themes. Every value must exist on the component. **(validator)**
- [ ] `rules` lists every rule that governs the slot, from this guide or a component guide. **(validator: each ID exists)**

**states** (remove if the pattern has none)

- [ ] `source` names the file and type the states come from. `values` copies them exactly.
- [ ] Leave `map` as `null` until Design decides what each state looks like, and point `notes` at the gap that tracks it. **(validator: map keys must be in values)**

**constraints**

- [ ] Each one reads as "when X, use Y instead of Z" and cites a rule. Use `enforcedBy: review` unless a lint rule or test enforces it.

**figma**

- [ ] `fileKey` and `nodeId` come from Figma. Until the Figma counterpart exists, leave them `null` and keep the open gap that says so.

**examples**

- [ ] Correct examples are JSX that follows every rule and uses at least one listed component.
- [ ] Incorrect examples are real mistakes where possible (from a review, a PR or an agent test), and `violates` names the rule each breaks.
- [ ] Give each example a `source`: where it came from and the date.
- [ ] Examples are checked against the components' contracts, not only the pattern's. A correct example fails if any component's props, constraints, lint rules or this pattern's slot narrowing reject it. An incorrect example fails if a rule it cites can be checked automatically and the code does not break it. Rules checked only by review are not tested. **(validator)**

**governance and knownGaps**

- [ ] `governance.guide` is `./<kebab>.guide.md`. `note` says "Draft." until ratified.
- [ ] Each open question is a `knownGaps` entry with the gap's rule ID. Remove the entry when the gap is resolved.

## 3. Guide

**Front matter**

- [ ] Front matter is the only place for each rule's id, title, status, tier and check. Body headings repeat the id and title and add prose only. **(validator)**
- [ ] A title states the rule itself, so it works alone in a list: "One state per badge — when several apply, show the most urgent", not "Badge count".
- [ ] Tier says how strict the rule is. Tier 1 is close to a hard constraint: an agent must follow it. Tier 2 and 3 are good defaults: an agent may deviate and must say why. Use tier 1 for accessibility and anything that breaks the screen.
- [ ] `check` is `review` unless a `test:` or `lint:` target enforces the rule. A pattern has no props type, so it never uses `types:`. **(validator)**
- [ ] Status is `proposed` until Design ratifies the rule. A question nobody has answered is a gap with status `open`, not a rule.

**Intro**

- [ ] Two or three sentences under the H1: what screen problem the pattern solves and what it leaves out. Start with "Draft." while it is one. The intro appears in the agent reference under "About this guide".

**Do's and Do Not's**

- [ ] One instruction per line, written as an order: "Put one state in a badge."
- [ ] Each line ends with the rule it comes from, in parentheses. Cite component rules too when they matter on this screen, such as (SBD-006).
- [ ] Do Not's name the mistake plainly, with a real example in quotes when there is one: "Don't put two statuses in one badge ("Error, Pending")."

**Rule sections**

- [ ] One section per rule: a `## PREFIX-NNN — Title` heading with the exact front matter title. **(validator)**
- [ ] One to three sentences: what the rule says, then why.
- [ ] Components, props and values are spelled exactly as their manifests spell them, in backticks. Never invent a token, prop, value or Figma name. Write `[TK]` and ask.

**Known gaps**

- [ ] Each gap gets a `### PREFIX-NNN — Title` heading under `## Known gaps`. **(validator)**
- [ ] An open gap's title starts "Open:". It names what is unresolved, the evidence on each side and who decides.
- [ ] When a gap is decided, set its status to `resolved`, retitle it "Resolved: ...", and start the body with "Decided by <name>, <YYYY-MM-DD>." followed by the decision. Then update the rules and the manifest to match. SBP-009 is an example.

## 4. Before you commit

- [ ] No `[TK]` remains in either file. **(validator)**
- [ ] `pnpm ds:generate` has been run and `agents/patterns/<kebab>.md` is committed.
- [ ] `pnpm ds:check <PatternName>` exits 0.
- [ ] Read the generated reference in `agents/patterns/`. It is what agents see. If a rule reads wrong there, fix the guide, not the reference.

## Ratification

- [ ] Design signs off on each rule; change its status from `proposed` to `ratified`.
- [ ] Move the manifest `status` from `draft` to `stable`, and update `governance.note`.
