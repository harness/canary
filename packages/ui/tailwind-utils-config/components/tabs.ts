export default {
  '.cn-tabs-list': {
    display: 'flex',
    alignItems: 'center',

    '&-outlined': {
      width: 'fit-content',
      padding: 'var(--cn-tabs-container)',
      borderRadius: 'var(--cn-tabs-container-radius)',
      border: 'var(--cn-tabs-container-border) solid var(--cn-border-3)',
      backgroundColor: 'var(--cn-bg-2)',
      '@apply font-body-strong': ''
    },

    '&-ghost': {
      width: 'fit-content',
      padding: 'var(--cn-tabs-container)',
      borderRadius: 'var(--cn-tabs-container-radius)',
      '@apply font-body-strong': ''
    },

    '&-overlined': {
      borderBottom: 'var(--cn-tabs-container-border) solid var(--cn-border-3)',
      '@apply font-body-normal': ''
    },

    '&-underlined': {
      minHeight: 'inherit',
      borderBottom: 'var(--cn-tabs-container-border) solid var(--cn-border-3)',
      gap: 'var(--cn-tabs-underlined-container-gap)',
      '@apply font-body-normal': ''
    }
  },

  '.cn-tabs-trigger': {
    '@apply font-body-strong': '',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--cn-text-3)',
    userSelect: 'none',
    '@apply transition-colors': '',

    '&-outlined': {
      minHeight: 'var(--cn-tabs-item-min-height)',
      padding: 'var(--cn-tabs-item-py) var(--cn-tabs-item-px)',
      gap: 'var(--cn-tabs-item-gap)',
      color: 'var(--cn-text-3)',
      border: 'var(--cn-tabs-item-border) solid transparent',
      '@apply font-body-strong': '',

      '&:where(:not([disabled]).cn-tabs-trigger-active)': {
        borderColor: 'var(--cn-border-2)',
        backgroundColor: 'var(--cn-bg-3)',
        borderRadius: 'var(--cn-tabs-item-radius)',
        color: 'var(--cn-text-1)'
      },

      '&:where(:not([disabled]):hover)': {
        color: 'var(--cn-text-2)'
      }
    },

    '&-ghost': {
      minHeight: 'var(--cn-tabs-item-min-height)',
      padding: 'var(--cn-tabs-item-py) var(--cn-tabs-item-px)',
      gap: 'var(--cn-tabs-item-gap)',
      color: 'var(--cn-text-3)',
      border: 'var(--cn-tabs-item-border) solid transparent',
      '@apply font-body-strong': '',

      '&:where(:not([disabled]).cn-tabs-trigger-active)': {
        backgroundColor: 'var(--cn-set-gray-secondary-bg)',
        borderRadius: 'var(--cn-tabs-item-radius)',
        borderColor: 'var(--cn-set-gray-secondary-bg)',
        color: 'var(--cn-set-gray-secondary-text)'
      },

      '&:where(:not([disabled]):hover)': {
        color: 'var(--cn-text-2)'
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
        color: 'var(--cn-text-2) !important'
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
        borderColor: 'var(--cn-border-brand)',
        color: 'var(--cn-text-1)'
      },

      '&:where(:not([disabled]):hover)': {
        color: 'var(--cn-text-2) !important'
      }
    },

    '&:where([disabled]), &:where([aria-disabled="true"])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': ''
    }
  }
}
