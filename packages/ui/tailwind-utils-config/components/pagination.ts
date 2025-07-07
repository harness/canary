export default {
  '.cn-pagination': {
    '&-root': {
      containerType: 'inline-size',
      // TODO: Design system: How to handle magic numbers?
      '@apply mx-auto w-full max-w-[700px]': '',

      // Container query to hide pagination pages on smaller spaces
      '@container (max-width: 400px)': {
        '.cn-pagination-pages': {
          '@apply hidden': ''
        }
      }
    },

    '&-button': {
      paddingInline: 'var(--cn-pagination-btn-px)'
    },

    '&-content': {
      '@apply flex flex-grow items-center justify-center': '',
      gap: 'var(--cn-spacing-half)',

      '&:where(.cn-pagination-hide-pages)': {
        '@apply justify-center': ''
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
