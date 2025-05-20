export default {
  '.cn-modal-dialog-overlay': {
    backgroundColor: 'var(--cn-comp-dialog-backdrop)',
    padding: 'var(--cn-dialog-safezone)',
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
    padding: 'var(--cn-dialog-container)',
    gap: 'var(--cn-dialog-gap)',
    '@apply fixed left-1/2 top-1/2 z-50 flex flex-col translate-x-[-50%] translate-y-[-50%]': '',
    '@apply min-h-0': '',

    '&.cn-modal-dialog-sm': {
      width: `min(calc(100vw - (var(--cn-dialog-safezone) * 2)), var(--cn-dialog-sm))`
    },
    '&.cn-modal-dialog-md': {
      width: `min(calc(100vw - (var(--cn-dialog-safezone) * 2)), var(--cn-dialog-md))`
    },
    '&.cn-modal-dialog-lg': {
      width: `min(calc(100vw - (var(--cn-dialog-safezone) * 2)), var(--cn-dialog-lg))`
    }
  },

  // Header Component
  '.cn-modal-dialog-header': {
    '@apply flex flex-col': '',
    gap: `var(--cn-dialog-gap)`,

    '&.cn-modal-dialog-theme-default': {
      '.cn-modal-dialog-header-icon': {
        color: 'var(--cn-text-1)'
      }
    },
    '&.cn-modal-dialog-theme-warning': {
      '.cn-modal-dialog-header-icon': {
        color: 'var(--cn-text-warning)'
      }
    },
    '&.cn-modal-dialog-theme-danger': {
      '.cn-modal-dialog-header-icon': {
        color: 'var(--cn-text-danger)'
      }
    }
  },

  // Header Icon/Logo and Title
  '.cn-modal-dialog-header-title-row': {
    gap: 'var(--cn-spacing-2-half)',
    '@apply flex items-center': ''
  },
  '.cn-modal-dialog-header-icon': {
    '@apply flex items-center justify-center': '',
    width: `var(--cn-icon-size-default)`,
    height: `var(--cn-icon-size-default)`,
    flexShrink: '0'
  },
  '.cn-modal-dialog-header-logo': {
    '@apply flex items-center': '',
    height: `var(--cn-icon-size-default)`,
    flexShrink: '0'
  },
  '.cn-modal-dialog-title': {
    '@apply font-dialog-title': '',
    fontFamily: 'var(--cn-comp-dialog-title)'
  },

  // Header Description
  '.cn-modal-dialog-description': {
    color: 'var(--cn-text-2)',
    '@apply font-body-normal': ''
  },

  // Body Component
  '.cn-modal-dialog-body': {
    '@apply flex-grow': ''
  },

  // Footer Component
  '.cn-modal-dialog-footer': {
    borderTop: '1px solid var(--cn-border-3)',
    borderTopWidth: 'var(--cn-dialog-border)',
    paddingTop: 'var(--cn-dialog-footer-py)',
    paddingLeft: 'var(--cn-dialog-container)',
    paddingRight: 'var(--cn-dialog-container)',
    marginLeft: 'calc(-1 * var(--cn-dialog-container))',
    marginRight: 'calc(-1 * var(--cn-dialog-container))',
    '@apply flex justify-end gap-3': '',
    '@apply mt-auto': ''
  },

  // Close (X) Button
  '.cn-modal-dialog-close': {
    '@apply cursor-pointer flex items-center justify-center absolute': '',
    color: 'var(--cn-text-2)',
    width: `var(--cn-icon-size-default)`,
    height: `var(--cn-icon-size-default)`,
    top: 'var(--cn-dialog-container)',
    right: 'var(--cn-dialog-container)',
    '&:hover': {
      color: 'var(--cn-text-1)'
    },

    '&.cn-modal-dialog-close-icon': {
      width: `var(--cn-icon-size-default)`,
      height: `var(--cn-icon-size-default)`
    }
  }
}
