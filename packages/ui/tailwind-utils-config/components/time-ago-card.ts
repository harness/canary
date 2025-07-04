export default {
  '.cn-time-ago-card': {
    '&-trigger': {
      '@apply data-[state=open]:text-cn-foreground-1 hover:text-cn-foreground-1': ''
    },

    '&-content': {
      rowGap: 'var(--cn-layout-xs)',
      columnGap: 'var(--cn-layout-sm)',
      '@apply grid grid-cols-[auto_1fr_auto] items-center whitespace-nowrap': ''
    }
  }
}
