export default {
  '.cn-button-group': {
    '@apply flex': '',

    '&-horizontal': {
      '& .cn-button': {
        '&:not(.cn-button-group-last)': {
          'margin-right': '-1px'
        },

        '&:not(.cn-button-group-first):not(.cn-button-group-last)': {
          'border-radius': '0'
        },

        '&.cn-button-group-first:not(.cn-button-group-last)': {
          'border-top-right-radius': '0',
          'border-bottom-right-radius': '0'
        },

        '&.cn-button-group-last:not(.cn-button-group-first)': {
          'border-top-left-radius': '0',
          'border-bottom-left-radius': '0'
        }
      }
    },

    '&-vertical': {
      '@apply flex-col': '',

      '& .cn-button': {
        '&:not(.cn-button-group-last)': {
          'margin-bottom': '-1px'
        },

        '&:not(.cn-button-group-first):not(.cn-button-group-last)': {
          'border-radius': '0'
        },

        '&.cn-button-group-first:not(.cn-button-group-last)': {
          'border-bottom-left-radius': '0',
          'border-bottom-right-radius': '0'
        },

        '&.cn-button-group-last:not(.cn-button-group-first)': {
          'border-top-left-radius': '0',
          'border-top-right-radius': '0'
        }
      }
    }
  }
}
