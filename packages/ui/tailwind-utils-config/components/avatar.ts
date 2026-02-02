import { CSSRuleObject } from 'tailwindcss/types/config'

const sizes = ['md', 'sm', 'lg', 'xs'] as const

function createAvatarSizeStyles() {
  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    if (size === 'xs') {
      styles[`&:where(.cn-avatar-${size})`] = {
        height: `var(--cn-avatar-size-${size})`,
        width: `var(--cn-avatar-size-${size})`,
        fontSize: `var(--cn-font-size-0)`,
        letterSpacing: `var(--cn-tracking-wide)`,
        fontWeight: `var(--cn-font-weight-default-normal-600)`
      }
    } else {
      styles[`&:where(.cn-avatar-${size})`] = {
        height: `var(--cn-avatar-size-${size})`,
        width: `var(--cn-avatar-size-${size})`,
        fontSize: size === 'lg' ? `var(--cn-font-size-5)` : `var(--cn-font-size-2)`,
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
    boxShadow: `var(--cn-comp-shadow-avatar-inner)`,
    letterSpacing: `var(--cn-tracking-tight)`,
    '@apply shrink-0': '',

    ...createAvatarSizeStyles(),

    '&:where(.cn-avatar-rounded)': {
      borderRadius: `var(--cn-avatar-radius-rounded)`
    },

    '.cn-avatar-image': {
      borderRadius: 'inherit',
      boxShadow: 'inherit',
      '@apply h-full w-full select-none': ''
    },

    '.cn-avatar-fallback': {
      backgroundColor: `var(--cn-set-gray-secondary-bg)`,
      color: `var(--cn-set-gray-secondary-text)`,
      fontSize: 'inherit',
      borderRadius: 'inherit',
      boxShadow: 'inherit',
      '@apply h-full w-full flex items-center justify-center select-none': '',

      '&-small': {
        fontSize: `var(--cn-font-size-0)`
      }
    },

    // Icon sizing is handled by cn-icon classes (xs, sm, md) passed from the Avatar component
    // Avatar xs → Icon xs, Avatar sm → Icon sm, Avatar md → Icon sm, Avatar lg → Icon md
    '.cn-avatar-icon': {}
  }
}
