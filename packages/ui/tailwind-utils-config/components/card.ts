export default {
  '.cn-card': {
    border: 'var(--cn-card-border) solid var(--cn-border-2)',
    borderRadius: 'var(--cn-card-default-radius)',
    backgroundColor: 'var(--cn-bg-2)',
    '&:hover': {
      borderColor: 'var(--cn-border-1)'
    },
    '@apply flex overflow-hidden': '',

    '&:where(.cn-card-sm)': {
      borderRadius: 'var(--cn-card-sm-radius)',
      '.cn-card-content-wrapper': {
        padding: `var(--cn-card-sm-py) var(--cn-card-sm-px)`
      }
    },
    '&:where(.cn-card-default)': {
      borderRadius: 'var(--cn-card-default-radius)',
      '.cn-card-content-wrapper': {
        padding: `var(--cn-card-default-py) var(--cn-card-default-px)`
      }
    },
    '&:where(.cn-card-md)': {
      borderRadius: 'var(--cn-card-md-radius)',
      '.cn-card-content-wrapper': {
        padding: `var(--cn-card-md-py) var(--cn-card-md-px)`
      }
    },

    '.cn-card-image': {
      '@apply object-cover': ''
    },

    '.cn-card-title': {
      color: 'var(--cn-text-1)',
      '@apply font-heading-base': ''
    },

    '.cn-card-content': {
      color: 'var(--cn-text-2)',
      '@apply font-body-normal': ''
    },

    '.cn-card-title + .cn-card-content': {
      '@apply mt-2': ''
    },

    '&:where(.cn-card-vertical)': {
      '@apply flex-col': '',
      '&:where(.cn-card-position-start)': {
        '@apply flex-col': '' // Image above content
      },
      '&:where(.cn-card-position-end)': {
        '@apply flex-col-reverse': '' // Image below content
      },

      '.cn-card-image': {
        height: `var(--cn-card-image-height)`,
        width: 'auto'
      }
    },

    '&:where(.cn-card-horizontal)': {
      '@apply flex-row': '',
      '&:where(.cn-card-position-start)': {
        '@apply flex-row': '' // Image to the left of content
      },
      '&:where(.cn-card-position-end)': {
        '@apply flex-row-reverse': '' // Image to the right of content
      },

      '.cn-card-image': {
        width: `var(--cn-card-image-width)`,
        height: 'auto'
      }
    },

    '&:where(.cn-card-selected)': {
      backgroundColor: 'var(--cn-comp-card-gradient)',
      borderColor: 'var(--cn-border-accent)'
    },
    '&:where(.cn-card-disabled)': {
      opacity: `var(--cn-disabled-opacity)`
    }
  }
}
