import { CSSRuleObject } from 'tailwindcss/types/config'

const Sizes = ['xs', 'sm', 'default', 'md', 'lg'] as const

function createIconandLogoSizeStyles(entity: 'icon' | 'logo') {
  const styles: CSSRuleObject = {}

  Sizes.forEach(size => {
    const style: CSSRuleObject = {}
    style[`width`] = `var(--cn-icon-size-${size})`
    style[`height`] = `var(--cn-icon-size-${size})`

    if (entity === 'icon') {
      style['stroke-width'] = `var(--cn-icon-stroke-width-${size})`
    }

    styles[`&:where(.cn-${entity}-${size})`] = style
  })

  // if (entity === 'icon') {
  //   Sizes.forEach(size => {
  //     styles[`&:where(.cn-${entity}-${size})`]['stroke-width'] = `var(--cn-icon-stroke-width-${size})`
  //   })
  // }

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
