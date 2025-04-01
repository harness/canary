import { CSSRuleObject } from 'tailwindcss/types/config'

/** Variants */
const variants = ['solid', 'soft', 'surface', 'status']

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
  const statusCircleStyles: CSSRuleObject = {}

  variants.forEach(variant => {
    aiFilteredThemes.forEach(theme => {
      const style: CSSRuleObject = {}

      const themeStyle = themeStyleMapper[theme as keyof typeof themeStyleMapper]

      /**
       * Status variant don't need background, color and border
       */
      if (variant !== 'status') {
        style[`backgroundColor`] = `var(--cn-set-${themeStyle}-${variant}-bg)`
        style[`color`] = `var(--cn-set-${themeStyle}-${variant}-text)`
        style[`borderColor`] = `var(--cn-set-${themeStyle}-${variant}-border)`

        combinationStyles[`&:where(.badge-${variant}.badge-${theme})`] = style
      } else {
        // Add status circle styles for each theme
        statusCircleStyles[`&.badge-status.badge-${theme}::before`] = {
          backgroundColor: `var(--cn-set-${themeStyle}-solid-bg)`
        }
      }
    })
  })

  return { ...combinationStyles, ...statusCircleStyles }
}

export default {
  '.badge': {
    height: 'var(--cn-badge-size-default)',
    '@apply select-none pointer-events-none': '',

    '&:where(:not(.badge-status))': {
      borderRadius: 'var(--cn-badge-radius)',
      border: '1px solid var(--cn-set-gray-solid-border)',
      gap: 'var(--cn-badge-default-gap)',
      padding: 'var(--cn-badge-status-py) var(--cn-badge-default-px)'
    },

    '&:where(.badge-status)': {
      gap: 'var(--cn-badge-status-gap)',
      padding: 'var(--cn-badge-status-py) var(--cn-badge-status-px)',
      position: 'relative',
      // paddingLeft: 'calc(var(--cn-badge-status-py) + 8px + var(--cn-badge-status-gap))',
      paddingLeft: 'calc(var(--cn-badge-status-px) + 6px + var(--cn-badge-status-gap))',

      '&.badge-sm': {
        paddingLeft: 'calc(10px + var(--cn-badge-status-px))'
      },

      '&::before': {
        content: '""',
        position: 'absolute',
        left: 'var(--cn-badge-status-py)',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: 'var(--cn-set-gray-solid-bg)' // Default color
      }
    },

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
