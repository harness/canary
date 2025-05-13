export default {
  '.cn-card': {
    '@apply flex rounded-lg bg-white text-gray-900 border border-gray-200 overflow-hidden': '',

    '.cn-card-content': {
      '&:where(.cn-card-content-sm)': {
        '@apply p-4': ''
      },
      '&:where(.cn-card-content-md)': {
        '@apply p-6': ''
      },
      '&:where(.cn-card-content-lg)': {
        '@apply p-8': ''
      }
    },

    '.cn-card-title': {
      '@apply font-semibold text-lg leading-tight text-black': ''
    },

    '.cn-card-image': {
      '@apply object-cover': ''
    },

    '&:where(.cn-card-vertical)': {
      '@apply flex-col': '',
      '&:where(.cn-card-position-start)': {
        '@apply flex-col': '' // Image above content
      },
      '&:where(.cn-card-position-end)': {
        '@apply flex-col-reverse': '' // Image below content
      }
    },

    '&:where(.cn-card-horizontal)': {
      '@apply flex-row': '',
      '&:where(.cn-card-position-start)': {
        '@apply flex-row': '' // Image to the left of content
      },
      '&:where(.cn-card-position-end)': {
        '@apply flex-row-reverse': '' // Image to the right of content
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
