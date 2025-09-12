export default {
  '.cn-caption': {
    gap: 'var(--cn-spacing-1)',
    '@apply w-full inline-flex items-start': ''
  },

  ':where([disabled]) + .cn-caption': {
    '@apply opacity-cn-disabled': ''
  }
}
