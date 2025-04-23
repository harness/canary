import { CSSRuleObject } from 'tailwindcss/types/config'

const variants = ['default', 'label', 'label-left', 'label-right'] as const
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
      case 'default':
        style[`color`] = `var(--cn-set-${theme}-surface-text)`
        style[`backgroundColor`] = `var(--cn-set-${theme}-surface-bg)`
        style[`borderColor`] = `var(--cn-set-${theme}-surface-border)`
        style[`&:hover`] = {
          backgroundColor: `var(--cn-set-${theme}-surface-bg-hover)`,
          borderColor: `var(--cn-set-${theme}-surface-border)`
        }
        break
      case 'label':
        style[`color`] = `var(--cn-set-${theme}-soft-text)`
        style[`backgroundColor`] = `var(--cn-set-${theme}-soft-bg)`
        style[`borderColor`] = `var(--cn-set-${theme}-soft-bg)`
        style[`&:hover`] = {
          backgroundColor: `var(--cn-set-${theme}-soft-bg-hover)`,
          borderColor: `var(--cn-set-${theme}-soft-bg-hover)`
        }
        break
      case 'label-left':
        style[`color`] = `var(--cn-set-${theme}-soft-text)`
        style[`backgroundColor`] = `var(--cn-set-${theme}-soft-bg)`
        style[`borderColor`] = `var(--cn-set-${theme}-soft-bg)`
        style[`&:hover`] = {
          backgroundColor: `var(--cn-set-${theme}-soft-bg-hover)`,
          borderColor: `var(--cn-set-${theme}-soft-bg-hover)`
        }
        break
      case 'label-right':
        style[`color`] = `var(--cn-set-${theme}-soft-text)`
        style[`backgroundColor`] = `var(--cn-set-${theme}-surface-bg)`
        style[`borderColor`] = `var(--cn-set-${theme}-soft-bg)`
        style[`&:hover`] = {
          backgroundColor: `var(--cn-set-${theme}-surface-bg)`,
          borderColor: `var(--cn-set-${theme}-soft-bg-hover)`
        }
        break
    }

    styles[`&:where(tag-${theme})`] = style
  })

  return styles
}

export default {
  '.tag-default': {
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--cn-tag-py) var(--cn-tag-px)',
    gap: 'var(--cn-tag-gap)',
    borderRadius: `var(--cn-tag-radius-full)`,
    font: `var(--cn-body-tight-normal)`,
    '&.tag-sm': {
      font: `var(--cn-caption-tight-normal)`
    },

    ...createTagVariantStyles('default')
  },
  '.tag-label': {
    font: `var(--cn-caption-tight-normal)`,
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--cn-tag-py) var(--cn-tag-px)',
    gap: 'var(--cn-tag-gap)',
    borderRadius: `var(--cn-tag-split-left-radius-l) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-l)`,

    ...createTagVariantStyles('label')
  },
  '.tag-label-left': {
    font: `var(--cn-caption-tight-normal)`,
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--cn-tag-py) var(--cn-tag-px)',
    gap: 'var(--cn-tag-gap)',
    borderRadius: `var(--cn-tag-split-left-radius-l) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-r) var(--cn-tag-split-left-radius-l)`,

    ...createTagVariantStyles('label-left')
  },
  '.tag-label-right': {
    font: `var(--cn-caption-tight-normal)`,
    display: 'inline-flex',
    alignItems: 'center',
    padding: 'var(--cn-tag-py) var(--cn-tag-px)',
    gap: 'var(--cn-tag-gap)',
    borderRadius: `var(--cn-tag-split-right-radius-l) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-r) var(--cn-tag-split-right-radius-l)`,

    ...createTagVariantStyles('label-right')
  }
}
