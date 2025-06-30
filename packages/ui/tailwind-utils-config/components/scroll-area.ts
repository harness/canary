export default {
  '.cn-scroll-area': {
    '@apply overflow-auto grid min-w-full': '',

    '&-content': {
      '@apply relative': ''
    },

    '&-marker': {
      '@apply absolute invisible z-[-1] pointer-events-none': '',

      '&-top': {
        '@apply top-0 left-0 w-full h-px': ''
      },
      '&-bottom': {
        '@apply bottom-0 left-0 w-full h-px': ''
      },
      '&-left': {
        '@apply top-0 left-0 w-px h-full': ''
      },
      '&-right': {
        '@apply top-0 right-0 bottom-0 w-px h-full': ''
      }
    }
  }
}
