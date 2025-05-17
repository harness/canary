export default {
  '.cn-pagination': {
    '&-button': {
      paddingInline: 'var(--cn-pagination-btn-px)'
    },

    '&-content': {
      '@apply flex flex-grow items-center justify-center': '',
      gap: 'var(--cn-spacing-half)'
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
