import { CSSRuleObject } from 'tailwindcss/types/config'

/** Variants */
const variants = ['solid', 'soft', 'surface'] as const

const themes = ['success', 'danger', 'muted', 'primary', 'ai'] as const

const themeStyleMapper: Record<Exclude<(typeof themes)[number], 'ai'>, string> = {
  success: 'green',
  danger: 'red',
  muted: 'gray',
  primary: 'brand'
}

function createButtonVariantStyles() {
  // Exclude "ai" theme from themes
  const aiFilteredThemes = themes.filter(theme => theme !== 'ai')

  // Exclude "counter" variant from variants
  // const counterFilteredVariants = variants.filter(variant => variant !== 'counter')

  const combinationStyles: CSSRuleObject = {}

  variants.forEach(variant => {
    aiFilteredThemes.forEach(theme => {
      // Skip solid variant for success and danger themes
      if (variant === 'solid' && (theme === 'success' || theme === 'danger')) {
        return
      }

      const style: CSSRuleObject = {}

      const themeStyle = themeStyleMapper[theme as keyof typeof themeStyleMapper]

      // Default styles
      style[`backgroundColor`] = `var(--cn-set-${themeStyle}-${variant}-bg)`
      style[`color`] = `var(--cn-set-${themeStyle}-${variant}-text)`
      style[`borderColor`] = `var(--cn-set-${themeStyle}-${variant}-border)`

      // Hover styles
      style[`&:hover:not([disabled])`] = {
        backgroundColor: `var(--cn-set-${themeStyle}-${variant}-bg-hover, var(--cn-set-${themeStyle}-${variant}-bg))`
      }

      // Active styles
      style[`&:active:not([disabled])`] = {
        backgroundColor: `var(--cn-set-${themeStyle}-${variant}-bg-selected, var(--cn-set-${themeStyle}-${variant}-bg))`
      }

      combinationStyles[`&:where(.button-${variant}.button-${theme})`] = style
    })
  })

  return { ...combinationStyles }
}

console.log('createButtonVariantStyles: ', createButtonVariantStyles())

export default {
  '.button': {
    borderRadius: 'var(--cn-btn-default-radius)',
    padding: 'var(--cn-btn-py-default) var(--cn-btn-px-default)',
    height: 'var(--cn-btn-size-default)',
    gap: 'var(--cn-btn-gap-default)',
    border: 'var(--cn-btn-border) solid black',
    '@apply font-body-none-strong': '',

    /**
     * Disabled state is common for all variants.
     * So it is not added with :where
     */
    '&:disabled': {
      color: 'var(--cn-state-disabled-text)',
      borderColor: 'var(--cn-state-disabled-border)',

      '&:not(.button-ghost)': {
        backgroundColor: 'var(--cn-state-disabled-bg)'
      }
    },

    // Rounded
    '&:where(.button-rounded)': {
      borderRadius: 'var(--cn-btn-rounded-radius)'
    },

    // sizes
    '&:where(.button-sm)': {
      height: 'var(--cn-btn-size-sm)',
      padding: 'var(--cn-btn-py-sm) var(--cn-btn-px-sm)',
      gap: 'var(--cn-btn-gap-sm)',
      '@apply font-caption-none-normal': ''
    },
    '&:where(.button-lg)': {
      height: 'var(--cn-btn-size-lg)',
      padding: 'var(--cn-btn-py-lg) var(--cn-btn-px-lg)',
      gap: 'var(--cn-btn-gap-lg)'
    },

    // AI button
    '&:where(.button-ai)': {
      color: 'var(--cn-set-ai-surface-text)',
      backgroundImage: `linear-gradient(to right, var(--cn-set-ai-surface-bg), var(--cn-set-ai-surface-bg)), var(--cn-set-ai-surface-border)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      border: 'var(--cn-badge-border) solid transparent',

      '&:hover:not([disabled])': {
        backgroundImage: `linear-gradient(to right, var(--cn-set-ai-surface-bg-hover), var(--cn-set-ai-surface-bg-hover)), var(--cn-set-ai-surface-border)`
      },
      '&:active:not([disabled])': {
        backgroundImage: `linear-gradient(to right, var(--cn-set-ai-surface-bg-selected), var(--cn-set-ai-surface-bg-selected)), var(--cn-set-ai-surface-border)`
      }
    },

    // Ghost style
    '&:where(.button-ghost)': {
      border: 'none',
      color: 'var(--cn-set-gray-surface-text)',

      '&:hover:not([disabled])': {
        backgroundColor: 'var(--cn-set-gray-surface-bg-hover)'
      },
      '&:active:not([disabled])': {
        backgroundColor: 'var(--cn-set-gray-surface-bg-selected)'
      }
    },

    ...createButtonVariantStyles()
  }
}
