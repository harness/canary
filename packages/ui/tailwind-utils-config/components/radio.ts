export default {
  ':where(.cn-radio-root, .cn-radio-control)': {
    '@apply grid': '',
    gap: 'var(--cn-layout-sm)'
  },

  '.cn-radio-item-wrapper': {
    display: 'flex',
    gap: 'var(--cn-spacing-2-half)',
    width: '100%'
  },

  '.cn-radio-item-label-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-1)'
  },

  '.cn-radio-item': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    position: 'relative',
    top: 'var(--cn-spacing-half)',
    width: 'var(--cn-size-4)',
    height: 'var(--cn-size-4)',
    border: 'var(--cn-border-width-1) solid var(--cn-comp-selection-unselected-border)',
    borderRadius: '50%',
    backgroundColor: 'var(--cn-comp-selection-unselected-bg)',
    '&:where(:not([disabled])):hover': {
      backgroundColor: 'var(--cn-comp-selection-unselected-bg-hover)',
      borderColor: 'var(--cn-comp-selection-unselected-border-hover)'
    },

    '&:where([disabled]), &:has([disabled])': {
      backgroundColor: 'var(--cn-state-disabled-bg)',
      borderColor: 'var(--cn-state-disabled-border)',
      cursor: 'not-allowed'
    },

    '&:where([data-state=checked]), &:has([data-state=checked])': {
      backgroundColor: 'var(--cn-comp-selection-selected-bg)',
      borderColor: 'var(--cn-comp-selection-selected-border)',

      '&:where(:not([disabled])):hover': {
        backgroundColor: 'var(--cn-comp-selection-selected-bg-hover)',
        borderColor: 'var(--cn-comp-selection-selected-border-hover)'
      }
    },

    '&:where([data-state=checked][disabled]), &:has([data-state=checked][disabled])': {
      backgroundColor: 'var(--cn-state-disabled-bg-selected)',
      borderColor: 'var(--cn-state-disabled-border-selected)'
    }
  },

  '.cn-radio-error:not(:has(.cn-radio-item[data-state=checked])) .cn-radio-item': {
    borderColor: 'var(--cn-border-danger)',
    boxShadow: `var(--cn-ring-danger)`,
    '&:where(:hover)': {
      boxShadow: `var(--cn-ring-danger-hover)`
    }
  },

  '.cn-radio-item-indicator': {
    width: 'var(--cn-size-2)',
    height: 'var(--cn-size-2)',
    borderRadius: '50%',
    backgroundColor: 'var(--cn-comp-selection-selected-item)',

    '&:where([disabled])': {
      backgroundColor: 'var(--cn-state-disabled-text)'
    },

    '&:where([data-state=checked][disabled])': {
      backgroundColor: 'var(--cn-state-disabled-text-selected)'
    }
  },

  '.cn-radio-item-label': {
    font: 'var(--cn-body-strong) !important',
    color: 'var(--cn-text-1) !important',
    '&:where(.disabled)': {
      color: 'var(--cn-state-disabled-text) !important'
    },
    '@apply truncate': ''
  }
}
