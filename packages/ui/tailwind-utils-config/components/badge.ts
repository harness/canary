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
        style[`color`] = `var(--cn-set-${themeStyle}-surface-text)`
        combinationStyles[`&:where(.cn-badge-${variant}.cn-badge-${theme})`] = style
      } else if (variant !== 'status') {
        /**
         * Status variant don't need background, color and border
         */
        style[`backgroundColor`] = `var(--cn-set-${themeStyle}-${variant}-bg)`
        style[`color`] = `var(--cn-set-${themeStyle}-${variant}-text)`
        style[`borderColor`] =
          `var(--cn-set-${themeStyle}-${variant}-border, var(--cn-set-${themeStyle}-${variant}-bg))`

        combinationStyles[`&:where(.cn-badge-${variant}.cn-badge-${theme})`] = style
      } else {
        // Add status circle styles for each theme
        statusCircleStyles[`&.cn-badge-status.cn-badge-${theme} > .cn-badge-indicator`] = {
          backgroundColor: `var(--cn-set-${themeStyle}-solid-bg)`
        }
      }
    })
  })

  return { ...combinationStyles, ...statusCircleStyles }
}

export default {
  '.cn-badge': {
    paddingBlock: 'var(--cn-badge-md-py)',
    paddingInline: 'var(--cn-badge-md-px)',
    gap: 'var(--cn-badge-md-gap)',
    minWidth: 'fit-content',
    '@apply select-none font-body-single-line-normal truncate': '',

    /** Size */
    '&:where(.cn-badge-sm)': {
      gap: 'var(--cn-badge-sm-gap)',
      paddingBlock: 'var(--cn-badge-sm-py)',
      paddingInline: 'var(--cn-badge-sm-px)',
      '@apply font-caption-single-line-normal': ''
    },

    '&:where(.cn-badge-ghost)': {
      padding: '0',
      border: 'none'
    },

    '&:where(:not(.cn-badge-status, .cn-badge-ghost))': {
      height: 'var(--cn-badge-size-md)',
      borderRadius: 'var(--cn-badge-radius)',
      border: 'var(--cn-badge-border) solid var(--cn-set-gray-surface-border)',

      '&:where(.cn-badge-sm)': {
        height: 'var(--cn-badge-size-sm)'
      }
    },

    '&:where(.cn-badge-status, .cn-badge-ghost)': {
      '@apply font-body-normal': '',

      '&:where(.cn-badge-sm)': {
        '@apply font-caption-normal': ''
      }
    },

    '&:where(.cn-badge-counter)': {
      color: 'var(--cn-set-gray-surface-text)',
      borderRadius: 'var(--cn-badge-counter-radius)',
      borderColor: 'var(--cn-set-gray-surface-border)',
      backgroundColor: 'var(--cn-set-gray-surface-bg)',
      height: 'var(--cn-badge-counter-size-sm)',
      paddingBlock: 'var(--cn-badge-counter-py)',
      paddingInline: 'var(--cn-badge-counter-px)',
      '@apply font-caption-single-line-normal': ''
    },

    '&:where(.cn-badge-status)': {
      gap: 'var(--cn-badge-status-gap)',
      color: 'var(--cn-text-1)',
      padding: '0',

      '> .cn-badge-indicator': {
        width: 'var(--cn-badge-indicator-size-sm)',
        height: 'var(--cn-badge-indicator-size-sm)',
        backgroundColor: 'var(--cn-set-gray-solid-bg)'
      }
    },

    ':where(.cn-badge-icon)': {
      '@apply cn-icon cn-icon-sm': ''
    },

    /** Variants */
    ...createBadgeVariantStyles()
  }
}
