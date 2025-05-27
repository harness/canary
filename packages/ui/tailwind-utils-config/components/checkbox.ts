export default {
  '.cn-checkbox-wrapper': {
    display: 'flex',
    gap: 'var(--cn-spacing-2-half)',
    '&:has(.cn-checkbox-label-wrapper)': {
      width: '100%'
    },

    /**
     * Align the checkbox indicator with the label
     */
    '&:where(:has(.cn-checkbox-label-wrapper)) .cn-checkbox-root': {
      top: 'var(--cn-spacing-half)'
    }
  },

  '.cn-checkbox-label-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-1)'
  },

  '.cn-checkbox-root': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 'var(--cn-size-4)',
    height: 'var(--cn-size-4)',
    border: 'var(--cn-border-width-1) solid var(--cn-comp-selection-unselected-border)',
    borderRadius: 'var(--cn-rounded-1)',
    backgroundColor: 'var(--cn-comp-selection-unselected-bg)',
    '&:where(:not([disabled])):hover': {
      backgroundColor: 'var(--cn-comp-selection-unselected-bg-hover)',
      borderColor: 'var(--cn-comp-selection-unselected-border-hover)'
    },

    '&:where([disabled])': {
      backgroundColor: 'var(--cn-state-disabled-bg)',
      borderColor: 'var(--cn-state-disabled-border)',
      cursor: 'not-allowed'
    },

    '&:where([data-state=checked])': {
      backgroundColor: 'var(--cn-comp-selection-selected-bg)',
      borderColor: 'var(--cn-comp-selection-selected-border)',

      '&:hover': {
        backgroundColor: 'var(--cn-comp-selection-selected-bg-hover)',
        borderColor: 'var(--cn-comp-selection-selected-border-hover)'
      }
    },

    '&:where([data-state=checked][disabled])': {
      backgroundColor: 'var(--cn-state-disabled-bg-selected)',
      borderColor: 'var(--cn-state-disabled-border-selected)'
    },

    '&:where([data-state=indeterminate])': {
      backgroundColor: 'var(--cn-comp-selection-selected-bg)',
      borderColor: 'var(--cn-comp-selection-selected-border)',

      '&:hover': {
        backgroundColor: 'var(--cn-comp-selection-selected-bg-hover)',
        borderColor: 'var(--cn-comp-selection-selected-border-hover)'
      }
    },

    '&:where([data-state=indeterminate][disabled])': {
      backgroundColor: 'var(--cn-state-disabled-bg-selected)',
      borderColor: 'var(--cn-state-disabled-border-selected)'
    }
  },

  '.cn-checkbox-indicator': {
    color: 'var(--cn-comp-selection-selected-item)',

    '&:where([disabled])': {
      color: 'var(--cn-state-disabled-text)'
    },

    '&:where([data-state=checked][disabled])': {
      color: 'var(--cn-state-disabled-text-selected)'
    },

    '&:where([data-state=indeterminate][disabled])': {
      color: 'var(--cn-state-disabled-text-selected)'
    }
  },

  '.cn-checkbox-icon': {
    width: 'var(--cn-icon-size-xs)',
    height: 'var(--cn-icon-size-xs)'
  },

  '.cn-checkbox-label': {
    font: 'var(--cn-body-strong) !important',
    color: 'var(--cn-text-1) !important',
    '&:where(.disabled)': {
      color: 'var(--cn-state-disabled-text) !important'
    },
    '@apply truncate': ''
  },

  '.cn-checkbox-caption': {
    font: 'var(--cn-body-normal)',
    color: 'var(--cn-text-2)',
    '&:where(.disabled)': {
      color: 'var(--cn-state-disabled-text)'
    },
    '@apply truncate': ''
  }
}
