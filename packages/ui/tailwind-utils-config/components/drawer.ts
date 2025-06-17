export default {
  '.cn-drawer': {
    '&-content': {
      backgroundColor: 'var(--cn-bg-2)',
      borderColor: 'var(--cn-border-3)',
      borderRadius: 'var(--cn-drawer-radius)',
      boxShadow: 'var(--cn-shadow-5)',
      '@apply fixed flex flex-col z-50 border': '',

      '&:where(.cn-drawer-content-right), &:where(.cn-drawer-content-left)': {
        '@apply inset-y-0': '',

        '&:where(.cn-drawer-content-sm)': {
          width: 'var(--cn-drawer-sm)'
        },
        '&:where(.cn-drawer-content-md)': {
          width: 'var(--cn-drawer-md)'
        },
        '&:where(.cn-drawer-content-lg)': {
          width: 'var(--cn-drawer-lg)'
        }
      },

      '&:where(.cn-drawer-content-top), &:where(.cn-drawer-content-bottom)': {
        '@apply inset-x-0': '',

        '&:where(.cn-drawer-content-sm)': {
          height: 'var(--cn-drawer-sm)'
        },
        '&:where(.cn-drawer-content-md)': {
          height: 'var(--cn-drawer-md)'
        },
        '&:where(.cn-drawer-content-lg)': {
          height: 'var(--cn-drawer-lg)'
        }
      },

      '&:where(.cn-drawer-content-right)': {
        '@apply border-r-0 rounded-r-none right-0': ''
      },

      '&:where(.cn-drawer-content-left)': {
        '@apply border-l-0 rounded-l-none left-0': ''
      },

      '&:where(.cn-drawer-content-top)': {
        '@apply border-t-0 rounded-t-none top-0': ''
      },

      '&:where(.cn-drawer-content-bottom)': {
        '@apply border-b-0 rounded-b-none bottom-0': ''
      }
    },

    '&-close-button': {
      '@apply absolute right-2 top-4 z-50': '',

      '&-icon': {
        flexShrink: '0',
        width: `var(--cn-icon-size-sm)`,
        height: `var(--cn-icon-size-sm)`
      }
    },

    '&-backdrop': {
      backgroundColor: 'var(--cn-comp-dialog-backdrop)',
      '@apply fixed inset-0 z-50': '',

      '&-nested': {
        backgroundColor: 'var(--cn-comp-dialog-backdrop-nested)'
      }
    },

    '&-header': {
      borderBottomWidth: 'var(--cn-border-width-1)',
      borderBottomColor: 'var(--cn-border-3)',
      gap: 'var(--cn-drawer-gap)',
      padding: 'var(--cn-drawer-container)',
      '@apply flex flex-col border-b': '',

      '&-icon': {
        flexShrink: '0',
        width: 'var(--cn-icon-size-lg)',
        height: 'var(--cn-icon-size-lg)'
      },

      '&-icon-color': {
        color: 'var(--cn-text-2)'
      },

      '&-top': {
        gap: 'var(--cn-spacing-2-half)',
        paddingRight: 'var(--cn-spacing-6)',
        '@apply flex items-center': ''
      },

      '&-title': {
        '@apply flex flex-col': ''
      }
    },

    '&-title': {
      font: 'var(--cn-comp-dialog-title)',
      color: 'var(--cn-text-1)'
    },

    '&-tagline': {
      font: 'var(--cn-caption-soft)',
      color: 'var(--cn-text-2)'
    },

    '&-description': {
      font: 'var(--cn-body-normal)',
      color: 'var(--cn-text-2)'
    },

    '&-body': {
      padding: 'var(--cn-drawer-container)',
      '@apply before:absolute before:inset-x-0 before:top-0 before:z-10 after:z-10 after:absolute after:inset-x-0 after:bottom-0':
        '',

      '&:before': {
        height: 'var(--cn-drawer-fade-height)',
        background: 'var(--cn-comp-dialog-fade-start)'
      },

      '&:after': {
        height: 'var(--cn-drawer-fade-height)',
        background: 'var(--cn-comp-dialog-fade-end)'
      }
    },

    '&-footer': {
      borderTopWidth: 'var(--cn-border-width-1)',
      borderTopColor: 'var(--cn-border-3)',
      gap: 'var(--cn-drawer-gap)',
      padding: 'var(--cn-drawer-container)',
      '@apply flex flex-col border-t': ''
    }
  }
}
