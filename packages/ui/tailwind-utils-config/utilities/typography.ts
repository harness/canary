/**
 * Composite typography utilities (`.font-*`), also consumed by the `<Text>` component.
 *
 * Each variant declares the optical WEIGHT bucket it resolves to and its
 * letter-spacing (TRACKING).
 *
 * NOTE: `weight` mirrors the composite token's `fontWeight` in
 * core-design-system/design-tokens/breakpoint/desktop.json. The CSS `font`
 * shorthand doesn't carry letter-spacing, so tracking is applied here rather than
 * by the token — keep the two in sync.
 */

type FontWeightBucket = 'regular' | 'medium' | 'bold'
type Tracking = 'tight' | 'normal' | 'wide'

interface FontVariant {
  /** Utility suffix → `.font-<name>`. */
  name: string
  /** CSS custom property holding the `font` shorthand. Defaults to `--cn-<name>`. */
  cssVar?: string
  /** Optical weight bucket the composite token resolves to. */
  weight: FontWeightBucket
  /** Letter-spacing. Omitted = none. */
  tracking?: Tracking
}

const FONT_VARIANTS: FontVariant[] = [
  { name: 'heading-hero', weight: 'medium', tracking: 'tight' },
  { name: 'heading-section', weight: 'medium', tracking: 'tight' },
  { name: 'heading-default', weight: 'medium', tracking: 'tight' },
  { name: 'heading-subsection', weight: 'medium', tracking: 'tight' },
  { name: 'heading-base', weight: 'medium', tracking: 'tight' },
  { name: 'heading-small', weight: 'medium', tracking: 'normal' },
  { name: 'body-normal', weight: 'regular', tracking: 'normal' },
  { name: 'body-strong', weight: 'medium', tracking: 'normal' },
  { name: 'body-code', weight: 'regular', tracking: 'normal' },
  { name: 'body-code-strong', weight: 'bold', tracking: 'normal' },
  { name: 'caption-normal', weight: 'regular', tracking: 'normal' },
  { name: 'caption-strong', weight: 'medium', tracking: 'normal' },
  { name: 'caption-code', weight: 'regular', tracking: 'normal' },
  { name: 'caption-code-strong', weight: 'bold', tracking: 'normal' },
  { name: 'link-default', cssVar: 'comp-link-default', weight: 'regular' },
  { name: 'link-sm', cssVar: 'comp-link-sm', weight: 'medium' },
  { name: 'body-single-line-strong', weight: 'medium', tracking: 'tight' },
  { name: 'body-single-line-normal', weight: 'regular', tracking: 'tight' },
  { name: 'caption-single-line-normal', weight: 'regular', tracking: 'normal' },
  { name: 'dialog-title', cssVar: 'comp-dialog-title', weight: 'medium' },
  { name: 'micro-normal', weight: 'regular', tracking: 'wide' },
  { name: 'micro-regular', weight: 'regular', tracking: 'wide' }
]

const buildFontUtilities = (variants: FontVariant[]): Record<string, Record<string, string>> => {
  const utilities: Record<string, Record<string, string>> = {}

  for (const { name, cssVar, tracking } of variants) {
    const style: Record<string, string> = {
      font: `var(--cn-${cssVar ?? name})`
    }
    if (tracking) {
      style.letterSpacing = `var(--cn-tracking-${tracking})`
    }

    utilities[`&-${name}`] = style
  }

  return utilities
}

export const typography = {
  '.font': buildFontUtilities(FONT_VARIANTS)
}
