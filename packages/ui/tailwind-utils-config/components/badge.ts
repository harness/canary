import { CSSRuleObject } from 'tailwindcss/types/config'

/** Variants */
const variants = ['solid', 'soft', 'surface', 'status', 'ghost'] as const

const themes = ['success', 'info', 'warning', 'danger', 'primary', 'muted', 'merged'] as const

const themeStyleMapper: Record<Exclude<(typeof themes)[number], 'ai'>, string> = {
  success: 'green',
  info: 'blue',
  warning: 'yellow',
  danger: 'red',
  primary: 'brand',
  muted: 'gray',
  merged: 'purple'
}

function createBadgeVariantStyles() {
  // Exclude "counter" variant from variants
  // const counterFilteredVariants = variants.filter(variant => variant !== 'counter')

  const combinationStyles: CSSRuleObject = {}
  const statusCircleStyles: CSSRuleObject = {}

  variants.forEach(variant => {
    themes.forEach(theme => {
      const style: CSSRuleObject = {}

      const themeStyle = themeStyleMapper[theme as keyof typeof themeStyleMapper]

      if (variant === 'ghost') {
        /**
         * "ghost" variant has no background and border.
         * It displays text color as same as surface variant.
         */
        style[`color`] = `var(--cn-set-surface-${variant}-text)`
      } else if (variant !== 'status') {
        /**
         * Status variant don't need background, color and border
         */
        style[`backgroundColor`] = `var(--cn-set-${themeStyle}-${variant}-bg)`
        style[`color`] = `var(--cn-set-${themeStyle}-${variant}-text)`
        style[`borderColor`] =
          `var(--cn-set-${themeStyle}-${variant}-border, var(--cn-set-${themeStyle}-${variant}-bg))`

        combinationStyles[`&:where(.badge-${variant}.badge-${theme})`] = style
      } else {
        // Add status circle styles for each theme
        statusCircleStyles[`&.badge-status.badge-${theme} > .badge-indicator`] = {
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
    padding: '0 var(--cn-badge-default-px)',
    '@apply select-none font-body-tight-normal truncate': '',

    /** Size */
    '&:where(.badge-sm)': {
      height: 'var(--cn-badge-size-sm)',
      gap: 'var(--cn-badge-sm-gap)',
      padding: 'var(--cn-badge-sm-px)',
      '@apply font-caption-tight-normal': ''
    },

    '&:where(.badge-ghost)': {
      height: 'auto',
      padding: '0'
    },

    '&:where(:not(.badge-status))': {
      borderRadius: 'var(--cn-badge-radius)',
      border: 'var(--cn-badge-border) solid var(--cn-set-gray-surface-border)',
      gap: 'var(--cn-badge-default-gap)'
    },

    '&:where(.badge-counter)': {
      color: 'var(--cn-set-gray-surface-text)',
      borderRadius: 'var(--cn-badge-counter-radius)',
      borderColor: 'var(--cn-set-gray-surface-border)',
      backgroundColor: 'var(--cn-set-gray-surface-bg)',
      height: 'var(--cn-badge-counter-size-default)',
      padding: 'var(--cn-badge-counter-py) var(--cn-badge-counter-px)',
      '@apply font-caption-tight-normal': '',

      '&.badge-info': {
        backgroundColor: 'var(--cn-set-blue-surface-bg)',
        color: 'var(--cn-set-blue-surface-text)',
        borderColor: 'var(--cn-set-blue-surface-border)'
      }
    },

    '&:where(.badge-status)': {
      gap: 'var(--cn-badge-status-gap)',
      padding: '0',

      '> .badge-indicator': {
        width: 'var(--cn-badge-indicator-size-default)',
        height: 'var(--cn-badge-indicator-size-default)',
        backgroundColor: 'var(--cn-set-gray-solid-bg)'
      }
    },

    /** Variants */
    ...createBadgeVariantStyles()
  }
}
