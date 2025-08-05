export default {
  '.cn-modal-dialog-overlay': {
    backgroundColor: 'var(--cn-comp-dialog-backdrop)',
    padding: 'var(--cn-dialog-safezone)',
    '@apply fixed inset-0 z-50': ''
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
    paddingTop: 'var(--cn-dialog-px)',
    paddingBottom: 'var(--cn-dialog-py)',
    paddingLeft: 'var(--cn-dialog-px)',
    paddingRight: 'var(--cn-dialog-px)',
    '@apply fixed left-1/2 top-1/2 z-50 flex flex-col translate-x-[-50%] translate-y-[-50%] min-h-0': '',
    '@apply duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95':
      '',
    '&[data-state="open"]': {
      animation: 'cnDialogSlideIn 0.2s ease-out forwards'
    },
    '&[data-state="closed"]': {
      animation: 'cnDialogSlideOut 0.2s ease-in forwards'
    },

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
    '@apply flex': '',
    '.cn-modal-dialog-content:has(.cn-modal-dialog-close) > .cn-modal-dialog-header &': {
      paddingRight: 'var(--cn-spacing-8)'
    }
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
    marginTop: 'var(--cn-dialog-gap)',
    '@apply font-body-normal': ''
  },

  // Body Component
  '.cn-modal-dialog-body': {
    '--cn-modal-dialog-scroll-compensation': '4px',
    paddingInline: 'var(--cn-modal-dialog-scroll-compensation)',
    paddingBottom: 'var(--cn-modal-dialog-scroll-compensation)',
    marginInline: 'calc(var(--cn-modal-dialog-scroll-compensation) * -1)',
    marginBottom: 'calc(var(--cn-modal-dialog-scroll-compensation) * -1)',
    marginTop: 'var(--cn-dialog-gap)',
    height: '100%',

    '&-content': {
      display: 'grid',
      alignContent: 'start',
      gap: 'var(--cn-layout-xl)'
    }
  },

  // Footer Component
  '.cn-modal-dialog-footer': {
    borderTop: '1px solid var(--cn-border-3)',
    borderTopWidth: 'var(--cn-dialog-border)',
    paddingTop: 'var(--cn-dialog-py)',
    paddingLeft: 'var(--cn-dialog-px)',
    paddingRight: 'var(--cn-dialog-px)',
    marginTop: 'var(--cn-dialog-px)',
    marginLeft: 'calc(-1 * var(--cn-dialog-px))',
    marginRight: 'calc(-1 * var(--cn-dialog-px))'
  },

  // Close (X) Button
  '.cn-modal-dialog-close': {
    position: 'absolute',
    top: '16px',
    right: '10px'
  },

  '.dialog': {
    '&-backdrop': {
      backgroundColor: 'var(--cn-comp-dialog-backdrop)'
    }
  },

  // Slide in and slide out animations
  '@keyframes cnDialogSlideIn': {
    '0%': {
      transform: 'translate(-50%, -48%)',
      opacity: '0'
    },
    '100%': {
      transform: 'translate(-50%, -50%)',
      opacity: '1'
    }
  },
  '@keyframes cnDialogSlideOut': {
    '0%': {
      transform: 'translate(-50%, -50%)',
      opacity: '1'
    },
    '100%': {
      transform: 'translate(-50%, -48%)',
      opacity: '0'
    }
  }
}
