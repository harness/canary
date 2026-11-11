const BAR_COLOR = 'var(--cn-set-brand-primary-bg)'

export default {
  '.cn-loading-bar': {
    height: '3px',
    // Above the app shell, dialogs and toasts: it only ever shows a thin line.
    'z-index': '9999',
    opacity: '1',
    transition: 'opacity 200ms ease-out',

    '&[data-state="hidden"]': {
      opacity: '0'
    },

    '&-fill': {
      'background-color': BAR_COLOR,
      transition: 'transform 200ms ease-out'
    },

    // No fill animation while hidden, so the bar never visibly rewinds.
    '&[data-state="hidden"] .cn-loading-bar-fill': {
      transition: 'none'
    },

    // Glow at the leading edge.
    '&-peg': {
      width: '100px',
      'box-shadow': `0 0 10px ${BAR_COLOR}, 0 0 5px ${BAR_COLOR}`,
      opacity: '0.6'
    },

    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '.cn-loading-bar-fill': {
        transition: 'none'
      },
      '.cn-loading-bar-peg': {
        display: 'none'
      }
    }
  }
}
