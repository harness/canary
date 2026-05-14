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
  }
}
