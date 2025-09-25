export default {
  '.cn-toast-wrapper': {
    right: 'var(--cn-toast-offset-right)',
    bottom: 'var(--cn-toast-offset-bottom)'
  },

  '.cn-toast': {
    paddingBlock: 'var(--cn-toast-py)',
    paddingInline: 'var(--cn-toast-px)',
    width: 'var(--cn-toast-max-width)',
    borderRadius: 'var(--cn-toast-radius)',
    borderWidth: 'var(--cn-toast-border)',
    boxShadow: 'var(--cn-shadow-3)',
    userSelect: 'none',
    '@apply relative bg-cn-3 border-cn-2 text-cn-1': '',

    '&:has(.cn-toast-description-container-expanded)': {
      paddingBottom: 'calc(var(--cn-spacing-3) + var(--cn-btn-size-md))'
    },

    ':where(.cn-toast-title)': {
      minHeight: 'var(--cn-toast-title-min-height)'
    },

    '.cn-toast-description-container': {
      maxHeight: '100px',
      overflow: 'hidden',
      transition: 'max-height 0.2s ease-out',
      '@apply relative': '',

      '&-expanded': {
        maxHeight: '300px',
        overflowY: 'auto',
        paddingBottom: 'var(--cn-spacing-2)'
      }
    },

    '.cn-toast-description': {
      '@apply text-cn-2': ''
    },

    '&.cn-toast-danger': {
      backgroundColor: 'var(--cn-comp-toast-danger-bg)',
      borderColor: 'var(--cn-comp-toast-danger-border)',
      color: 'var(--cn-comp-toast-danger-text)',

      '.cn-toast-fade-overlay': {
        background: 'var(--cn-comp-toast-danger-fade)'
      },

      '.cn-toast-description': {
        '@apply text-inherit': ''
      },

      // Danger toast action button styles
      '.cn-toast-action-button': {
        backgroundColor: 'var(--cn-comp-toast-danger-action-btn-bg) !important',
        borderColor: 'var(--cn-comp-toast-danger-action-btn-bg) !important',
        color: 'var(--cn-comp-toast-danger-action-btn-text) !important',
        marginLeft: 'var(--cn-spacing-4)'
      }
    },

    '&-fade-overlay': {
      background: 'var(--cn-comp-toast-fade)',
      visibility: 'visible',
      height: 'var(--cn-toast-fade-height)',
      opacity: '1',
      transition: 'opacity 0.2s linear',
      '@apply absolute bottom-0.5 left-0.5 right-0.5 pointer-events-none': '',

      '&-not-visible': {
        visibility: 'hidden',
        opacity: '0',
        transition: 'visibility 0s 2s, opacity 0.2s linear'
      }
    },

    '&-expand-controls': {
      '@apply relative': ''
    },

    '&-expand-button': {
      '@apply absolute bottom-0 z-[1]': '',
      '&-icon-rotate-180': {
        transform: 'rotate(180deg)',
        transition: 'transform 0.2s ease-out'
      }
    }
  }
}
