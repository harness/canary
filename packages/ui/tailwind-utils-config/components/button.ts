import { CSSRuleObject } from 'tailwindcss/types/config'

/** Variants */
const variants = ['primary', 'secondary', 'outline', 'ghost'] as const

const themes = ['success', 'danger', 'default'] as const

const sizes = ['3xs', '2xs', 'xs', 'sm', 'md'] as const

const themeStyleMapper: Record<(typeof themes)[number], string> = {
  success: 'success',
  danger: 'danger',
  default: 'gray'
}

function createButtonVariantStyles() {
  const combinationStyles: CSSRuleObject = {}
  const separatorStyles: CSSRuleObject = {}

  variants.forEach(variant => {
    themes.forEach(theme => {
      const style: CSSRuleObject = {}

      const themeStyle = themeStyleMapper[theme as keyof typeof themeStyleMapper]

      /**
       * Ghost variant has no background and border.
       * It displays text color as same as outline variant.
       * Hover and active states are added for ghost variant based on outline variant.
       */
      if (variant === 'ghost') {
        style[`color`] = `var(--cn-set-${themeStyle}-outline-text)`
        style[`&:hover:not(:disabled, .cn-button-disabled)`] = {
          backgroundColor: `var(--cn-set-${themeStyle}-outline-bg-hover)`
        }

        style[`&:active:not(:disabled, .cn-button-disabled), &:where(.cn-button-active), &:where([data-state=open])`] =
        {
          backgroundColor: `var(--cn-set-${themeStyle}-outline-bg-selected)`
        }
      } else {
        const themeStyleForVariant = variant === 'primary' && theme === 'default' ? 'brand' : themeStyle

        // Default styles
        style[`backgroundColor`] = `var(--cn-set-${themeStyleForVariant}-${variant}-bg)`
        style[`color`] = `var(--cn-set-${themeStyleForVariant}-${variant}-text) !important`
        style[`borderColor`] =
          `var(--cn-set-${themeStyleForVariant}-${variant}-border, var(--cn-set-${themeStyleForVariant}-${variant}-bg))`

        // Hover styles
        style[`&:hover:not(:disabled, .cn-button-disabled)`] =
          variant === 'outline'
            ? {
              backgroundColor: `var(--cn-set-${themeStyleForVariant}-${variant}-bg-hover, var(--cn-set-${themeStyleForVariant}-${variant}-bg))`
            }
            : {
              backgroundColor: `var(--cn-set-${themeStyleForVariant}-${variant}-bg-hover, var(--cn-set-${themeStyleForVariant}-${variant}-bg))`,
              borderColor: `var(--cn-set-${themeStyleForVariant}-${variant}-bg-hover, var(--cn-set-${themeStyleForVariant}-${variant}-bg))`
            }

        // Active styles
        style[`&:active:not(:disabled, .cn-button-disabled), &:where(.cn-button-active), &:where([data-state=open])`] =
          variant === 'outline'
            ? {
              backgroundColor: `var(--cn-set-${themeStyleForVariant}-${variant}-bg-selected, var(--cn-set-${themeStyleForVariant}-${variant}-bg))`
            }
            : {
              backgroundColor: `var(--cn-set-${themeStyleForVariant}-${variant}-bg-selected, var(--cn-set-${themeStyleForVariant}-${variant}-bg))`,
              borderColor: `var(--cn-set-${themeStyleForVariant}-${variant}-bg-selected, var(--cn-set-${themeStyleForVariant}-${variant}-bg))`
            }

        separatorStyles[`&:where(.cn-button-split-dropdown.cn-button-${variant}.cn-button-${theme})`] = {
          '&::before': {
            /**
             * Some variants don't have separator
             * Hence adding border color for separator
             *  */
            backgroundColor: `var(--cn-set-${themeStyleForVariant}-${variant}-text)`,
            opacity: 'var(--cn-opacity-20)'
          }
        }
      }

      combinationStyles[`&.cn-button-${variant}.cn-button-${theme}`] = style
    })
  })

  return { ...combinationStyles, ...separatorStyles }
}

function createButtonSizeStyles() {
  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    styles[`&:where(.cn-button-${size})`] = {
      height: `var(--cn-btn-size-${size})`,
      paddingBlock: `var(--cn-btn-py-${size})`,
      paddingInline: `var(--cn-btn-px-${size})`,
      gap: `var(--cn-btn-gap-${size})`
    }
  })

  return styles
}

