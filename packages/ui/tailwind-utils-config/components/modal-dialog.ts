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
    maxWidth: 'calc(100vw - (var(--cn-dialog-safezone) * 2))',
    maxHeight: 'calc(100vh - (var(--cn-dialog-safezone) * 2))',
    paddingTop: 'var(--cn-dialog-py)',
    paddingBottom: 'var(--cn-dialog-py)',
    paddingLeft: 'var(--cn-dialog-px)',
    paddingRight: 'var(--cn-dialog-px)',
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
    gap: 'var(--cn-spacing-1-half)',
    paddingRight: 'var(--cn-spacing-6)',
    '@apply flex': ''
  },
  '.cn-modal-dialog-header-icon': {
    '@apply flex items-center justify-center': '',
    color: 'var(--cn-text-2)',
    width: `var(--cn-icon-size-lg)`,
    height: `var(--cn-icon-size-lg)`,
    flexShrink: '0'
  },
  '.cn-modal-dialog-header-logo': {
    '@apply flex items-center justify-center': '',
    width: `var(--cn-icon-size-lg)`,
    height: `var(--cn-icon-size-lg)`,
    flexShrink: '0'
  },
  '.cn-modal-dialog-title': {
    '@apply font-dialog-title': '',
    color: 'var(--cn-text-1)',
    paddingTop: 'var(--cn-spacing-1)'
  },

  // Header Description
  '.cn-modal-dialog-description': {
    color: 'var(--cn-text-2)',
    '@apply font-body-normal': ''
  },

  // Body Component
  '.cn-modal-dialog-body': {
    '@apply flex-grow h-full overflow-auto': ''
  },

  // Footer Component
  '.cn-modal-dialog-footer': {
    borderTop: '1px solid var(--cn-border-3)',
    borderTopWidth: 'var(--cn-dialog-border)',
    paddingTop: 'var(--cn-dialog-py)',
    paddingLeft: 'var(--cn-dialog-px)',
    paddingRight: 'var(--cn-dialog-px)',
    marginLeft: 'calc(-1 * var(--cn-dialog-px))',
    marginRight: 'calc(-1 * var(--cn-dialog-px))',
    '@apply flex justify-end gap-3': ''
  },

  // Close (X) Button
  '.cn-modal-dialog-close': {
    position: 'absolute',
    top: 'var(--cn-dialog-py)',
    right: 'var(--cn-dialog-px)',
    width: `var(--cn-icon-size-default)`,
    height: `var(--cn-icon-size-default)`
  }
}
