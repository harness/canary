# Using design system components

Read this before writing, generating or reviewing code that uses a `@harnessio/ui` component. It applies in any tool. Adapted from Katie's component-manifest consumer skill.

## 1. Find the contract

Open [`components/INDEX.md`](components/INDEX.md). Each row links to a generated reference that combines the component's manifest and guide. Do not search the repo for manifests.

If the component is not in the index, it has no contract. Say that plainly in your answer, then work from its source and docs page. Do not present guesses as contract facts.

## 2. Check you picked the right component

Read the reference's **Use when** and **Do not use when** lists. If the reference names a sibling component (for example StatusBadge and Tag), read the rules that say how to choose between them before writing code.

## 3. Write code in this priority order

When two sources disagree, the higher one wins.

1. **Type constraints.** The **Props** table, **Constraints** and **Illegal combinations** sections. These are hard rules. Pass only props listed under Props. Figma-only properties have no code prop; never pass them.
2. **Do's and Do Not's.** Treat every entry as a constraint.
3. **Examples.** Mirror **Correct**. Never reproduce a pattern from **Incorrect**, even if it would render.
4. **Tokens.** Use only the tokens the reference lists. Never write a raw hex, rgb or px value for color, spacing or size.
5. **Tier 1 rules.** Close to hard constraints. Status `proposed` does not weaken them.
6. **Tier 2 and 3 rules.** Good defaults. You may deviate, but say why in your answer or the PR.
7. **Known gaps.** Surface any that apply to your code, even if nobody asked. For example, wrap a live-changing StatusBadge in `aria-live="polite"`.

## 4. When the contract does not cover what you need

- Do not invent a prop, token or variant.
- Say what is missing. Point to the closest documented option, or ask for the real value.
- If you propose something new, label it as a proposal, not as part of the contract.

## 5. Check your work

From `packages/ui`, run `pnpm ds:check <Component>` after editing a component, manifest or guide, and `pnpm typecheck` after editing any TypeScript. For a review of your own diff, run [`REVIEW-UI.md`](REVIEW-UI.md).

## Review buckets

When you report problems, in your own code or someone else's, sort them into these buckets and keep them separate:

| Bucket | Meaning |
| ------ | ------- |
| Bug | A type constraint or illegal combination is violated. |
| Constraint violation | A Do or Do Not is violated, or an Incorrect example is reproduced. |
| Tier 1 violation | A tier 1 rule is not followed. |
| Suggestion | A tier 2 or 3 rule is not followed. |

Cite the rule ID for each item, for example "violates SBD-007".
