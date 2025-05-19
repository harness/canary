export default {
  '.cn-modal-dialog-overlay': {
    backgroundColor: 'var(--cn-comp-dialog-backdrop)',
    '@apply fixed inset-0 z-50 backdrop-blur-sm': ''
  },

  '.cn-modal-dialog-content': {
    backgroundColor: 'var(--cn-bg-2)',
    borderRadius: 'var(--cn-dialog-radius)',
    border: '1px solid var(--cn-border-3)',
    borderWidth: 'var(--cn-dialog-border)',
    boxShadow: 'var(--cn-shadow-5)',
    width: 'var(--cn-modal-width-sm)',
    maxWidth: '100%',
    padding: 'var(--cn-dialog-safezone)',
    '@apply fixed left-1/2 top-1/2 z-50 flex flex-col translate-x-[-50%] translate-y-[-50%]': '',

    '&.cn-modal-size-md': {
      width: 'var(--cn-modal-width-md)'
    },
    '&.cn-modal-size-lg': {
      width: 'var(--cn-modal-width-lg)'
    },

    '&.cn-theme-danger': {
      '.cn-modal-dialog-title': {
        color: 'var(--cn-text-danger)'
      }
    },
    '&.cn-theme-warning': {
      '.cn-modal-dialog-title': {
        color: 'var(--cn-text-warning)'
      }
    }
  },

  '.cn-modal-dialog-header': {
    '@apply flex items-center gap-4': '',
    padding: 'var(--cn-dialog-header-py) 0',
    marginBottom: 'var(--cn-spacing-4)'
  },

  '.cn-modal-dialog-header-icon': {
    '@apply flex items-center justify-center': '',
    width: '24px',
    height: '24px',
    flexShrink: '0',

    '.cn-theme-default &': {
      color: 'var(--cn-text-1)'
    },
    '.cn-theme-warning &': {
      color: 'var(--cn-text-warning)'
    },
    '.cn-theme-danger &': {
      color: 'var(--cn-text-danger)'
    }
  },

  '.cn-modal-dialog-header-logo': {
    '@apply flex items-center': '',
    height: '24px',
    flexShrink: '0'
  },

  '.cn-modal-dialog-title': {
    '@apply font-dialog-title flex-grow': '',
    color: 'var(--cn-text-1)',
    fontFamily: 'var(--cn-comp-dialog-title)',
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '500'
  },

  '.cn-modal-dialog-description': {
    color: 'var(--cn-text-2)',
    '@apply font-body-normal': '',
    marginTop: 'var(--cn-spacing-1)',
    fontSize: '14px',
    lineHeight: '20px'
  },

  '.cn-modal-dialog-body': {
    '@apply flex-grow': '',
    marginBottom: 'var(--cn-spacing-6)'
  },

  '.cn-modal-dialog-footer': {
    borderTop: '1px solid var(--cn-border-3)',
    borderTopWidth: 'var(--cn-dialog-border)',
    paddingTop: 'var(--cn-spacing-4)',
    '@apply flex justify-end gap-2': ''
  },

  '.cn-modal-dialog-close': {
    '@apply cursor-pointer flex items-center justify-center absolute': '',
    color: 'var(--cn-text-2)',
    width: '16px',
    height: '16px',
    top: '20px',
    right: '20px',
    '&:hover': {
      color: 'var(--cn-text-1)'
    }
  }
}
