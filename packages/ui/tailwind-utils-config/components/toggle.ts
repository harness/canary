import { CSSRuleObject } from 'tailwindcss/types/config'

const sizes = ['xs', 'sm', 'md'] as const

const createToggleStyles = () => {
  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    styles[`&.cn-toggle-${size}.cn-toggle-transparent.cn-toggle-text`] = {
      paddingLeft: `var(--cn-btn-px-${size})`,
      paddingRight: `var(--cn-btn-px-${size})`,
      paddingTop: `var(--cn-btn-py-${size})`,
      paddingBottom: `var(--cn-btn-py-${size})`,
      border: 'var(--cn-btn-border) solid transparent'
    }
  })

  return styles
}

export default {
  '.cn-toggle': {
    ...createToggleStyles(),

    '&[data-state="on"]': {
      color: 'var(--cn-text-1)'
    }
  }
}