export default {
  '.cn-button': {
    transitionProperty: 'color, background-color, border-color, text-decoration-color, fill, stroke',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',
    borderRadius: 'var(--cn-btn-default-radius)',
    paddingBlock: 'var(--cn-btn-py-md)',
    paddingInline: 'var(--cn-btn-px-md)',
    height: 'var(--cn-btn-size-md)',
    gap: 'var(--cn-btn-gap-md)',
    flexShrink: '0',
    minWidth: 'fit-content',
    border: 'var(--cn-btn-border) solid var(--cn-set-gray-outline-border)',
    '@apply font-body-single-line-normal select-none overflow-hidden inline-flex items-center justify-center whitespace-nowrap':
      '',

    '&:where(.cn-button-split-dropdown)': {
      height: 'var(--cn-btn-size-md)',
      width: 'var(--cn-btn-size-md)',
      position: 'relative',
      '@apply rounded-l-cn-none border-l-0 p-0': '',

      '&::before': {
        content: '""',
        position: 'absolute',
        left: '0',
        height: 'calc(100% - 8px)',
        width: 'var(--cn-btn-border)'
      }
    },

    // sizes
    ...createButtonSizeStyles(),
    '&:where(.cn-button-xs, .cn-button-3xs, .cn-button-2xs)': {
      '@apply font-caption-single-line-normal': ''
    },

    // AI button
    '&:where(.cn-button-ai)': {
      color: 'var(--cn-set-ai-outline-text)',
      backgroundImage: `var(--cn-set-ai-outline-bg-gradient), var(--cn-set-ai-outline-border)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      // default: zoom the gradient so mostly the first (white) stop is visible
      // hover will reset size to 100% 100% and position to 0 0 (one-to-one with the token)
      backgroundSize: '800% 800%, 100% 100%',
      backgroundPosition: '0 0, 0 0',
      border: 'var(--cn-btn-ai-border) solid transparent',
      transitionProperty: 'color, background-size, background-position, border-color, box-shadow',
      transitionDuration: '150ms',
      transitionTimingFunction: 'ease-in-out',

      '&:hover:not(:disabled, .cn-button-disabled)': {
        // gradient matches the token one-to-one
        backgroundSize: '100% 100%, 100% 100%',
        backgroundPosition: '0 0, 0 0',
        boxShadow: 'var(--cn-shadow-comp-ai-inner)'
      },
      '&:active:not(:disabled, .cn-button-disabled), &:where(.cn-button-active)': {
        // slightly weaker than hover: slight zoom back
        backgroundSize: '110% 110%, 100% 100%',
        backgroundPosition: '0 0, 0 0',
        boxShadow: 'var(--cn-shadow-comp-ai-inner)'
      },
      "&[data-loading]": {
        // loading mirrors the hover state so the gradient is clearly visible
        backgroundSize: '110% 110%, 100% 100%',
        backgroundPosition: '0 0, 0 0',
        boxShadow: 'var(--cn-shadow-comp-ai-inner)'
      }
    },

    // Ghost style
    '&:where(.cn-button-ghost)': {
      color: 'var(--cn-text-2)',
      '@apply border-transparent': '',

      '&:where(:hover:not(:disabled, .cn-button-disabled))': {
        color: 'var(--cn-text-1)',
        backgroundColor: 'var(--cn-state-hover)'
      },
      '&:where(:active:not(:disabled, .cn-button-disabled)), &:where(.cn-button-active), &:where([data-state=open])': {
        color: 'var(--cn-text-1)',
        backgroundColor: 'var(--cn-state-selected)'
      }
    },

    // variant styles
    ...createButtonVariantStyles(),

    // Rounded
    '&:where(.cn-button-rounded)': {
      borderRadius: 'var(--cn-btn-rounded-radius)'
    },

    // Icon Only
    '&:where(.cn-button-icon-only)': {
      width: 'var(--cn-btn-size-md)',
      height: 'var(--cn-btn-size-md)',
      padding: '0',
      '& > svg': {
        width: 'var(--cn-icon-size-sm)',
        height: 'var(--cn-icon-size-sm)'
      }
    },

    // Icon Only sizing
    '&:where(.cn-button-icon-only.cn-button-sm)': {
      width: 'var(--cn-btn-size-sm)',
      height: 'var(--cn-btn-size-sm)',
      '& > svg': {
        strokeWidth: 'var(--cn-icon-stroke-width-sm)'
      }
    },

    '&:where(.cn-button-icon-only.cn-button-xs)': {
      width: 'var(--cn-btn-size-xs)',
      height: 'var(--cn-btn-size-xs)',
      '& > svg': {
        width: 'var(--cn-icon-size-xs)',
        height: 'var(--cn-icon-size-xs)',
        minWidth: 'var(--cn-icon-size-xs)',
        minHeight: 'var(--cn-icon-size-xs)',
        strokeWidth: 'var(--cn-icon-stroke-width-xs)'
      }
    },

    '&:where(.cn-button-icon-only.cn-button-2xs)': {
      width: 'var(--cn-btn-size-2xs)',
      height: 'var(--cn-btn-size-2xs)',
      '& > svg': {
        width: 'var(--cn-icon-size-2xs)',
        height: 'var(--cn-icon-size-2xs)',
        minWidth: 'var(--cn-icon-size-2xs)',
        minHeight: 'var(--cn-icon-size-2xs)',
        strokeWidth: 'var(--cn-icon-stroke-width-2xs)'
      }
    },

    '&:where(.cn-button-icon-only.cn-button-3xs)': {
      width: 'var(--cn-btn-size-3xs)',
      height: 'var(--cn-btn-size-3xs)',
      '& > svg': {
        width: 'var(--cn-icon-size-2xs)',
        height: 'var(--cn-icon-size-2xs)',
        strokeWidth: 'var(--cn-icon-stroke-width-2xs)'
      }
    },

    // Focus
    '&:where(:focus-visible)': {
      outline: 'var(--cn-focus)',
      boxShadow: 'inset 0 0 0 2px var(--cn-chrome-25)',

      // This is to prevent focus outline from being hidden by dropdown
      position: 'relative',
      zIndex: '1',

      '&:not(.cn-button-link)': {
        '@apply outline-offset-cn-tight': ''
      }
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
