import { CSSRuleObject } from 'tailwindcss/types/config'

const sizes = ['xs', 'sm', 'md'] as const

function createToggleStyles() {
  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    const value = size === 'md' ? 'default' : size

    styles[`&-transparent-${size}`] = {
      border: 'var(--cn-btn-border) solid transparent',
      paddingLeft: `var(--cn-btn-px-${value})`,
      paddingRight: `var(--cn-btn-px-${value})`,
      paddingTop: `var(--cn-btn-py-${value})`,
      paddingBottom: `var(--cn-btn-py-${value})`
    }
  })

  return styles
}

export default {
  '.cn-toggle': {
    ...createToggleStyles()
  }
}
