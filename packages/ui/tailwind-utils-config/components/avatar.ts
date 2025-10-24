import { CSSRuleObject } from 'tailwindcss/types/config'

const sizes = ['md', 'sm', 'lg', 'xs'] as const

function createAvatarSizeStyles() {
  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    if (size === 'xs') {
      styles[`&:where(.cn-avatar-${size})`] = {
        height: `var(--cn-avatar-size-${size})`,
        width: `var(--cn-avatar-size-${size})`,
        fontSize: `var(--cn-font-size-min)`,
        letterSpacing: `var(--cn-tracking-wide)`,
        fontWeight: `var(--cn-font-weight-default-normal-600)`
      }
    } else {
      styles[`&:where(.cn-avatar-${size})`] = {
        height: `var(--cn-avatar-size-${size})`,
        width: `var(--cn-avatar-size-${size})`,
        fontSize: size === 'lg' ? `var(--cn-font-size-2)` : `var(--cn-font-size-0)`,
        fontWeight: `var(--cn-font-weight-default-normal-500)`
      }
    }
  })

  return styles
}

export default {
  '.cn-avatar': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: `var(--cn-avatar-radius-default)`,
    boxShadow: `var(--cn-shadow-comp-avatar-inner)`,
    letterSpacing: `var(--cn-tracking-tight)`,
    '@apply shrink-0': '',

    ...createAvatarSizeStyles(),

    '&:where(.cn-avatar-rounded)': {
      borderRadius: `var(--cn-avatar-radius-rounded)`
    },

    '.cn-avatar-image': {
      borderRadius: 'inherit',
      boxShadow: 'inherit',
      '@apply h-full w-full': ''
    },

    '.cn-avatar-fallback': {
      backgroundColor: `var(--cn-set-gray-primary-bg)`,
      color: `var(--cn-set-gray-primary-text)`,
      fontSize: 'inherit',
      borderRadius: 'inherit',
      boxShadow: 'inherit',
      '@apply h-full w-full flex items-center justify-center select-none': '',

      '&-small': {
        fontSize: `var(--cn-font-size-min)`
      }
    },

    '.cn-avatar-icon': {
      width: '60%',
      height: '60%'
    }
  }
}
