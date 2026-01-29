import { CSSRuleObject } from 'tailwindcss/types/config'

const iconSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const logoSizes = ['xs', 'sm', 'md', 'lg'] as const

function createIconandLogoSizeStyles(entity: 'icon' | 'logo' | 'symbol') {
  // change it to logoSizes
  const sizes = entity === 'icon' ? iconSizes : logoSizes
  // symbol uses logo sizes
  const sizeVar = entity === 'symbol' ? 'logo' : entity

  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    const style: CSSRuleObject = {}
    style[`width`] = `var(--cn-${sizeVar}-size-${size})`
    style[`min-width`] = `var(--cn-${sizeVar}-size-${size})`
    style[`height`] = `var(--cn-${sizeVar}-size-${size})`
    style[`min-height`] = `var(--cn-${sizeVar}-size-${size})`

    if (entity === 'icon') {
      style['stroke-width'] = `var(--cn-icon-stroke-width-${size})`
    }

    styles[`&:where(.cn-${entity}-${size})`] = style
  })

  return styles
}

export default {
  '.cn-icon': {
    ...createIconandLogoSizeStyles('icon')
  },
  '.cn-logo': {
    ...createIconandLogoSizeStyles('logo')
  },
  '.cn-symbol': {
    ...createIconandLogoSizeStyles('symbol')
  }
}
