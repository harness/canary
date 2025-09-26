export default {
  '.cn-card': {
    border: 'var(--cn-card-border) solid var(--cn-border-2)',
    borderRadius: 'var(--cn-card-md-radius)',
    backgroundColor: 'var(--cn-bg-1)',
    '@apply flex overflow-hidden select-none': '',

    '&:where(.cn-card-interactive)': {
      '&:hover:not(.cn-card-disabled)': {
        borderColor: 'var(--cn-border-brand)'
      }
    },

    '&:where(.cn-card-sm)': {
      borderRadius: 'var(--cn-card-sm-radius)',
      '.cn-card-content-wrapper': {
        padding: `var(--cn-card-sm-py) var(--cn-card-sm-px)`
      }
    },
    '&:where(.cn-card-md)': {
      borderRadius: 'var(--cn-card-md-radius)',
      '.cn-card-content-wrapper': {
        padding: `var(--cn-card-md-py) var(--cn-card-md-px)`
      }
    },
    '&:where(.cn-card-lg)': {
      borderRadius: 'var(--cn-card-lg-radius)',
      '.cn-card-content-wrapper': {
        padding: `var(--cn-card-lg-py) var(--cn-card-lg-px)`
      }
    },

    '.cn-card-image': {
      '@apply object-cover': ''
    },

    '.cn-card-title': {
      color: 'var(--cn-text-1)',
      '@apply font-heading-small': ''
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
      backgroundColor: 'var(--cn-set-brand-outline-bg)',
      borderColor: 'var(--cn-border-brand)'
    },
    '&:where(.cn-card-disabled)': {
      opacity: `var(--cn-disabled-opacity)`,
      '@apply cursor-not-allowed': ''
    },

    '&:where(:focus-visible)': {
      '@apply outline-offset-cn-tight': ''
    }
  }
}
