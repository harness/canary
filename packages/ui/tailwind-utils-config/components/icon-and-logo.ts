import { CSSRuleObject } from 'tailwindcss/types/config'

const Sizes = ['xs', 'sm', 'default', 'md', 'lg'] as const

function createIconandLogoSizeStyles() {
  const styles: CSSRuleObject = {}

  Sizes.forEach(size => {
    styles[`&:where(.cn-icon-${size}), &:where(.cn-logo-${size})`] = {
      width: `var(--cn-icon-size-${size})`,
      height: `var(--cn-icon-size-${size})`
    }
  })

  Sizes.forEach(size => {
    styles[`&:where(:has(.cn-icon-${size}))`] = {
      strokeWidth: `var(--cn-icon-stroke-width-${size})`
    }
  })

  return styles
}

export default {
  '.cn-icon, .cn-logo': {
    ...createIconandLogoSizeStyles()
  }
}
