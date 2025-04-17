import { CSSRuleObject } from 'tailwindcss/types/config'

/** Variants */
const variants = ['surface'] as const

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

function createTagVariantStyles() {
  const styles: CSSRuleObject = {}

  variants.forEach(variant => {
    themes.forEach(theme => {
      const style: CSSRuleObject = {}
      style[`backgroundColor`] = `var(--cn-set-${theme}-${variant}-bg)`
      style[`color`] = `var(--cn-set-${theme}-${variant}-text)`
      style[`borderColor`] = `var(--cn-set-${theme}-${variant}-border)`
    })
  })

  return styles
}

export default {
  '.tag': {
    border: 'var(--cn-tag-border) solid var(--cn-set-gray-surface-bg)',
    display: 'inline-flex',
    padding: 'var(--cn-tag-py) var(--cn-tag-px)',
    gap: 'var(--cn-tag-gap)',
    alignItems: 'center',

    /** Variants */
    ...createTagVariantStyles()
  }
}
