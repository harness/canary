import { CSSRuleObject } from 'tailwindcss/types/config'

const sizesAvatar = ['sm', 'md', 'lg', 'xs'] as const
const iconSizes = ['2xs', 'xs', 'sm', 'md', 'lg', 'xl'] as const
const logoSizes = ['xs', 'sm', 'md', 'lg'] as const
const inputSizes = ['sm'] as const

function createSkeletonAvatarVariantStyles() {
  const styles: CSSRuleObject = {}

  sizesAvatar.forEach(size => {
    styles[`&:where(.cn-skeleton-avatar-${size})`] = {
      width: `var(--cn-avatar-size-${size})`,
      height: `var(--cn-avatar-size-${size})`
    }
  })

  return styles
}

/**
 * TODO: Design System: Reuse styles from icons-and-logo.ts
 */
function createIconandLogoSizeStyles(entity: 'icon' | 'logo') {
  const sizes = entity === 'icon' ? iconSizes : logoSizes

  const styles: CSSRuleObject = {}

  sizes.forEach(size => {
    const style: CSSRuleObject = {}
    style[`width`] = `var(--cn-${entity}-size-${size})`
    style[`min-width`] = `var(--cn-${entity}-size-${size})`
    style[`height`] = `var(--cn-${entity}-size-${size})`
    style[`min-height`] = `var(--cn-${entity}-size-${size})`

    styles[`&:where(.cn-skeleton-${entity}-${size})`] = style
  })

  return styles
}

function createInputThemeStyles() {
  const styles: CSSRuleObject = {}

  inputSizes.forEach(size => {
    styles[`&.cn-skeleton-form-item-${size}`] = {
      padding: `var(--cn-input-${size}-py) var(--cn-input-${size}-pr) var(--cn-input-${size}-py) var(--cn-input-${size}-pl)`,
      height: `var(--cn-input-size-${size})`
    }
  })

  return styles
}

export default {
  '.cn-skeleton': {
    '&-base': {
      backgroundImage: 'var(--cn-comp-skeleton-bg)',
      backgroundSize: '200% 100%',
      backgroundPosition: '-200% 0',
      borderRadius: `var(--cn-rounded-2)`,
      animation: 'cnSkeletonShimmer 5.25s linear infinite'
    },

    '&-avatar': {
      display: 'inline-block',
      borderRadius: `var(--cn-avatar-radius-default)`,

      '&:where(.cn-skeleton-avatar-rounded)': {
        borderRadius: `var(--cn-avatar-radius-rounded)`
      },

      ...createSkeletonAvatarVariantStyles()
    },

    '&-icon': {
      ...createIconandLogoSizeStyles('icon')
    },
    '&-logo': {
      ...createIconandLogoSizeStyles('logo')
    },

    '&-typography': {
      '&-wrapper': {
        display: 'inline'
      },
      '&-child': {
        '&::before': {
          content: '"\u200B"' // Zero-width space to ensure the element has a width
        },

        display: 'inline-block',
        minWidth: '45px',
        lineHeight: '1',
        verticalAlign: 'middle'
      }
    },

    '&-table': {
      maskImage: 'var(--cn-comp-skeleton-mask)'
    },

    '&-form': {
      '&-field': {
        maskImage: 'var(--cn-comp-skeleton-mask)'
      },
      '&-item': {
        height: 'var(--cn-input-size-md)',
        padding: 'var(--cn-input-md-py) var(--cn-input-md-pr) var(--cn-input-md-py) var(--cn-input-md-pl)',
        border: 'var(--cn-input-border) solid var(--cn-border-2)',
        borderRadius: 'var(--cn-input-radius)',
        backgroundColor: 'var(--cn-comp-input-bg)',

        ...createInputThemeStyles()
      }
    },

    '&-list': {
      maskImage: 'var(--cn-comp-skeleton-mask)',

      '&-actions': {
        '@apply size-9': ''
      }
    },

    '&-file-explorer': {
      maskImage: 'var(--cn-comp-skeleton-mask)'
    }
  },

  '@keyframes cnSkeletonShimmer': {
    '0%': {
      backgroundPosition: '-200% 0'
    },
    '100%': {
      backgroundPosition: '200% 0'
    }
  }
}
