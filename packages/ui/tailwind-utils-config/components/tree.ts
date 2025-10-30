export default {
  '.cn-file-tree': {
    '&-item': {
      '@apply relative text-cn-2 grid grid-flow-col grid-cols-[auto_1fr] items-center gap-cn-3xs font-body-normal w-[fill-available]':
        '',
      minHeight: 'var(--cn-tree-item-height)',
      padding: 'var(--cn-tree-item-py) var(--cn-tree-item-pr) var(--cn-tree-item-py)',

      '&-with-action-buttons': {
        '@apply grid-cols-[auto_1fr_auto]': ''
      },

      '&-wrapper': {
        '@apply relative transition-colors': '',
        borderRadius: 'var(--cn-tree-item-radius)',

        '&:hover': {
          '@apply text-cn-1 bg-cn-hover': ''
        },

        '&.cn-file-tree-item-active': {
          '@apply text-cn-1 bg-cn-selected': '',

          '&::after': {
            content: '""',
            '@apply absolute h-cn-md w-cn-3xs rounded-full bg-cn-brand-primary -left-cn-2xs top-1/2 -translate-y-1/2':
              ''
          }
        }
      },

      '&-leaf': {
        '@apply pl-cn-lg select-none': ''
      },

      '&-content': {
        '@apply pb-0': '',
        marginLeft: 'calc(var(--cn-layout-md) + 10px)'
      }
    },
    '&-folder-trigger': {
      '@apply pl-cn-2xs transition-colors cursor-pointer': '',
      borderTopLeftRadius: 'var(--cn-tree-item-radius)',
      borderBottomLeftRadius: 'var(--cn-tree-item-radius)',
      height: 'var(--cn-tree-item-height)',
      width: 'var(--cn-button-size-3xs)',

      '.cn-accordion-trigger-indicator': {
        '@apply flex mt-0 -rotate-90 self-center data-[state=open]:-rotate-0 pointer-events-none': ''
      }
    },
    '&-folder-item': {
      '&:has(:hover)': {
        '@apply bg-cn-hover': ''
      }
    }
  }
}
