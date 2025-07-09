import { CSSRuleObject } from 'tailwindcss/types/config'

const sizes = ['xs', 'sm', 'md'] as const

export const createToggleStyles = () => {
  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    styles[`&.cn-toggle-${size}.cn-toggle-transparent.cn-toggle-text`] = {
      paddingLeft: `var(--cn-btn-px-${size})`,
      paddingRight: `var(--cn-btn-px-${size})`,
      paddingTop: `var(--cn-btn-py-${size})`,
      paddingBottom: `var(--cn-btn-py-${size})`,
      '&[data-state="off"]': {
        border: 'var(--cn-btn-border) solid transparent'
      }
    }
  })

  return styles
}

export const toggleStyles: Record<string, CSSRuleObject> = {
  '.cn-toggle': {
    ...createToggleStyles()
  }
}
