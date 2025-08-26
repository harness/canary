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
    gap: 'var(--cn-layout-4xs)'
  },

  '.cn-checkbox-root': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    position: 'relative',
    width: 'var(--cn-size-4)',
    height: 'var(--cn-size-4)',
    border: 'var(--cn-border-width-1) solid var(--cn-comp-selection-unselected-border)',
    borderRadius: 'var(--cn-rounded-1)',
    backgroundColor: 'var(--cn-comp-selection-unselected-bg)',

    '&:where(:not([disabled])):focus-visible': {
      outline: 'var(--cn-focus)',
      outlineOffset: 'var(--cn-size-px)'
    },

    '&:where(:not([disabled])):hover': {
      backgroundColor: 'var(--cn-comp-selection-unselected-bg-hover)',
      borderColor: 'var(--cn-comp-selection-unselected-border-hover)'
    },

    '&:where(.cn-checkbox-error:where(:not([data-state=checked])))': {
      borderColor: 'var(--cn-border-danger)',
      boxShadow: `var(--cn-ring-danger)`,
      '&:hover': {
        backgroundColor: 'var(--cn-comp-selection-unselected-bg)',
        borderColor: 'var(--cn-border-danger)',
        boxShadow: `var(--cn-ring-danger-hover)`
      }
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
      },

      '&:where(.cn-checkbox-error)': {
        backgroundColor: 'var(--cn-set-red-solid-bg)',
        borderColor: 'var(--cn-border-danger)',
        boxShadow: `var(--cn-ring-danger)`,
        '&:hover': {
          backgroundColor: 'var(--cn-set-red-solid-bg)',
          borderColor: 'var(--cn-border-danger)',
          boxShadow: `var(--cn-ring-danger-hover)`
        }
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

  '.cn-checkbox-error .cn-checkbox-indicator:where([data-state=indeterminate])': {
    color: `var(--cn-set-red-solid-text)`
  },

  '.cn-checkbox-label': {
    font: 'var(--cn-body-normal) !important',
    color: 'var(--cn-text-1) !important',
    '&:where(.disabled)': {
      color: 'var(--cn-state-disabled-text) !important'
    },
    '@apply truncate': ''
  },

  '.cn-checkbox-label-no-truncate': {
    '& .cn-label-text': {
      '@apply overflow-visible': '',
      'text-overflow': 'clip',
      'white-space': 'nowrap'
    }
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
