# ADR 0001: Normalize contract intent and evidence

- Status: Accepted
- Date: 2026-08-14
- Schema: 0.5.0

## Decision

Canary component contracts contain approved, portable component intent. Verification results, publication dates, and discovery candidates live outside the contract as evidence. Consumer-specific APIs live under their surface extension. Canonical content uses first-class slots, structured examples, compact presentation relationships, and token IDs that resolve through the catalog token registry.

The contract declares auditable `evaluations` once. Supported product states live separately in `constraints.combinations`, and audit receipts are generated from external verification records referenced by `evidenceReferences`. Canary Copilot consumes those names directly. Production React and Figma generation remains gated until this model is proven across five meaningfully different component pilots.

## Consequences

- A contract diff represents an approved change to component meaning, not a new audit run.
- Audit evidence can be refreshed without versioning the component contract.
- React-only API details do not masquerade as portable component properties.
- Generators receive explicit slots, examples, presentation relationships, and resolvable token references.
- Schema 0.3.0 and 0.4.0 are no longer accepted by the runtime validator.
- Numeric health remains a pilot evidence score; findings and coverage are presented before it.
- Draft contracts may omit optional metadata collections; later lifecycle stages still require evidence references and complete health-dimension coverage.
