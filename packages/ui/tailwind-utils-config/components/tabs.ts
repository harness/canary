export default {
  '.cn-tabs-scroll-container': {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    overflow: 'hidden'
  },

  '.cn-tabs-scroll-wrapper': {
    flex: '1',
    overflowX: 'auto',
    overflowY: 'hidden',
    scrollbarWidth: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    },
    scrollBehavior: 'smooth',
    '& .cn-tabs-list': {
      flexWrap: 'nowrap',
      width: 'max-content',
      minWidth: '100%'
    }
  },

  '.cn-tabs-fade': {
    position: 'absolute',
    top: '0',
    bottom: '0',
    width: 'var(--cn-spacing-6)',
    pointerEvents: 'none',
    zIndex: '1',

    '&-left': {
      left: '0',
      background: 'linear-gradient(to right, var(--cn-bg-1), transparent)'
    },

    '&-right': {
      right: '0',
      background: 'linear-gradient(to left, var(--cn-bg-1), transparent)'
    }
  },

  '.cn-tabs-list': {
    display: 'flex',
    alignItems: 'center',

    '&-outlined': {
      position: 'relative',
      width: 'fit-content',
      padding: 'var(--cn-tabs-container)',
      borderRadius: 'var(--cn-tabs-container-radius)',
      border: 'var(--cn-tabs-container-border) solid var(--cn-border-2)',
      backgroundColor: 'var(--cn-bg-2)',
      '@apply font-body-normal': ''
    },

    '&-ghost': {
      position: 'relative',
      width: 'fit-content',
      padding: 'var(--cn-tabs-container)',
      borderRadius: 'var(--cn-tabs-container-radius)',
      '@apply font-body-normal': ''
    },

    '&-overlined': {
      borderBottom: 'var(--cn-tabs-container-border) solid var(--cn-border-3)',
      '@apply font-body-normal': ''
    },

    '&-underlined': {
      position: 'relative',
      minHeight: 'inherit',
      borderBottom: 'var(--cn-tabs-container-border) solid var(--cn-border-3)',
      gap: 'var(--cn-tabs-underlined-container-gap)',
      '@apply font-body-normal': ''
    }
  },

  '.cn-tabs-indicator': {
    position: 'absolute',
    left: '0',
    bottom: '-1px',
    height: 'var(--cn-tabs-item-underlined-border)',
    backgroundColor: 'var(--cn-border-brand)',
    pointerEvents: 'none',
    zIndex: '1'
  },

  '.cn-tabs-pill': {
    position: 'absolute',
    left: '0',
    top: '0',
    borderRadius: 'var(--cn-tabs-item-radius)',
    pointerEvents: 'none',
    zIndex: '0'
  },

  '.cn-tabs-list-ghost .cn-tabs-pill': {
    backgroundColor: 'var(--cn-set-gray-secondary-bg)'
  },

  '.cn-tabs-list-outlined .cn-tabs-pill': {
    backgroundColor: 'var(--cn-bg-3)',
    border: 'var(--cn-tabs-item-border) solid var(--cn-border-2)',
    boxShadow: 'var(--cn-shadow-1)'
  },

  '.cn-tabs-trigger': {
    '@apply font-body-strong': '',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--cn-text-3)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
    flexShrink: '0',
    transitionProperty: 'color, background-color, border-color',
    transitionDuration: '150ms',
    transitionTimingFunction: 'ease-in-out',

    '&-outlined': {
      minHeight: 'var(--cn-tabs-item-min-height)',
      padding: 'var(--cn-tabs-item-py) var(--cn-tabs-item-px)',
      gap: 'var(--cn-tabs-item-gap)',
      color: 'var(--cn-text-3)',
      border: 'var(--cn-tabs-item-border) solid transparent',
      '@apply font-body-normal': '',
      position: 'relative',
      zIndex: '1',

      '&:where(:not([disabled]).cn-tabs-trigger-active)': {
        color: 'var(--cn-text-1)'
      },

      '&:where(:not([disabled]):hover)': {
        color: 'var(--cn-text-1)'
      }
    },

    '&-ghost': {
      minHeight: 'var(--cn-tabs-item-min-height)',
      padding: 'var(--cn-tabs-item-py) var(--cn-tabs-item-px)',
      gap: 'var(--cn-tabs-item-gap)',
      color: 'var(--cn-text-3)',
      border: 'var(--cn-tabs-item-border) solid transparent',
      '@apply font-body-normal': '',
      position: 'relative',
      zIndex: '1',

      '&:where(:not([disabled]).cn-tabs-trigger-active)': {
        color: 'var(--cn-set-gray-secondary-text)'
      },

      '&:where(:not([disabled]):hover)': {
        color: 'var(--cn-text-1)'
      }
    },

    '&-overlined': {
      minHeight: 'var(--cn-tabs-item-overlined-min-height)',
      padding: 'var(--cn-tabs-item-overlined-py) var(--cn-tabs-item-overlined-px)',
      gap: 'var(--cn-tabs-item-overlined-gap)',
      marginBottom: '-1px', // a compensation to overlap the bottom border of the container
      color: 'var(--cn-text-2)',
      border: 'var(--cn-tabs-item-overlined-border) solid transparent',
      borderRadius:
        'var(--cn-tabs-item-overlined-rt) var(--cn-tabs-item-overlined-rt) var(--cn-tabs-item-overlined-rb) var(--cn-tabs-item-overlined-rb)',
      '@apply font-body-normal': '',

      '&:where(:not([disabled]).cn-tabs-trigger-active)': {
        borderColor: 'var(--cn-border-3)',
        borderBottomColor: 'transparent',
        backgroundColor: 'var(--cn-bg-1)',
        color: 'var(--cn-text-1)'
      },

      '&:where(:not([disabled]):hover)': {
        // Adding important to override Blueprint reset CSS defaults
        color: 'var(--cn-text-1) !important'
      },

      '&:where(:not([disabled]):focus-visible)': {
        '@apply z-[1] outline-offset-cn-tight': ''
      }
    },

    '&-underlined': {
      position: 'relative',
      bottom: '-1px',
      minHeight: 'var(--cn-tabs-item-underlined-min-height)',
      padding: 'var(--cn-tabs-item-underlined-py) var(--cn-tabs-item-underlined-px)',
      paddingBottom: 'calc(var(--cn-tabs-item-underlined-py) - 1px)', // to compensate for the border and keep the height consistent to the design
      gap: 'var(--cn-tabs-item-underlined-gap)',
      color: 'var(--cn-text-3)',
      borderBottom: 'var(--cn-tabs-item-underlined-border) solid transparent',
      '@apply font-body-normal': '',

      '&:where(:not([disabled]).cn-tabs-trigger-active)': {
        color: 'var(--cn-text-1)'
      },

      '&:where(:not([disabled]):hover)': {
        color: 'var(--cn-text-1) !important'
      }
    },

    '&:where([disabled]), &:where([aria-disabled="true"])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': ''
    }
  }
}
