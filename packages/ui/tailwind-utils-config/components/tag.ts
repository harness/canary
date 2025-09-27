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

const themeColorMapper: Record<'green' | 'red' | 'yellow', string> = {
  green: 'success',
  red: 'danger',
  yellow: 'warning'
}

const getHoverStyles = (theme: string, isOutline: boolean) => ({
  backgroundColor: `var(--cn-set-${theme}-${isOutline ? 'outline-bg-hover' : 'secondary-bg-hover'})`,
  borderColor: `var(--cn-set-${theme}-${isOutline ? 'outline-border' : 'secondary-bg-hover'})`
})

function createTagVariantStyles(variant: 'outline' | 'secondary'): CSSRuleObject {
  const styles: CSSRuleObject = {}

  themes.forEach(_theme => {
    const theme = themeColorMapper[_theme as 'green' | 'red' | 'yellow'] ?? _theme
    const isOutline = variant === 'outline'
    const style: CSSRuleObject = {
      color: `var(--cn-set-${theme}-${isOutline ? 'outline-text' : 'secondary-text'})`,
      backgroundColor: `var(--cn-set-${theme}-${isOutline ? 'outline-bg' : 'secondary-bg'})`,
      borderColor: `var(--cn-set-${theme}-${isOutline ? 'outline-border' : 'secondary-bg'})`,

      '&.cn-tag-hoverable:hover:not(.cn-tag-split *)': getHoverStyles(theme, isOutline),
      '&:where(.cn-tag-split-left)': {
        '.cn-tag-split.cn-tag-split-hoverable:hover &': getHoverStyles(theme, isOutline)
      },
      '&:where(.cn-tag-split-right)': isOutline
        ? {
            borderColor: `var(--cn-set-${theme}-secondary-bg)`,
            '.cn-tag-split.cn-tag-split-hoverable:hover &': {
              borderColor: `var(--cn-set-${theme}-secondary-bg-hover)`
            }
          }
        : {
            backgroundColor: `var(--cn-set-${theme}-outline-bg)`,
            '.cn-tag-split.cn-tag-split-hoverable:hover &': {
              backgroundColor: `var(--cn-set-${theme}-outline-bg-hover)`
            }
          },

      // ICON STYLES
      '.cn-tag-icon': {
        color: `var(--cn-set-${theme}-${isOutline ? 'outline-text' : 'secondary-text'}) !important`
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
    height: `var(--cn-tag-size-md)`,
    '@apply w-fit items-center transition-colors select-none font-body-single-line-normal': '',

    ':where(.cn-tag-action-icon-button)': {
      marginRight: 'calc(-1 * var(--cn-tag-px))',
      marginLeft: 'calc(-1 * var(--cn-tag-gap))',
      opacity: 'var(--cn-opacity-70)',

      '&:hover': {
        opacity: 'var(--cn-opacity-100)'
      }
    },

    '&:where(.cn-tag-hoverable)': {
      '@apply relative z-[1]': ''
    },

    '&:where(.cn-tag-sm)': {
      height: `var(--cn-tag-size-sm)`,
      '@apply font-caption-single-line-normal': '',

      '.cn-tag-action-icon-button': {
        marginRight: 'calc(-0.5 * var(--cn-tag-px))'
      }
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

    '.cn-tag-text': {
      '@apply truncate leading-normal align-middle inline-block': ''
    }
  }
}
