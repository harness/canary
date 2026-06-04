export default {
  '.cn-calendar-day-selected:not(.cn-calendar-day-range-middle)': {
    color: 'var(--cn-set-brand-primary-text) !important',

    '&:hover:not(:disabled)': {
      color: 'var(--cn-set-brand-primary-text) !important'
    },

    '&:active:not(:disabled)': {
      color: 'var(--cn-set-brand-primary-text) !important'
    }
  },

  '.cn-calendar-day-today:not(.cn-calendar-day-selected)': {
    backgroundColor: 'var(--cn-set-brand-outline-bg)',
    color: 'var(--cn-set-brand-outline-text) !important',
    borderColor: 'var(--cn-set-brand-outline-border)',
    borderWidth: 'var(--cn-border-width-1)',
    borderStyle: 'solid',

    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--cn-set-brand-outline-bg-hover)',
      color: 'var(--cn-set-brand-outline-text) !important',
      borderColor: 'var(--cn-set-brand-outline-border)'
    },

    '&:active:not(:disabled)': {
      backgroundColor: 'var(--cn-set-brand-outline-bg-selected)',
      color: 'var(--cn-set-brand-outline-text) !important',
      borderColor: 'var(--cn-set-brand-outline-border)'
    }
  }
}
