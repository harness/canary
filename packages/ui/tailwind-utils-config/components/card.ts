export default {
  '.cn-card': {
    '@apply flex bg-white text-gray-900 border border-gray-200 overflow-hidden': '',

    '&:where(.cn-card-sm)': {
      '@apply rounded-md': '',
      '.cn-card-content-wrapper': { '@apply p-4': '' }
    },
    '&:where(.cn-card-default)': {
      '@apply rounded-lg': '',
      '.cn-card-content-wrapper': { '@apply p-6': '' }
    },
    '&:where(.cn-card-lg)': {
      '@apply rounded-xl': '',
      '.cn-card-content-wrapper': { '@apply p-8': '' }
    },

    '.cn-card-title': {
      '@apply font-semibold text-lg leading-tight text-black': ''
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
        width: 'auto',
        '@apply object-cover': ''
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
        height: 'auto',
        '@apply object-cover': ''
      }
    },

    '&:where(.cn-card-selected)': {
      '@apply ring-2 ring-blue-500': ''
    },
    '&:where(.cn-card-disabled)': {
      '@apply opacity-50 pointer-events-none': ''
    }
  }
}
