export default {
  '.cn-pagination': {
    '&-root': {
      // TODO: Design system: How to handle magic numbers?
      '@apply mx-auto w-full max-w-[700px]': ''
    },

    '&-button': {
      paddingInline: 'var(--cn-pagination-btn-px)'
    },

    '&-content': {
      '@apply flex flex-grow items-center justify-center': '',
      gap: 'var(--cn-spacing-half)',

      '&:where(.cn-pagination-hide-pages)': {
        '@apply justify-end': ''
      },

      '&:where(:not(.cn-pagination-hide-pages))': {
        ':where(.cn-pagination-item-previous)': {
          '@apply flex-1': ''
        },
        ':where(.cn-pagination-item-next)': {
          '@apply flex-1 text-right': ''
        }
      }
    },

    // body-single-line-strong
    '&-previous': {
      paddingInline: 'var(--cn-pagination-btn-px)'
    },
    '&-next': {
      paddingInline: 'var(--cn-pagination-btn-px)'
    },
    '&-ellipsis': {
      '@apply font-body-single-line-strong select-none': '',
      height: 'var(--cn-btn-size-sm)',
      paddingInline: 'var(--cn-pagination-btn-px)'
    }
  }
}
