---
domain: {pattern-kebab}
prefix: {PREFIX}
version: 0.1.0
manifest: ./{pattern-kebab}.manifest.json
rules:
  - id: {PREFIX}-001
    title: '[TK] Rule title, stated as the rule itself'
    status: proposed
    tier: 1
    check: review
  - id: {PREFIX}-002
    title: '[TK] Rule title'
    status: proposed
    tier: 2
    check: review
gaps:
  - id: {PREFIX}-003
    title: 'Open: a Figma counterpart is expected but not identified'
    status: open
---

# {PatternName} Pattern Guide

<!--
Notes for authors. Comments like this one never reach the agent reference, so keep them or delete them.

This file holds the rules for composing components on one kind of screen. The paired manifest holds the structure: which components, which slots, which props each slot allows, and examples. Write the rules here and the structure there.

The front matter at the top is the only place a rule's id, title, status, tier and check live. Headings in the body repeat the id and title exactly and add prose only. Never write status, tier or check in the body; the validator rejects it.

Tier 1 rules are close to hard constraints: an agent must follow them. Tier 2 and 3 rules are good defaults: an agent may deviate and must say why.

Check says what enforces a rule. Use review unless a test or lint rule really does enforce it. A pattern has no props type, so it cannot use a types check.

Status stays proposed until Design ratifies the rule. An unanswered question is a gap, not a rule.

Replace every TK marker before you commit. The validator fails while any remain.
-->

[TK] Two or three sentences for the agent reading this pattern: what screen problem it solves, and what it does not cover. Say "Draft." first while the pattern is a draft.

## Architecture: Do's and Do Not's

<!--
One short instruction per line, written as an order: "Put one state in a badge." End each line with the rule ID it comes from, in parentheses. A line may cite a component rule, such as (SBD-006), when that rule matters on this screen. Every Do and Do Not needs a rule behind it, here or in a component guide.
-->

### Do's

- [TK] An instruction. ({PREFIX}-001)

### Do Not's

- [TK] The mistake, named plainly, with a real example in quotes when one exists. ({PREFIX}-001)

## {PREFIX}-001 — [TK] Rule title, stated as the rule itself

<!--
One to three sentences: what the rule says, then why. Name components, props and values exactly as their manifests spell them, in backticks. Never invent a token, prop, value or Figma name. When you do not know one, write a TK marker and ask. If the rule came from another guide, start with "Formerly XYZ-000."
-->

[TK] What the rule says and why it matters.

## {PREFIX}-002 — [TK] Rule title

[TK]

## Known gaps

Open questions that keep their rule IDs but are not rules yet.

<!--
A gap names what is unresolved, the evidence on each side, and who decides. Title it "Open: ..." while open. When it is decided, change its status to resolved, retitle it "Resolved: ...", and start the body with "Decided by <name>, <YYYY-MM-DD>." followed by the decision. A resolved gap keeps its ID.
-->

### {PREFIX}-003 — Open: a Figma counterpart is expected but not identified

Patterns are expected to have Figma counterparts. Not known yet: which file and node hold this pattern, or when it will exist.
