export default {
  '.cn-scroll-area': {
    '@apply relative overflow-hidden flex-1': '',

    '&-viewport': {
      '@apply size-full rounded-[inherit] [&>div]:!flex [&>div]:flex-col': ''
    },

    '&-scrollbar': {
      borderRadius: 'var(--cn-rounded-full)',
      padding: 'var(--cn-size-1)',
      '@apply absolute flex touch-none select-none opacity-0 hover:opacity-100 transition-opacity': '',

      '&-vertical': {
        width: 'var(--cn-size-3)',
        '@apply right-0 top-0 h-full': ''
      },

      '&-horizontal': {
        height: 'var(--cn-size-3)',
        '@apply bottom-0 left-0 flex-col': ''
      }
    },

    '&-hover:hover .cn-scroll-area-scrollbar': {
      '@apply opacity-100': ''
    },

    '&-visible': {
      '@apply opacity-100': ''
    },

    '&-thumb': {
      backgroundColor: 'var(--cn-comp-scrollbar-thumb)',
      borderRadius: 'var(--cn-rounded-full)',
      '@apply relative flex-1 rounded-full': ''
    }
  }
}
