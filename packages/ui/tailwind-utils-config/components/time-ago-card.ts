export default {
  '.cn-time-ago-card': {
    '&-trigger': {
      '@apply leading-snug whitespace-nowrap truncate max-w-full': '',
      ':where(time)': {
        '@apply data-[state=open]:text-cn-1 hover:text-cn-1': ''
      },
      '&:where(:focus-visible)': {
        outline: 'none !important',

        time: {
          '@apply text-cn-1': '',
          outline: 'var(--cn-focus)'
        }
      }
    },

    '&-content': {
      rowGap: 'var(--cn-layout-xs)',
      columnGap: 'var(--cn-layout-sm)',
      padding: 'var(--cn-layout-3xs) 0',
      '@apply grid grid-cols-[auto_1fr_auto] items-center whitespace-nowrap': ''
    }
  }
}
