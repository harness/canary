---
domain: {component-kebab}
prefix: {PREFIX}
version: 0.1.0
manifest: ./{component-kebab}.manifest.json
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
    title: '[TK] Open question title'
    status: open
---

# {ComponentName} Guide

<!--
Notes for authors. Comments like this one never reach the agent reference.

The front matter above is the only source for each rule's id, title, status, tier and check. Headings below repeat the id and title exactly and carry prose only.
-->

Rules for when and how to use `{ComponentName}`. The component API (props, variants, defaults, tokens) lives in `{component-kebab}.manifest.json`.

## Architecture: Do's and Do Not's

### Do's

- [TK]

### Do Not's

- [TK]

## {PREFIX}-001 — [TK] Rule title, stated as the rule itself

[TK] One to three sentences: what the rule says and why it matters.

## {PREFIX}-002 — [TK] Rule title

[TK]

## Known gaps

Open questions that keep their rule IDs but are not rules yet.

### {PREFIX}-003 — [TK] Open question title

[TK] What is unresolved, the evidence, and who needs to decide.
