import { CSSRuleObject } from 'tailwindcss/types/config'

/** Variants */
const variants = ['solid', 'soft', 'surface']

/**
 *  Themes
 *
 * "ai" theme is not allowed with variant.
 *  If any variant is specified, TS will throw an error.
 *
 *  ✅ <Badge theme="ai">AI Theme</Badge>
 *  ❌ <Badge theme="ai" variant="solid">Invalid</Badge>
 *
 *  */
const themes = ['success', 'info', 'warning', 'destructive', 'primary', 'muted', 'merged', 'ai'] as const

const themeStyleMapper: Record<Exclude<(typeof themes)[number], 'ai'>, string> = {
  success: 'green',
  info: 'blue',
  warning: 'yellow',
  destructive: 'red',
  primary: 'brand',
  muted: 'gray',
  merged: 'purple'
}

function createBadgeVariantStyles() {
  // Exclude "ai" theme from variants
  const aiFilteredThemes = themes.filter(theme => theme !== 'ai')
  const combinationStyles: CSSRuleObject = {}

  variants.forEach(variant => {
    aiFilteredThemes.forEach(theme => {
      const style: CSSRuleObject = {}

      const themeStyle = themeStyleMapper[theme as keyof typeof themeStyleMapper]

      style[`backgroundColor`] = `var(--cn-set-${themeStyle}-${variant}-bg)`
      style[`color`] = `var(--cn-set-${themeStyle}-${variant}-text)`
      style[`borderColor`] = `var(--cn-set-${themeStyle}-${variant}-border)`

      combinationStyles[`&.badge-${variant}.badge-${theme}`] = style
    })
  })

  return combinationStyles
}

export default {
  '.badge': {
    padding: 'var(--cn-badge-status-py) var(--cn-badge-default-px)',
    gap: 'var(--cn-badge-default-gap)',
    height: 'var(--cn-badge-size-default)',
    borderRadius: 'var(--cn-badge-radius)',
    border: '1px solid var(--cn-set-gray-solid-border)',
    '@apply select-none pointer-events-none': '',

    /** Size */
    '&-sm': {
      height: 'var(--cn-badge-size-sm)',
      gap: 'var(--cn-badge-sm-gap)',
      padding: 'var(--cn-badge-sm-px)',
      '@apply font-caption-soft': ''
    },

    /**
     * ai theme
     *
     * Excluded from theme createBadgeVariantStyles themes and added here
     */
    '&-ai': {
      color: 'var(--cn-set-ai-surface-text)',
      backgroundImage: `linear-gradient(to right, var(--cn-set-ai-surface-bg), var(--cn-set-ai-surface-bg)), var(--cn-set-ai-surface-border)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      border: '1px solid transparent'
    },

    /** Variants */
    ...createBadgeVariantStyles()
  }
}
