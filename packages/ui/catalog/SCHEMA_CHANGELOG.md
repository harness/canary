# Contract schema changelog

## 0.5.0 — 2026-08-14

- Separated normative contract intent from dated verification evidence.
- Moved React-only props into `surfaces.react.extensions`.
- Renamed canonical React `children` meaning to portable `content`.
- Added first-class `slots`, structured `examples`, and `presentation`.
- Replaced prose token references with registry-backed `tokenId` values.
- Consolidated accessibility and health declarations into canonical `evaluations`.
- Renamed support-matrix entries to `constraints.combinations` so they cannot be confused with health evaluations.
- Renamed contract evidence pointers to `evidenceReferences`; dated outcomes remain external.
- Defaulted optional metadata collections so authors do not write placeholder empty arrays.
- Grouped field-reference ownership and consumers by top-level section and corrected referenced scalar types.
- Removed CSS display mechanisms from canonical presentation; logical direction and alignment remain portable intent.
- Removed Figma discovery candidates from the authoritative contract.
- Removed runtime support for schema 0.3.0 and 0.4.0.

Migration is intentionally breaking. Existing contracts must be migrated before validation; no compatibility adapter is provided for authoring.
