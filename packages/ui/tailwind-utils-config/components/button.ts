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

  const combinationStyles: CSSRuleObject = {}
  const separatorStyles: CSSRuleObject = {}

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
      style[`borderColor`] = `var(--cn-set-${themeStyle}-${variant}-border, var(--cn-set-${themeStyle}-${variant}-bg))`

      // Hover styles
      style[`&:hover:not([disabled], .button-disabled)`] = {
        backgroundColor: `var(--cn-set-${themeStyle}-${variant}-bg-hover, var(--cn-set-${themeStyle}-${variant}-bg))`
      }

      // Active styles
      style[`&:active:not([disabled], .button-disabled), &:where(.button-active)`] = {
        backgroundColor: `var(--cn-set-${themeStyle}-${variant}-bg-selected, var(--cn-set-${themeStyle}-${variant}-bg))`
      }

      separatorStyles[`&:where(.button-split-dropdown.button-${variant}.button-${theme})`] = {
        '&::before': {
          /**
           * Some variants don't have separator
           * Hence adding border color for separator
           *  */
          backgroundColor: `var(--cn-set-${themeStyle}-${variant}-separator, var(--cn-set-${themeStyle}-${variant}-border))`
        }
      }

      combinationStyles[`&:where(.button-${variant}.button-${theme})`] = style
    })
  })

  return { ...combinationStyles, ...separatorStyles }
}

export default {
  '.button': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease-in-out',
    borderRadius: 'var(--cn-btn-default-radius)',
    padding: 'var(--cn-btn-py-default) var(--cn-btn-px-default)',
    height: 'var(--cn-btn-size-default)',
    gap: 'var(--cn-btn-gap-default)',
    border: 'var(--cn-btn-border) solid black',
    '@apply font-body-tight-strong': '',

    '&:where(.button-split-dropdown)': {
      height: 'var(--cn-btn-size-icon)',
      width: 'var(--cn-btn-size-icon)',
      position: 'relative',
      '@apply rounded-l-none border-l-0': '',

      '&::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        height: 'calc(100% - 8px)',
        width: 'var(--cn-btn-border)'
      }
    },

    // sizes
    '&:where(.button-sm)': {
      height: 'var(--cn-btn-size-sm)',
      padding: 'var(--cn-btn-py-sm) var(--cn-btn-px-sm)',
      gap: 'var(--cn-btn-gap-sm)',
      '@apply font-caption-tight-normal': ''
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

      '&:hover:not([disabled], .button-disabled)': {
        backgroundImage: `linear-gradient(to right, var(--cn-set-ai-surface-bg-hover), var(--cn-set-ai-surface-bg-hover)), var(--cn-set-ai-surface-border)`
      },
      '&:active:not([disabled], .button-disabled), &:where(.button-active)': {
        backgroundImage: `linear-gradient(to right, var(--cn-set-ai-surface-bg-selected), var(--cn-set-ai-surface-bg-selected)), var(--cn-set-ai-surface-border)`
      }
    },

    // Ghost style
    '&:where(.button-ghost)': {
      border: 'none',
      color: 'var(--cn-set-gray-surface-text)',

      '&:hover:not([disabled], .button-disabled)': {
        backgroundColor: 'var(--cn-set-gray-surface-bg-hover)'
      },
      '&:active:not([disabled], .button-disabled)': {
        backgroundColor: 'var(--cn-set-gray-surface-bg-selected)'
      }
    },

    ...createButtonVariantStyles(),

    // Rounded
    '&:where(.button-rounded)': {
      borderRadius: 'var(--cn-btn-rounded-radius)'
    },

    // Icon Only
    '&:where(.button-icon-only)': {
      width: 'var(--cn-btn-size-icon)',
      height: 'var(--cn-btn-size-icon)'
    },

    // Icon Only sizing
    '&:where(.button-icon-only.button-sm)': {
      width: 'var(--cn-btn-size-sm)',
      height: 'var(--cn-btn-size-sm)'
    },

    // Focus
    '&:where(:focus-visible)': {
      boxShadow: 'var(--cn-ring-focus)',
      outline: 'none',

      // This is to prevent focus outline from being hidden by dropdown
      position: 'relative',
      zIndex: '1'
    },

    /**
     * Disabled state is common for all variants.
     * So it is not added with :where
     */
    '&:where(:disabled), &:where(.button-disabled)': {
      color: 'var(--cn-state-disabled-text)',
      borderColor: 'var(--cn-state-disabled-border)',
      cursor: 'not-allowed',

      '&:not(.button-ghost)': {
        backgroundColor: 'var(--cn-state-disabled-bg)'
      },

      // Disabled split dropdown
      '&:where(.button-split-dropdown)': {
        '&::before': {
          backgroundColor: 'var(--cn-state-disabled-border)'
        }
      }
    },

    // link variant
    '&:where(.button-link)': {
      color: 'var(--cn-comp-link-default)',
      border: 'none',
      height: 'auto',
      gap: 'var(--cn-btn-gap-default)',
      padding: 'var(--cn-btn-link-py-default) 0',
      '@apply underline-offset-2 font-body-tight-normal': '',
      '&:hover': {
        '@apply underline': ''
      },

      // sm size
      '&:where(.button-sm)': {
        height: 'auto',
        gap: 'var(--cn-btn-gap-sm)',
        padding: 'var(--cn-btn-link-py-sm) 0',
        '@apply font-caption-tight-soft': ''
      },

      // disabled
      '&:where(:disabled), &:where(.button-disabled)': {
        color: 'var(--cn-state-disabled-text)',
        cursor: 'not-allowed'
      }
    }
  }
}
