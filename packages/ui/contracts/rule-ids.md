# Rule IDs

Every rule and known gap in a component guide has an ID: the component's prefix, a hyphen and a three-digit number, such as `SBD-001`. Manifests, reviews, tests and lint messages cite rules by ID.

- A component's first rule is `-001`. A new rule takes the next number after the highest the guide has ever used.
- An ID is never reused. When a rule is removed, add its ID to the Retired column.
- When a rule moves to another guide, write its replacement in parentheses after it, such as `SBD-005 (SBP-001)`. The validator then names the replacement wherever the old ID is cited.
- A new component takes a new prefix of two to five capital letters. Add the row here before you scaffold its guide.
- The Component column is the component's code export, the same as `code.export` in its manifest.
- A pattern takes a prefix the same way. Its Component column holds the pattern's name in PascalCase, since a pattern has no code export. Patterns live in `src/patterns/`.

`pnpm ds:validate` reads this table. It fails a guide whose prefix is not listed here, is listed for a different component, or uses a retired ID. `pnpm ds:scaffold` refuses a prefix that is not listed for the component you name.

| Prefix | Component          | Retired                                                                    |
| ------ | ------------------ | -------------------------------------------------------------------------- |
| SBD    | StatusBadge        | SBD-005 (SBP-001), SBD-008 (SBP-003), SBD-014 (SBP-002), SBD-015 (SBP-004) |
| SBP    | StatusBadgePattern |                                                                            |
