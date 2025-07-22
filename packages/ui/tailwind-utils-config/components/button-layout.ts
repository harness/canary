export default {
  '.cn-button-layout': {
    gap: 'var(--cn-layout-sm)',
    '@apply flex': '',

    '&-vertical': {
      '@apply flex-col': '',

      '.cn-button-layout-primary, .cn-button-layout-secondary': {
        '@apply flex-col': ''
      },

      '.cn-button-layout-primary': {
        '@apply order-1': ''
      },

      '.cn-button-layout-secondary': {
        '@apply order-2': ''
      }
    },

    '&-horizontal': {
      '&:where(.cn-button-layout-horizontal-end)': {
        '@apply justify-end': '',

        '.cn-button-layout-primary': {
          '@apply order-2 ml-auto': ''
        },

        '.cn-button-layout-secondary': {
          '@apply order-first mr-auto': ''
        }
      },

      '&:where(.cn-button-layout-horizontal-start)': {
        '.cn-button-layout-primary': {
          '@apply order-first mr-auto': ''
        },

        '.cn-button-layout-secondary': {
          '@apply order-2 ml-auto': ''
        }
      }
    },

    '&-primary, &-secondary': {
      gap: 'var(--cn-layout-sm)',
      '@apply flex': ''
    }
  }
}
