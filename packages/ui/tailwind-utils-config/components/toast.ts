export default {
  '.cn-toast-wrapper': {
    right: 'var(--cn-toast-offset-right)',
    bottom: 'var(--cn-toast-offset-bottom)'
  },

  '.cn-toast': {
    paddingBlock: 'var(--cn-toast-py)',
    paddingInline: 'var(--cn-toast-px)',
    minWidth: 'var(--cn-toast-min-width)',
    maxWidth: 'var(--cn-toast-max-width)',
    borderRadius: 'var(--cn-toast-radius)',
    borderWidth: 'var(--cn-toast-border)',
    boxShadow: 'var(--cn-shadow-3)',
    '@apply relative bg-cn-3 border-cn-2': '',

    ':where(.cn-toast-title)': {
      minHeight: 'var(--cn-toast-title-min-height)'
    },

    '.cn-toast-description-container': {
      // TODO: Update it with proper min height from design system
      minHeight: '100px',
      overflow: 'hidden',
      transition: 'grid-template-rows 0.2s ease-out',
      '@apply relative grid grid-rows-[0fr]': '',

      '&-expanded': {
        overflow: 'visible',
        paddingBottom: 'calc(var(--cn-spacing-3) + var(--cn-btn-size-md))',
        '@apply grid-rows-[1fr]': ''
      }
    },
    ':where(.cn-toast-description)': {
      minHeight: 'var(--cn-toast-title-min-height)'
    },

    '&.cn-toast-danger': {
      backgroundColor: 'var(--cn-comp-toast-danger-bg)',
      borderColor: 'var(--cn-comp-toast-danger-border)',

      '.cn-toast-fade-overlay': {
        background: 'var(--cn-comp-toast-danger-fade)'
      }
    },

    '&-fade-overlay': {
      background: 'var(--cn-comp-toast-fade)',
      visibility: 'visible',
      height: 'var(--cn-toast-fade-height)',
      opacity: '1',
      transition: 'opacity 0.2s linear',
      '@apply absolute bottom-0 left-0 right-0 pointer-events-none': '',

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
      '@apply absolute bottom-0 left-0 z-[1]': '',

      '&-icon-rotate-180': {
        transform: 'rotate(180deg)',
        transition: 'transform 0.2s ease-out'
      }
    }
  }
}
