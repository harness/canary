export default {
  '.cn-sticky-list-section': {
    '@apply relative': '',

    '&-sentinel': {
      '@apply absolute top-0 left-0 w-full pointer-events-none': '',
      height: '1px'
    },

    '&-header': {
      '@apply sticky z-20': '',
      top: 'calc(-1 * var(--cn-drawer-container))',
      backgroundColor: 'var(--cn-bg-1)',
      marginLeft: 'calc(-1 * var(--cn-drawer-container))',
      marginRight: 'calc(-1 * var(--cn-drawer-container))',
      paddingLeft: 'var(--cn-drawer-container)',
      paddingRight: 'var(--cn-drawer-container)',
      paddingTop: 'var(--cn-drawer-container)',

      transitionProperty: 'box-shadow',
      transitionDuration: '150ms',
      transitionTimingFunction: 'linear',

      '&-stuck': {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
      }
    },

    '&-content': {
      '@apply relative': ''
    }
  },

  // Contained mode: for sticky lists nested inside non-drawer containers (e.g. form inputs).
  // Set --cn-sticky-container-padding on an ancestor to control how far the header bleeds.
  '.cn-sticky-list-section-contained': {
    '--cn-sticky-container': 'var(--cn-sticky-container-padding, 0px)'
  },

  '.cn-sticky-list-section-contained .cn-sticky-list-section-header': {
    top: '0',
    backgroundColor: 'transparent',
    marginLeft: 'calc(-1 * var(--cn-sticky-container))',
    marginRight: 'calc(-1 * var(--cn-sticky-container))',
    paddingLeft: 'var(--cn-sticky-container)',
    paddingRight: 'var(--cn-sticky-container)',
    paddingTop: '0'
  },

  '.cn-sticky-list-section-contained .cn-sticky-list-section-header-stuck': {
    backgroundColor: 'var(--cn-sticky-header-bg, var(--cn-bg-1))'
  }
}
