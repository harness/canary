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
    fontSize: `var(--cn-font-size-0)`,
    '@apply shrink-0': '',

    '&:where(.cn-avatar-sm)': {
      height: `var(--cn-avatar-size-sm)`,
      width: `var(--cn-avatar-size-sm)`,
      fontSize: `var(--cn-font-size-min)`
    },
    '&:where(.cn-avatar-lg)': {
      height: `var(--cn-avatar-size-lg)`,
      width: `var(--cn-avatar-size-lg)`,
      fontSize: `var(--cn-font-size-2)`
    },

    '&:where(.cn-avatar-rounded)': {
      borderRadius: `var(--cn-avatar-radius-rounded)`
    },

    '.cn-avatar-image': {
      borderRadius: 'inherit',
      boxShadow: 'inherit',
      '@apply h-full w-full': ''
    },

    '.cn-avatar-fallback': {
      backgroundColor: `var(--cn-set-brand-soft-bg)`,
      color: `var(--cn-set-brand-soft-text)`,
      fontSize: 'inherit',
      borderRadius: 'inherit',
      boxShadow: 'inherit',
      '@apply h-full w-full flex items-center justify-center select-none': ''
    },

    '.cn-avatar-icon': {
      width: '80%',
      height: '80%'
    }
  }
}
