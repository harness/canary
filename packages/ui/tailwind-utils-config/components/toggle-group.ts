import { CSSRuleObject } from 'tailwindcss/types/config'

const sizes = ['xs', 'sm', 'md'] as const

function createToggleGroupStyles() {
  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    const value = size === 'md' ? 'default' : size

    styles[`&-transparent-${size}`] = {
      paddingLeft: `var(--cn-btn-px-${value})`,
      paddingRight: `var(--cn-btn-px-${value})`,
      paddingTop: `var(--cn-btn-py-${value})`,
      paddingBottom: `var(--cn-btn-py-${value})`,
      '&[aria-checked="false"]': {
        border: 'var(--cn-btn-border) solid transparent'
      }
    }
  })

  return styles
}

export default {
  '.cn-toggle-group': {
    gap: 'var(--cn-layout-3xs)',
    '@apply flex': '',

    '&-vertical': {
      '@apply flex-col': ''
    },

    ...createToggleGroupStyles()
  }
}
