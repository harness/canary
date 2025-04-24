import { CSSRuleObject } from 'tailwindcss/types/config'

const variants = ['outline', 'secondary', 'label-left', 'label-right'] as const
const sizes = ['default', 'sm'] as const

/**
 *  Themes
 *
 *  If any variant is specified, TS will throw an error.
 *
 *  ✅ <Tag theme="gray">Gray Theme</Tag>
 *
 *  */
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

function createTagVariantStyles(variant: (typeof variants)[number]) {
  const styles: CSSRuleObject = {}

  themes.forEach(theme => {
    const style: CSSRuleObject = {}
    switch (variant) {
      case 'outline':
        style[`color`] = `var(--cn-set-${theme}-surface-text)`
        style[`backgroundColor`] = `var(--cn-set-${theme}-surface-bg)`
        style[`borderColor`] = `var(--cn-set-${theme}-surface-border)`
        style[`&:hover`] = {
          backgroundColor: `var(--cn-set-${theme}-surface-bg-hover)`,
          borderColor: `var(--cn-set-${theme}-surface-border)`
        }
        style[`&:.tag-split-right`] = {
          borderColor: `var(--cn-set-${theme}-soft-bg)`,
          '&:hover': {
            borderColor: `var(--cn-set-${theme}-soft-bg-hover)`
          }
        }
        break
      case 'secondary':
        style[`color`] = `var(--cn-set-${theme}-soft-text)`
        style[`backgroundColor`] = `var(--cn-set-${theme}-soft-bg)`
        style[`borderColor`] = `var(--cn-set-${theme}-soft-bg)`
        style[`&:hover`] = {
          backgroundColor: `var(--cn-set-${theme}-soft-bg-hover)`,
          borderColor: `var(--cn-set-${theme}-soft-bg-hover)`
        }
        style[`&:.tag-split-right`] = {
          backgroundColor: `var(--cn-set-${theme}-surface-bg)`,
          '&:hover': {
            backgroundColor: `var(--cn-set-${theme}-surface-bg-hover)`
          }
        }
        break
    }

    styles[`&:where(.tag-${theme})`] = style
  })

  return styles
}

export default {
  '.tag-outline': {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--cn-tag-py) var(--cn-tag-px)',
    gap: 'var(--cn-tag-gap)',
    borderWidth: `var(--cn-tag-border)`,
    borderRadius: `var(--cn-tag-radius-default)`,
    font: `var(--cn-body-tight-normal)`,
    height: `var(--cn-tag-size-default)`,
    '&.tag-sm': {
      font: `var(--cn-caption-tight-normal)`,
      height: `var(--cn-tag-size-sm)`
    },
    '&.tag-rounded': {
      borderRadius: `var(--cn-tag-radius-full)`
    },
    '&.tag-split-left': {
      borderRadius: `var(--cn-tag-split-left-radius-l) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-l)`,
      '&.tag-rounded': {
        borderRadius: `var(--cn-tag-radius-full) 0 0 var(--cn-tag-radius-full)`
      }
    },
    '&.tag-split-right': {
      borderRadius: `var(--cn-tag-split-right-radius-l) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-l)`,
      borderWidth: `var(--cn-tag-border) var(--cn-tag-border) var(--cn-tag-border) 0`,
      '&.tag-rounded': {
        borderRadius: `0 var(--cn-tag-radius-full) var(--cn-tag-radius-full) 0`
      }
    },

    ...createTagVariantStyles('outline')
  },
  '.tag-secondary': {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--cn-tag-py) var(--cn-tag-px)',
    gap: 'var(--cn-tag-gap)',
    borderWidth: `var(--cn-tag-border)`,
    borderRadius: `var(--cn-tag-radius-default)`,
    font: `var(--cn-body-tight-normal)`,
    height: `var(--cn-tag-size-default)`,
    '&.tag-sm': {
      font: `var(--cn-caption-tight-normal)`,
      height: `var(--cn-tag-size-sm)`
    },
    '&.tag-rounded': {
      borderRadius: `var(--cn-tag-radius-full)`
    },
    '&.tag-split-left': {
      borderRadius: `var(--cn-tag-split-left-radius-l) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-l)`,
      '&.tag-rounded': {
        borderRadius: `var(--cn-tag-radius-full) 0 0 var(--cn-tag-radius-full)`
      }
    },
    '&.tag-split-right': {
      borderRadius: `var(--cn-tag-split-right-radius-l) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-l)`,
      borderWidth: `var(--cn-tag-border) var(--cn-tag-border) var(--cn-tag-border) 0`,
      '&.tag-rounded': {
        borderRadius: `0 var(--cn-tag-radius-full) var(--cn-tag-radius-full) 0`
      }
    },

    ...createTagVariantStyles('secondary')
  }
}
