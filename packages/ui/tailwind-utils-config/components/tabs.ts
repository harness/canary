export default {
  '.cn-tabs-list': {
    display: 'flex',
    alignItems: 'center',

    '&-outlined': {
      width: 'fit-content',
      padding: 'var(--cn-tabs-container)',
      borderRadius: 'var(--cn-tabs-container-radius)',
      border: 'var(--cn-tabs-container-border) solid var(--cn-border-2)',
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
      gap: 'var(--cn-tabs-underlined-container-gap)',
      '@apply font-body-normal': ''
    }
  },

  '.cn-tabs-trigger': {
    '@apply font-body-strong': '',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--cn-text-2)',
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
        backgroundColor: 'var(--cn-set-gray-soft-bg)',
        borderRadius: 'var(--cn-tabs-item-radius)',
        borderColor: 'var(--cn-set-gray-soft-bg)',
        color: 'var(--cn-set-gray-soft-text)',
        boxShadow: 'var(--cn-shadow-1)'
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
      '@apply font-body-normal': '',

      '&:where(:not([disabled]).cn-tabs-trigger-active)': {
        borderColor: 'var(--cn-border-3)',
        borderBottomColor: 'transparent',
        borderRadius:
          'var(--cn-tabs-item-overlined-rt) var(--cn-tabs-item-overlined-rt) var(--cn-tabs-item-overlined-rb) var(--cn-tabs-item-overlined-rb)',
        backgroundColor: 'var(--cn-bg-1)',
        color: 'var(--cn-text-1)'
      },

      '&:where(:not([disabled]):hover)': {
        color: 'var(--cn-text-1)'
      }
    },

    '&-underlined': {
      minHeight: 'var(--cn-tabs-item-underlined-min-height)',
      padding: 'var(--cn-tabs-item-underlined-py) var(--cn-tabs-item-underlined-px)',
      paddingBottom: 'calc(var(--cn-tabs-item-underlined-py) - 1px)', // to compensate for the border and keep the height consistent to the design
      gap: 'var(--cn-tabs-item-underlined-gap)',
      color: 'var(--cn-text-2)',
      borderBottom: 'var(--cn-tabs-item-underlined-border) solid transparent',
      '@apply font-body-normal': '',

      '&:where(:not([disabled]).cn-tabs-trigger-active)': {
        borderColor: 'var(--cn-border-brand)',
        color: 'var(--cn-text-1)'
      },

      '&:where(:not([disabled]):hover)': {
        color: 'var(--cn-text-1)'
      }
    },

    '&:where([disabled])': {
      color: 'var(--cn-state-disabled-text)',
      cursor: 'not-allowed'
    }
  }
}
