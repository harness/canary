export default {
  ':where(.cn-radio-control)': {
    gap: 'var(--cn-layout-sm) var(--cn-input-wrapper-gap)'
  },

  ':where(.cn-radio-root)': {
    '@apply grid': '',
    gap: 'var(--cn-layout-sm)'
  },

  '.cn-radio-item-wrapper': {
    display: 'flex',
    gap: 'var(--cn-spacing-2-half)',
    width: '100%',

    /**
     * Align the radio indicator with the label
     */
    '&:where(:has(.cn-radio-item-label-wrapper)) .cn-radio-item': {
      top: 'var(--cn-spacing-px)'
    }
  },

  '.cn-radio-item-label-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-layout-4xs)'
  },

  '.cn-radio-item': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: '0',
    position: 'relative',
    width: 'var(--cn-size-4-half)',
    height: 'var(--cn-size-4-half)',
    border: 'var(--cn-border-width-1) solid var(--cn-comp-selection-unselected-border)',
    borderRadius: '50%',
    backgroundColor: 'var(--cn-comp-selection-unselected-bg)',
    transition: 'background-color 200ms ease-out, border-color 200ms ease-out, box-shadow 200ms ease-out',

    '&:where(:not([disabled])):focus-visible': {
      outline: 'var(--cn-focus)'
    },

    '&:where(:not([disabled])):hover': {
      backgroundColor: 'var(--cn-comp-selection-unselected-bg-hover)',
      borderColor: 'var(--cn-comp-selection-unselected-border-hover)',
      boxShadow: 'var(--cn-ring-selected)'
    },

    '&:where([disabled]), &:has([disabled])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': '',

      ' + .cn-radio-item-label-wrapper': {
        '@apply opacity-cn-disabled': ''
      }
    },

    '&:where([data-state=checked]), &:has([data-state=checked])': {
      backgroundColor: 'var(--cn-comp-selection-selected-bg)',
      borderColor: 'var(--cn-comp-selection-selected-border)',

      '&:where(:not([disabled])):hover': {
        backgroundColor: 'var(--cn-comp-selection-selected-bg-hover)',
        borderColor: 'var(--cn-comp-selection-selected-border-hover)'
      },

      '&:where([disabled])': {
        cursor: 'not-allowed',
        '@apply opacity-cn-disabled': ''
      }
    }
  },

  '.cn-radio-error:not(:has(.cn-radio-item[data-state=checked])) .cn-radio-item': {
    '&:where(:not([disabled]))': {
      borderColor: 'var(--cn-border-danger)',
      boxShadow: `var(--cn-ring-danger)`,
      '&:where(:hover)': {
        boxShadow: `var(--cn-ring-danger-hover)`
      }
    }
  },

  '.cn-radio-item-indicator': {
    width: 'var(--cn-size-2)',
    height: 'var(--cn-size-2)',
    borderRadius: '50%',
    backgroundColor: 'var(--cn-comp-selection-selected-item)',

    '&:where([disabled])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': ''
    },

    '&:where([data-state=checked][disabled])': {
      '@apply opacity-cn-disabled': ''
    }
  }
}
