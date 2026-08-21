# UUI-3159 — Line-Height Grid Hygiene: Mapping Reference

Working reference for migrating the line-height token scale onto a fixed 4px grid.
Branch: `feat/UUI-3159-line-height-grid-hygiene-clean` · PR #11335

**Legend:** ✅ applied · 🟡 needs a decision · _Uses_ = live styles currently painting with the token

---

## 1. Target scale — fixed 4px-grid values

| px | rem |
|----|-----|
| 12 | 0.75rem |
| 16 | 1rem |
| 20 | 1.25rem |
| 24 | 1.5rem |
| 28 | 1.75rem |
| 32 | 2rem |
| 36 | 2.25rem |
| 40 | 2.5rem |
| ~108 | 6.75rem (display outlier) |

## 2. Group A — `multiplier` (unitless ratios; retire with Group C)

| Variable | Value |
|----------|-------|
| `lineHeight.multiplier.none` | 1.14 |
| `lineHeight.multiplier.tight` | 1.25 |
| `lineHeight.multiplier.snug` | 1.428 |
| `lineHeight.multiplier.normal` | 1.5 |
| `lineHeight.multiplier.relaxed` | 1.625 |
| `lineHeight.multiplier.loose` | 1.75 |

## 3. Group C — in-place redefine (`fontSize × multiplier` → fixed 4px)

| Token | Before | After | px | Shift | Uses | Status |
|-------|-------:|------:|---:|------:|:----:|:------|
| `lineHeight.1.none` | 11.69px | 0.75rem | 12 | −0.31 | 2 | ✅ applied |
| `lineHeight.3.none` | 14.37px | 16px | 16 | −1.63 | 2 | pending |
| `lineHeight.4.none` | 14.83px | 16px | 16 | −1.17 | 6 | pending |
| `lineHeight.2.normal` | 17.26px | 16px | 16 | +1.26 | 1 | pending |
| `lineHeight.5.tight` | 17.50px | 16px | 16 | +1.50 | 3 | pending |
| 🟡 `lineHeight.3.snug` | 18.00px | 20px | 20 | −2.00 | 1 | pending (tie 16/20) |
| `lineHeight.6.none` | 18.24px | 20px | 20 | −1.76 | 1 | pending |
| `lineHeight.4.snug` | 18.58px | 20px | 20 | −1.42 | 4 | pending |
| `lineHeight.4.normal` | 19.51px | 1.25rem | 20 | −0.49 | 4 | ✅ applied |
| `lineHeight.5.snug` | 19.99px | 1.25rem | 20 | −0.01 | 6 | ✅ applied |
| `lineHeight.6.tight` | 20.00px | 1.25rem | 20 | 0.00 | 1 | ✅ applied |
| `lineHeight.5.normal` | 21.00px | 20px | 20 | +1.00 | 1 | pending |
| `lineHeight.7.tight` | 22.50px | 24px | 24 | −1.50 | 0 | pending |
| `lineHeight.5.relaxed` | 22.75px | 24px | 24 | −1.25 | 2 | pending |
| `lineHeight.8.none` | 22.80px | 24px | 24 | −1.20 | 1 | pending |
| `lineHeight.6.snug` | 22.85px | 24px | 24 | −1.15 | 1 | pending |
| `lineHeight.6.normal` | 24.00px | 1.5rem | 24 | 0.00 | 2 | ✅ applied |
| `lineHeight.8.tight` | 25.00px | 24px | 24 | +1.00 | 1 | pending |
| `lineHeight.7.snug` | 25.70px | 24px | 24 | +1.70 | 2 | pending |
| 🟡 `lineHeight.6.relaxed` | 26.00px | 24px | 24 | +2.00 | 2 | pending (tie 24/28) |
| 🟡 `lineHeight.8.normal` | 30.00px | 28px | 28 | +2.00 | 0 | pending (tie 28/32) |
| `lineHeight.10.none` | 31.92px | 2rem | 32 | −0.08 | 2 | ✅ applied |
| `lineHeight.9.snug` | 34.27px | 36px | 36 | −1.73 | 1 | pending |
| `lineHeight.10.tight` | 35.00px | 36px | 36 | −1.00 | 1 | pending |
| `lineHeight.9.normal` | 36.00px | 2.25rem | 36 | 0.00 | 1 | ✅ applied |
| `lineHeight.10.snug` | 39.98px | 2.5rem | 40 | −0.02 | 1 | ✅ applied |
| 🟡 `lineHeight.15.none` | 109.44px | 108px | 108 | +1.44 | 1 | pending (display) |

## 4. Decisions needed (4 ties)

| Token | Sits at | Options | Note |
|-------|--------:|---------|------|
| `lineHeight.3.snug` | 18.00px | 16 or 20 | dead-center tie |
| `lineHeight.6.relaxed` | 26.00px | 24 or 28 | tie; multi-line markdown body (higher risk) |
| `lineHeight.8.normal` | 30.00px | 28 or 32 | tie; 0 uses (low stakes) |
| `lineHeight.15.none` | 109.44px | 108 or 112 | display size; does it belong on the strict grid? |

## 5. Status

- **8 / 27** Group C tokens redefined in place (≤0.5px invisible tier) — ✅ in PR #11335
- **19** remaining: 15 unambiguous rounders + 4 🟡 ties
- Final step (after all 27 fixed): delete Group A (multiplier) and the orphaned Group B fixed tokens, plus `$themes.json` multiplier cleanup
