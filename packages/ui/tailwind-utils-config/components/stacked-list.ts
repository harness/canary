export default {
  '.cn-stacked-list': {
    '@apply w-full bg-cn-1 border rounded-3': '',

    '& > *:first-child > .cn-stacked-list-item': {
      '@apply rounded-t-3': ''
    },

    '& > *:last-child > .cn-stacked-list-item': {
      '@apply rounded-b-3': ''
    },

    '&-item:first-child': {
      '@apply !rounded-t-3': ''
    },

    '&-item:last-child': {
      '@apply rounded-b-3': ''
    },

    // List mod
    '&-rounded-top': {
      '@apply rounded-none rounded-t-3': '',

      '& > *:last-child > .cn-stacked-list-item, .cn-stacked-list-item:last-child': {
        '@apply rounded-none': ''
      }
    },

    '&-border-no': {
      '@apply border-0': ''
    },

    // List Item
    '&-item': {
      '@apply relative flex flex-1 flex-row flex-wrap items-center justify-start align-middle gap-cn-md border-b': '',

      '&:last-child': {
        '@apply border-0': ''
      },

      '&-header': {
        '@apply bg-cn-2': ''
      },

      '&-with-hover': {
        '@apply hover:bg-cn-hover cursor-pointer duration-150 ease-in-out': ''
      },

      '&-clickable-block': {
        '@apply absolute inset-0 w-full rounded-3 !z-0 outline-offset-cn-tight': ''
      },

      '&-thumbnail': {
        '@apply flex items-center': ''
      },

      '&-actions': {
        '@apply flex items-center': ''
      },

      '&-clickable': {
        'a, button': {
          '&:where(:not(.cn-stacked-list-item-clickable-block))': {
            '@apply z-10 relative': ''
          }
        }
      }
    },

    // Item Field
    '&-field': {
      '@apply grid flex-1 flex-col gap-cn-2xs items-stretch justify-stretch': '',

      '&-right': {
        '@apply flex items-end justify-end grow-0': ''
      },

      '&-title': {
        '@apply min-w-0': ''
      }
    }
  }
}
