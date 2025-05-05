export default {
  '.cn-radio-wrapper': {
    display: 'flex',
    gap: 'var(--cn-spacing-2-half)',
    width: '100%'
  },

  '.cn-radio-label-wrapper': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-1)'
  },

  '.cn-radio-root': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: 'var(--cn-spacing-half)',
    width: 'var(--cn-size-4)',
    height: 'var(--cn-size-4)',
    border: 'var(--cn-border-width-1) solid var(--cn-comp-selection-unselected-border)',
    borderRadius: '50%',
    backgroundColor: 'var(--cn-comp-selection-unselected-bg)',

    '&:where([disabled])': {
      backgroundColor: 'var(--cn-state-disabled-bg)',
      borderColor: 'var(--cn-state-disabled-border)',
      cursor: 'not-allowed'
    },

    '&:where([data-state=checked])': {
      backgroundColor: 'var(--cn-comp-selection-selected-bg)',
      borderColor: 'var(--cn-comp-selection-selected-border)'
    },

    '&:where([data-state=checked][disabled])': {
      backgroundColor: 'var(--cn-state-disabled-bg-selected)',
      borderColor: 'var(--cn-state-disabled-border-selected)'
    }
  },

  '.cn-radio-indicator': {
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

  '.cn-radio-label': {
    font: 'var(--cn-body-strong) !important',
    color: 'var(--cn-text-1) !important',
    '&:where(.disabled)': {
      color: 'var(--cn-state-disabled-text) !important'
    },
    '@apply truncate': ''
  },

  '.cn-radio-caption': {
    font: 'var(--cn-body-normal)',
    color: 'var(--cn-text-2)',
    '&:where(.disabled)': {
      color: 'var(--cn-state-disabled-text)'
    },
    '@apply truncate': ''
  }
}
