export default {
  '.cn-avatar': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    height: `var(--cn-avatar-size-default)`,
    width: `var(--cn-avatar-size-default)`,
    borderRadius: `var(--cn-avatar-radius-default)`,
    boxShadow: `var(--cn-shadow-comp-avatar-inner)`,

    '&:where(.cn-avatar-sm)': {
      height: `var(--cn-avatar-size-sm)`,
      width: `var(--cn-avatar-size-sm)`
    },
    '&:where(.cn-avatar-lg)': {
      height: `var(--cn-avatar-size-lg)`,
      width: `var(--cn-avatar-size-lg)`
    },

    '&:where(.cn-avatar-rounded)': {
      borderRadius: `var(--cn-avatar-radius-rounded)`
    },

    '.cn-avatar-image': {
      '@apply h-full w-full': ''
    },

    '.cn-avatar-fallback': {
      backgroundColor: `var(--cn-set-brand-soft-bg)`,
      color: `var(--cn-set-brand-soft-text)`,
      fontSize: `var(--cn-font-size-0)`,
      '@apply h-full w-full flex items-center justify-center select-none': '',

      '>.cn-avatar-lg': {
        fontSize: `var(--cn-font-size-2)`
      }
    }
  }
}
