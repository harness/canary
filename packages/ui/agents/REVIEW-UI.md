# Review a UI diff against component contracts

Use this as a prompt in any tool. Give it a diff (for example `git diff main...HEAD`) or a list of changed files.

## Instructions

1. **Find the touched components.** List every `@harnessio/ui` component the diff renders, imports or changes. For each, look it up in [`components/INDEX.md`](components/INDEX.md). Note any component that has no contract; you will report it but cannot check its rules. If a component's reference lists a pattern under **Used in patterns** and the diff composes that pattern, add the pattern to the list.
2. **Read each reference** in `components/` and `patterns/` in full: props, constraints, illegal combinations, Do's and Do Not's, tokens, rules, examples and known gaps.
3. **Check each usage** in the diff against the priority order in [`USING-COMPONENTS.md`](USING-COMPONENTS.md) section 3, from the top.
   - Props: every prop passed is listed, with an allowed value. No Figma-only property is passed.
   - Constraints and illegal combinations: none are hit.
   - Do's and Do Not's: none are broken.
   - Incorrect examples: none are reproduced.
   - Tokens: no raw color, spacing or size values where the reference lists tokens.
   - Rules: tier 1 rules are followed. Note tier 2 and 3 deviations that have no stated reason.
   - Known gaps: any that apply are handled, or called out.
4. **If the diff changes a contract or component source**, also check that `pnpm ds:check <Component>` and `pnpm typecheck` pass, and that `agents/components/` and `agents/patterns/` were regenerated.
5. **Do not report** style preferences that no rule supports. Do not invent rules.

## Output

Report in four sections, in this order, and keep them separate. Leave a section out if it is empty.

- **Bug**: type constraint or illegal combination violated.
- **Constraint violation**: a Do or Do Not broken, or an Incorrect example reproduced.
- **Tier 1 violation**: a tier 1 rule not followed.
- **Suggestion**: a tier 2 or 3 rule not followed.

Each item gives the file and line, the rule ID (for example SBD-007), what is wrong, and the fix. End with:

- components touched that have no contract;
- known gaps that apply to the diff.
