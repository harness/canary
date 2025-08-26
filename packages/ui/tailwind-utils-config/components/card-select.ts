export default {
  '.cn-card-select-root': {
    display: 'grid',

    '&:where(.cn-card-select-gap-sm)': {
      gap: 'var(--cn-layout-sm)'
    },
    '&:where(.cn-card-select-gap-md)': {
      gap: 'var(--cn-layout-md)'
    },
    '&:where(.cn-card-select-gap-lg)': {
      gap: 'var(--cn-layout-lg)'
    },

    '&:where(.cn-card-select-horizontal)': {
      '@apply w-full auto-cols-max grid-flow-col overflow-x-auto': ''
    },

    '&:where(.cn-card-select-vertical)': {
      '@apply auto-rows-max grid-flow-row': ''
    },

    '&:where(.cn-card-select-grid)': {
      '@apply w-full': '',
      gridTemplateColumns: 'repeat(var(--cols, 1), minmax(0, 1fr))',
      gridTemplateRows: 'repeat(var(--rows, 1), minmax(0, 1fr))'
    }
  },

  '.cn-card-select-item': {
    '@apply relative cursor-pointer transition-all flex items-center': '',
    borderWidth: 'var(--cn-card-border)',
    borderStyle: 'solid',
    borderColor: 'var(--cn-border-2)',
    borderRadius: 'var(--cn-card-md-radius)',
    backgroundColor: 'var(--cn-bg-2)',
    paddingTop: 'var(--cn-card-check-md-py)',
    paddingBottom: 'var(--cn-card-check-md-py)',
    paddingLeft: 'var(--cn-card-check-md-pl)',
    paddingRight: 'var(--cn-card-check-md-pr)',
    gap: 'var(--cn-card-check-md-gap)',

    '&:hover:not([data-disabled])': {
      borderColor: 'var(--cn-border-brand)'
    },

    '&:where(:not([data-disabled])):focus-visible': {
      outline: 'var(--cn-focus)',
      '@apply outline-offset-cn-tight': ''
    },

    '&:where([data-disabled])': {
      opacity: 'var(--cn-disabled-opacity)',
      '@apply cursor-not-allowed': ''
    },

    '&:where([data-state="checked"])': {
      borderColor: 'var(--cn-border-brand)',
      background: 'var(--cn-set-brand-soft-bg)'
    },

    '.cn-card-select-content': {
      '@apply flex items-center justify-between flex-1 min-w-0': ''
    },

    '.cn-card-select-content-left': {
      '@apply flex items-center flex-1 min-w-0': ''
    },

    '.cn-card-select-check': {
      position: 'absolute',
      right: 'var(--cn-spacing-4)',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--cn-text-brand)'
    },

    '.cn-card-select-title': {
      color: 'var(--cn-text-1)',
      '@apply font-body-strong': ''
    },

    '.cn-card-select-description': {
      color: 'var(--cn-text-2)',
      '@apply font-body-normal': ''
    },

    '.cn-card-select-title + .cn-card-select-description': {
      '@apply mt-1': ''
    },

    '.cn-card-select-icon, .cn-card-select-logo': {
      '@apply mr-3 shrink-0': '',
      width: '1.5rem',
      height: '1.5rem'
    },

    '.cn-card-select-content-container': {
      '@apply flex-1 min-w-0': ''
    }
  },

  '.cn-card-select-hidden-input': {
    '@apply sr-only': ''
  }
}
