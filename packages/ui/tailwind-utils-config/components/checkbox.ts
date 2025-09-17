export default {
  '.cn-checkbox-wrapper': {
    display: 'flex',
    gap: 'var(--cn-spacing-2-half)',
    position: 'relative',
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

    '&:where(:not([disabled]))': {
      '&:focus-visible': {
        outline: 'var(--cn-focus)',
        outlineOffset: 'var(--cn-size-px)'
      },

      '&:hover': {
        backgroundColor: 'var(--cn-comp-selection-unselected-bg-hover)',
        borderColor: 'var(--cn-comp-selection-unselected-border-hover)'
      },

      '&:where([data-state=checked]):hover': {
        backgroundColor: 'var(--cn-comp-selection-selected-bg-hover)',
        borderColor: 'var(--cn-comp-selection-selected-border-hover)'
      },

      '&:where(.cn-checkbox-error:where(:not([data-state=checked]))):hover': {
        backgroundColor: 'var(--cn-comp-selection-unselected-bg)',
        borderColor: 'var(--cn-border-danger)',
        boxShadow: `var(--cn-ring-danger-hover)`
      },

      '&:where([data-state=indeterminate])': {
        '&:hover': {
          backgroundColor: 'var(--cn-comp-selection-selected-bg-hover)',
          borderColor: 'var(--cn-comp-selection-selected-border-hover)'
        },

        '&:where(.cn-checkbox-error)': {
          '&:hover': {
            backgroundColor: 'var(--cn-set-red-solid-bg)',
            borderColor: 'var(--cn-border-danger)',
            boxShadow: `var(--cn-ring-danger-hover)`
          }
        }
      }
    },

    '&:where(.cn-checkbox-error:where(:not([data-state=checked])))': {
      borderColor: 'var(--cn-border-danger)',
      boxShadow: `var(--cn-ring-danger)`
    },

    '&:where([disabled])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': '',

      '+ .cn-checkbox-label-wrapper': {
        '@apply opacity-cn-disabled': ''
      }
    },

    '&:where([data-state=checked])': {
      backgroundColor: 'var(--cn-comp-selection-selected-bg)',
      borderColor: 'var(--cn-comp-selection-selected-border)'
    },

    '&:where([data-state=checked][disabled])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': ''
    },

    '&:where([data-state=indeterminate])': {
      backgroundColor: 'var(--cn-comp-selection-selected-bg)',
      borderColor: 'var(--cn-comp-selection-selected-border)',

      '&:where(.cn-checkbox-error)': {
        backgroundColor: 'var(--cn-set-red-solid-bg)',
        borderColor: 'var(--cn-border-danger)',
        boxShadow: `var(--cn-ring-danger)`
      }
    },

    '&:where([data-state=indeterminate][disabled])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': ''
    }
  },

  '.cn-checkbox-indicator': {
    color: 'var(--cn-comp-selection-selected-item)',

    '&:where([disabled])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': ''
    },

    '&:where([data-state=checked][disabled], [data-state=indeterminate][disabled])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': ''
    }
  },

  '.cn-checkbox-error .cn-checkbox-indicator:where([data-state=indeterminate])': {
    color: `var(--cn-set-red-solid-text)`
  },

  '.cn-checkbox-label': {
    font: 'var(--cn-body-normal) !important',
    color: 'var(--cn-text-1) !important',
    '&:where(.disabled)': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': ''
    }
  },

  '.cn-checkbox-caption': {
    font: 'var(--cn-body-normal)',
    color: 'var(--cn-text-2)',
    '&:where(.disabled)': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': ''
    },
    '@apply truncate': ''
  }
}
