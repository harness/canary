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

      '&:hover:not(.cn-tag-split *)': getHoverStyles(theme, isOutline),
      '&:where(.cn-tag-split-left)': {
        '.cn-tag-split:hover &': getHoverStyles(theme, isOutline)
      },
      '&:where(.cn-tag-split-right)': isOutline
        ? {
            borderColor: `var(--cn-set-${theme}-soft-bg)`,
            '.cn-tag-split:hover &': {
              borderColor: `var(--cn-set-${theme}-soft-bg-hover)`
            }
          }
        : {
            backgroundColor: `var(--cn-set-${theme}-surface-bg)`,
            '.cn-tag-split:hover &': {
              backgroundColor: `var(--cn-set-${theme}-surface-bg-hover)`
            }
          },

      // ICON STYLES
      '.cn-tag-icon': {
        color: `var(--cn-set-${theme}-${isOutline ? 'surface-text' : 'soft-text'})`
      },
      '.cn-tag-reset-icon': {
        color: `var(--cn-set-${theme}-${isOutline ? 'surface-text' : 'soft-text'})`
      }
    }

    styles[`&:where(.cn-tag-${theme})`] = style
  })

  return styles
}

export default {
  '.cn-tag': {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--cn-tag-py) var(--cn-tag-px)',
    gap: 'var(--cn-tag-gap)',
    borderWidth: `var(--cn-tag-border)`,
    borderRadius: `var(--cn-tag-radius-default)`,
    maxWidth: `var(--cn-tag-max-width)`,
    height: `var(--cn-tag-size-default)`,
    '@apply w-fit flex items-center transition-colors select-none font-body-single-line-normal': '',

    '&:where(.cn-tag-sm)': {
      height: `var(--cn-tag-size-sm)`,
      '@apply font-caption-single-line-normal': ''
    },

    '&:where(.cn-tag-rounded)': {
      borderRadius: `var(--cn-tag-radius-full)`
    },

    '&:where(.cn-tag-split-left)': {
      borderRadius: `var(--cn-tag-split-left-radius-l) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-l)`,
      '&.cn-tag-rounded': {
        borderRadius: `var(--cn-tag-radius-full) 0 0 var(--cn-tag-radius-full)`
      }
    },

    '&:where(.cn-tag-split-right)': {
      borderRadius: `var(--cn-tag-split-right-radius-l) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-l)`,
      borderWidth: `var(--cn-tag-border) var(--cn-tag-border) var(--cn-tag-border) 0`,
      '&.cn-tag-rounded': {
        borderRadius: `0 var(--cn-tag-radius-full) var(--cn-tag-radius-full) 0`
      }
    },

    '&:where(.cn-tag-outline)': {
      ...createTagVariantStyles('outline')
    },
    '&:where(.cn-tag-secondary)': {
      ...createTagVariantStyles('secondary')
    },

    '.cn-tag-icon': {
      minWidth: `var(--cn-icon-size-default, 16px)`,
      height: `var(--cn-icon-size-default, 16px)`
    },
    '.cn-tag-text': {
      '@apply truncate leading-normal align-middle inline-block': ''
    },
    '.cn-tag-reset-icon': {
      minWidth: `var(--cn-icon-size-xs, 12px)`,
      height: `var(--cn-icon-size-xs, 12px)`
    }
  }
}
