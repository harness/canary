import { CSSRuleObject } from 'tailwindcss/types/config'

const iconSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const logoSizes = ['xs', 'sm', 'md', 'lg'] as const

function createIconandLogoSizeStyles(entity: 'icon' | 'logo') {
  // change it to logoSizes
  const sizes = entity === 'icon' ? iconSizes : logoSizes

  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    const style: CSSRuleObject = {}
    style[`width`] = `var(--cn-${entity}-size-${size})`
    style[`min-width`] = `var(--cn-${entity}-size-${size})`
    style[`height`] = `var(--cn-${entity}-size-${size})`
    style[`min-height`] = `var(--cn-${entity}-size-${size})`

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
  }
}
