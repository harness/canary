/**
 * Composite typography utilities (`.font-*`), also consumed by the `<Text>` component.
 *
 * Each variant declares the optical WEIGHT bucket it resolves to and its base
 * letter-spacing (TRACKING). `buildFontUtilities` enforces one invariant:
 *
 *   the bold (700) bucket ALWAYS pairs with wide tracking.
 *
 * Mark a variant `bold` and it automatically gets `tracking-wide`, regardless of
 * its base tracking — so no bold text style can ship with tighter spacing. No
 * variant is bold today, so this currently changes nothing; it's a guardrail for
 * the future.
 *
 * NOTE: `weight` mirrors the composite token's `fontWeight` in
 * core-design-system/design-tokens/breakpoint/desktop.json. The CSS `font`
 * shorthand doesn't carry letter-spacing, so tracking is applied here rather than
 * by the token — keep the two in sync.
 */

type FontWeightBucket = 'regular' | 'semibold' | 'bold'
type Tracking = 'tight' | 'normal' | 'wide'

interface FontVariant {
  /** Utility suffix → `.font-<name>`. */
  name: string
  /** CSS custom property holding the `font` shorthand. Defaults to `--cn-<name>`. */
  cssVar?: string
  /** Optical weight bucket the composite token resolves to. */
  weight: FontWeightBucket
  /** Base letter-spacing. Omitted = none. Forced to `wide` when `weight` is `bold`. */
  tracking?: Tracking
}

const FONT_VARIANTS: FontVariant[] = [
  { name: 'heading-hero', weight: 'semibold', tracking: 'tight' },
  { name: 'heading-section', weight: 'semibold', tracking: 'tight' },
  { name: 'heading-default', weight: 'semibold', tracking: 'tight' },
  { name: 'heading-subsection', weight: 'semibold', tracking: 'tight' },
  { name: 'heading-base', weight: 'semibold', tracking: 'tight' },
  { name: 'heading-small', weight: 'semibold', tracking: 'normal' },
  { name: 'body-normal', weight: 'regular', tracking: 'tight' },
  { name: 'body-strong', weight: 'semibold', tracking: 'normal' },
  { name: 'body-code', weight: 'regular', tracking: 'tight' },
  { name: 'caption-normal', weight: 'regular', tracking: 'normal' },
  { name: 'caption-strong', weight: 'semibold', tracking: 'normal' },
  { name: 'caption-code', weight: 'regular', tracking: 'normal' },
  { name: 'link-default', cssVar: 'comp-link-default', weight: 'regular' },
  { name: 'link-sm', cssVar: 'comp-link-sm', weight: 'semibold' },
  { name: 'body-single-line-strong', weight: 'semibold', tracking: 'normal' },
  { name: 'body-single-line-normal', weight: 'regular', tracking: 'normal' },
  { name: 'caption-single-line-normal', weight: 'regular', tracking: 'normal' },
  { name: 'dialog-title', cssVar: 'comp-dialog-title', weight: 'semibold' },
  { name: 'micro-normal', weight: 'regular', tracking: 'wide' }
]

const buildFontUtilities = (variants: FontVariant[]): Record<string, Record<string, string>> => {
  const utilities: Record<string, Record<string, string>> = {}

  for (const { name, cssVar, weight, tracking } of variants) {
    // The invariant: bold always reads with wide tracking.
    const resolvedTracking: Tracking | undefined = weight === 'bold' ? 'wide' : tracking

    const style: Record<string, string> = {
      font: `var(--cn-${cssVar ?? name})`
    }
    if (resolvedTracking) {
      style.letterSpacing = `var(--cn-tracking-${resolvedTracking})`
    }

    utilities[`&-${name}`] = style
  }

  return utilities
}

export const typography = {
  '.font': buildFontUtilities(FONT_VARIANTS)
}
