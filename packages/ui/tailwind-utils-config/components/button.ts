import { CSSRuleObject } from 'tailwindcss/types/config'

/** Variants */
const variants = ['solid', 'soft', 'surface', 'ghost'] as const

const themes = ['success', 'danger', 'muted', 'primary'] as const

const themeStyleMapper: Record<(typeof themes)[number], string> = {
  success: 'green',
  danger: 'red',
  muted: 'gray',
  primary: 'brand'
}

function createButtonVariantStyles() {
  const combinationStyles: CSSRuleObject = {}
  const separatorStyles: CSSRuleObject = {}

  variants.forEach(variant => {
    themes.forEach(theme => {
      // Skip solid variant for success and danger themes
      if (variant === 'solid' && (theme === 'success' || theme === 'danger')) {
        return
      }

      const style: CSSRuleObject = {}

      const themeStyle = themeStyleMapper[theme as keyof typeof themeStyleMapper]

      /**
       * Ghost variant has no background and border.
       * It displays text color as same as surface variant.
       * Hover and active states are added for ghost variant based on surface variant.
       */
      if (variant === 'ghost') {
        style[`color`] = `var(--cn-set-${themeStyle}-surface-text)`
        style[`&:hover:not(:disabled, .cn-button-disabled)`] = {
          backgroundColor: `var(--cn-set-${themeStyle}-surface-bg-hover)`
        }

        style[`&:active:not(:disabled, .cn-button-disabled), &:where(.cn-button-active)`] = {
          backgroundColor: `var(--cn-set-${themeStyle}-surface-bg-selected)`
        }
      } else {
        // Default styles
        style[`backgroundColor`] = `var(--cn-set-${themeStyle}-${variant}-bg)`
        style[`color`] = `var(--cn-set-${themeStyle}-${variant}-text)`
        style[`borderColor`] =
          `var(--cn-set-${themeStyle}-${variant}-border, var(--cn-set-${themeStyle}-${variant}-bg))`

        // Hover styles
        style[`&:hover:not(:disabled, .cn-button-disabled)`] = {
          backgroundColor: `var(--cn-set-${themeStyle}-${variant}-bg-hover, var(--cn-set-${themeStyle}-${variant}-bg))`
        }

        // Active styles
        style[`&:active:not(:disabled, .cn-button-disabled), &:where(.cn-button-active)`] = {
          backgroundColor: `var(--cn-set-${themeStyle}-${variant}-bg-selected, var(--cn-set-${themeStyle}-${variant}-bg))`
        }

        separatorStyles[`&:where(.cn-button-split-dropdown.cn-button-${variant}.cn-button-${theme})`] = {
          '&::before': {
            /**
             * Some variants don't have separator
             * Hence adding border color for separator
             *  */
            backgroundColor: `var(--cn-set-${themeStyle}-${variant}-separator, var(--cn-set-${themeStyle}-${variant}-border))`
          }
        }
      }

      combinationStyles[`&:where(.cn-button-${variant}.cn-button-${theme})`] = style
    })
  })

  return { ...combinationStyles, ...separatorStyles }
}

export default {
  '.cn-button': {
    transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke',
    borderRadius: 'var(--cn-btn-default-radius)',
    paddingBlock: 'var(--cn-btn-py-default)',
    paddingInline: 'var(--cn-btn-px-default)',
    height: 'var(--cn-btn-size-default)',
    gap: 'var(--cn-btn-gap-default)',
    border: 'var(--cn-btn-border) solid var(--cn-set-gray-surface-border)',
    '@apply font-body-single-line-strong select-none overflow-hidden inline-flex items-center justify-center whitespace-nowrap':
      '',

    '&:where(.cn-button-split-dropdown)': {
      height: 'var(--cn-btn-size-default)',
      width: 'var(--cn-btn-size-default)',
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
    '&:where(.cn-button-sm)': {
      height: 'var(--cn-btn-size-sm)',
      padding: 'var(--cn-btn-py-sm) var(--cn-btn-px-sm)',
      gap: 'var(--cn-btn-gap-sm)',
      '@apply font-caption-single-line-normal': ''
    },
    '&:where(.cn-button-lg)': {
      height: 'var(--cn-btn-size-lg)',
      paddingBlock: 'var(--cn-btn-py-lg)',
      paddingInline: 'var(--cn-btn-px-lg)',
      gap: 'var(--cn-btn-gap-lg)'
    },

    // AI button
    '&:where(.cn-button-ai)': {
      color: 'var(--cn-set-ai-surface-text)',
      backgroundImage: `linear-gradient(to right, var(--cn-set-ai-surface-bg), var(--cn-set-ai-surface-bg)), var(--cn-set-ai-surface-border)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      border: 'var(--cn-badge-border) solid transparent',

      '&:hover:not(:disabled, .cn-button-disabled)': {
        backgroundImage: `linear-gradient(to right, var(--cn-set-ai-surface-bg-hover), var(--cn-set-ai-surface-bg-hover)), var(--cn-set-ai-surface-border)`
      },
      '&:active:not(:disabled, .cn-button-disabled), &:where(.cn-button-active)': {
        backgroundImage: `linear-gradient(to right, var(--cn-set-ai-surface-bg-selected), var(--cn-set-ai-surface-bg-selected)), var(--cn-set-ai-surface-border)`
      }
    },

    // Ghost style
    '&:where(.cn-button-ghost)': {
      border: 'none',
      color: 'var(--cn-set-gray-surface-text)',

      '&:hover:not(:disabled, .cn-button-disabled)': {
        backgroundColor: 'var(--cn-set-gray-surface-bg-hover)'
      },
      '&:active:not(:disabled, .cn-button-disabled)': {
        backgroundColor: 'var(--cn-set-gray-surface-bg-selected)'
      }
    },

    ...createButtonVariantStyles(),

    // Rounded
    '&:where(.cn-button-rounded)': {
      borderRadius: 'var(--cn-btn-rounded-radius)'
    },

    // Icon Only
    '&:where(.cn-button-icon-only)': {
      width: 'var(--cn-btn-size-default)',
      height: 'var(--cn-btn-size-default)'
    },

    // Icon Only sizing
    '&:where(.cn-button-icon-only.cn-button-sm)': {
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
    '&:where(:disabled, .cn-button-disabled)': {
      cursor: 'not-allowed',
      opacity: 'var(--cn-disabled-opacity)'
    },

    '&:where(.cn-button-link, .cn-button-transparent)': {
      border: 'none',

      '&:where(:not(.cn-button-icon-only))': {
        padding: '0'
      }
    },

    // link variant
    '&:where(.cn-button-link)': {
      color: 'var(--cn-comp-link-text)',
      '@apply underline-offset-2': '',

      '&:where(:not(:disabled, .cn-button-disabled):hover)': {
        color: 'var(--cn-comp-link-text-hover)'
      },

      // active
      '&:where(:not(:disabled, .cn-button-disabled):active)': {
        color: 'var(--cn-comp-link-text)'
      },

      // sm size
      '&:where(.cn-button-sm)': {
        gap: 'var(--cn-btn-gap-sm)',
        padding: '0'
      }
    },

    // transparent variant
    '&:where(.cn-button-transparent)': {
      color: 'var(--cn-text-2)',
      backgroundColor: 'transparent',

      '&:where(:not(:disabled, .cn-button-disabled):hover, :not(:disabled, .cn-button-disabled):active)': {
        color: 'var(--cn-text-1)'
      }
    }
  }
}
