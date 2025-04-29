import { CSSRuleObject } from 'tailwindcss/types/config'

const themes = [
  'gray',
  'blue',
  'brown',
  'cyan',
  'green',
  'indigo',
  'lime',
  'mint',
  'orange',
  'pink',
  'purple',
  'red',
  'violet',
  'yellow'
] as const

const getHoverStyles = (theme: (typeof themes)[number], isOutline: boolean) => ({
  backgroundColor: `var(--cn-set-${theme}-${isOutline ? 'surface-bg-hover' : 'soft-bg-hover'})`,
  borderColor: `var(--cn-set-${theme}-${isOutline ? 'surface-border' : 'soft-bg-hover'})`
})

function createTagVariantStyles(variant: 'outline' | 'secondary'): CSSRuleObject {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    const isOutline = variant === 'outline'
    const style: CSSRuleObject = {
      color: `var(--cn-set-${theme}-${isOutline ? 'surface-text' : 'soft-text'})`,
      backgroundColor: `var(--cn-set-${theme}-${isOutline ? 'surface-bg' : 'soft-bg'})`,
      borderColor: `var(--cn-set-${theme}-${isOutline ? 'surface-border' : 'soft-bg'})`,

      '&:hover:not(.tag-split *)': getHoverStyles(theme, isOutline),
      '&:where(.tag-split-left)': {
        '.tag-split:hover &': getHoverStyles(theme, isOutline)
      },
      '&:where(.tag-split-right)': isOutline
        ? {
            borderColor: `var(--cn-set-${theme}-soft-bg)`,
            '.tag-split:hover &': {
              borderColor: `var(--cn-set-${theme}-soft-bg-hover)`
            }
          }
        : {
            backgroundColor: `var(--cn-set-${theme}-surface-bg)`,
            '.tag-split:hover &': {
              backgroundColor: `var(--cn-set-${theme}-surface-bg-hover)`
            }
          },

      // ICON STYLES
      '.tag-icon': {
        color: `var(--cn-set-${theme}-${isOutline ? 'surface-text' : 'soft-text'})`
      },
      '.tag-reset-icon': {
        color: `var(--cn-set-${theme}-${isOutline ? 'surface-text' : 'soft-text'})`
      }
    }

    styles[`&:where(.tag-${theme})`] = style
  })

  return styles
}

export default {
  '.tag': {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--cn-tag-py) var(--cn-tag-px)',
    gap: 'var(--cn-tag-gap)',
    borderWidth: `var(--cn-tag-border)`,
    borderRadius: `var(--cn-tag-radius-default)`,
    maxWidth: `var(--cn-tag-max-width)`,
    height: `var(--cn-tag-size-default)`,
    '@apply w-fit flex items-center transition-colors cursor-pointer font-body-tight-normal': '',

    '&:where(.tag-sm)': {
      height: `var(--cn-tag-size-sm)`,
      '@apply font-caption-tight-normal': ''
    },

    '&:where(.tag-rounded)': {
      borderRadius: `var(--cn-tag-radius-full)`
    },

    '&:where(.tag-split-left)': {
      borderRadius: `var(--cn-tag-split-left-radius-l) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-l)`,
      '&.tag-rounded': {
        borderRadius: `var(--cn-tag-radius-full) 0 0 var(--cn-tag-radius-full)`
      }
    },

    '&:where(.tag-split-right)': {
      borderRadius: `var(--cn-tag-split-right-radius-l) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-l)`,
      borderWidth: `var(--cn-tag-border) var(--cn-tag-border) var(--cn-tag-border) 0`,
      '&.tag-rounded': {
        borderRadius: `0 var(--cn-tag-radius-full) var(--cn-tag-radius-full) 0`
      }
    },

    '&:where(.tag-outline)': {
      ...createTagVariantStyles('outline')
    },
    '&:where(.tag-secondary)': {
      ...createTagVariantStyles('secondary')
    },

    // ICON STYLES
    '.tag-icon': {
      width: `var(--cn-icon-size-default, 16px)`,
      height: `var(--cn-icon-size-default, 16px)`
    },
    '.tag-reset-icon': {
      width: `var(--cn-icon-size-xs, 12px)`,
      height: `var(--cn-icon-size-xs, 12px)`
    }
  }
}
