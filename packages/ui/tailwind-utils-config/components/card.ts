export default {
  '.cn-card': {
    '@apply rounded-lg bg-white text-gray-900 border border-gray-200 overflow-hidden': '',

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

    '&:where(.cn-card-vertical)': {
      '@apply flex-col': ''
    },
    '&:where(.cn-card-horizontal)': {
      '@apply flex-row': ''
    },

    '&:where(.cn-card-selected)': {
      '@apply ring-2 ring-blue-500': ''
    },
    '&:where(.cn-card-disabled)': {
      '@apply opacity-50 pointer-events-none': ''
    },

    '.cn-card-title': {
      '@apply font-semibold text-lg leading-tight text-black': ''
    },

    '.cn-card-image': {
      '@apply object-cover': ''
    }
  }
}
