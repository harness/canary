export default {
  '.cn-switch-wrapper': {
    display: 'flex',
    gap: 'var(--cn-spacing-2-half)',
    width: '100%'
  },

  '.cn-switch-label-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-1)'
  },

  '.cn-switch-root': {
    display: 'inline-flex',
    position: 'relative',
    minWidth: 'var(--cn-size-9)',
    height: 'var(--cn-size-5)',
    border: 'var(--cn-border-width-1) solid var(--cn-comp-selection-unselected-border)',
    borderRadius: 'var(--cn-rounded-full)',
    padding: 'var(--cn-spacing-half)',

    backgroundColor: `var(--cn-comp-selection-unselected-bg)`,
    borderColor: `var(--cn-comp-selection-unselected-border)`,
    '&:where(:not([disabled])):hover': {
      backgroundColor: `var(--cn-comp-selection-unselected-bg-hover)`,
      borderColor: `var(--cn-comp-selection-unselected-border-hover)`,

      '.cn-switch-thumb:not([disabled]):not([data-state=checked])': {
        backgroundColor: `var(--cn-comp-selection-unselected-item-hover)`
      }
    },

    '&:where([disabled])': {
      backgroundColor: `var(--cn-state-disabled-bg)`,
      borderColor: `var(--cn-state-disabled-border)`,
      cursor: 'not-allowed'
    },

    '&:where([data-state=checked])': {
      backgroundColor: `var(--cn-comp-selection-selected-bg)`,
      borderColor: `var(--cn-comp-selection-selected-border)`,

      '&:hover': {
        backgroundColor: `var(--cn-comp-selection-selected-bg-hover)`,
        borderColor: `var(--cn-comp-selection-selected-border-hover)`
      }
    },

    '&:where([data-state=checked][disabled])': {
      backgroundColor: `var(--cn-state-disabled-bg-selected)`,
      borderColor: `var(--cn-state-disabled-border-selected)`
    }
  },

  '.cn-switch-thumb': {
    display: 'inline-flex',
    position: 'relative',
    width: 'var(--cn-size-3-half)',
    height: 'var(--cn-size-3-half)',
    borderRadius: 'var(--cn-rounded-full)',

    transition: 'transform',
    'transition-duration': '100ms',

    backgroundColor: `var(--cn-comp-selection-unselected-item)`,

    '&:where([disabled])': {
      backgroundColor: `var(--cn-state-disabled-text)`
    },

    '&:where([data-state=checked])': {
      backgroundColor: `var(--cn-comp-selection-selected-item)`,
      transform: 'translateX(var(--cn-size-4))'
    },

    '&:where([data-state=checked][disabled])': {
      backgroundColor: `var(--cn-state-disabled-text-selected)`
    }
  },

  '.cn-switch-label': {
    font: 'var(--cn-body-strong) !important',
    color: 'var(--cn-text-1) !important',
    '&:where([disabled])': {
      color: 'var(--cn-state-disabled-text) !important'
    },
    '@apply truncate': ''
  },

  '.cn-switch-description': {
    font: 'var(--cn-body-normal)',
    color: 'var(--cn-text-2)',
    '&:where(.disabled)': {
      color: 'var(--cn-state-disabled-text)'
    },
    '@apply truncate': ''
  }
}
