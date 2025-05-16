export default {
  '.cn-multi-select': {
    '&-outer-container': {
      '@apply flex flex-col gap-2': ''
    },
    '&-container': {
      color: 'var(--cn-text-1)',
      minHeight: 'var(--cn-input-size-default)',
      border: 'var(--cn-input-border) solid var(--cn-border-2)',
      borderRadius: 'var(--cn-input-radius)',
      backgroundColor: 'var(--cn-bg-2)',
      '@apply w-full font-body-normal transition-[color,box-shadow,border-color] px-3 py-2': '',

      '&:where(:focus-within)': {
        borderColor: 'var(--cn-border-1)',
        boxShadow: 'var(--cn-ring-selected)',
        outline: 'none'
      },

      '&:where(:hover):not(:has(input[disabled]))': {
        borderColor: 'var(--cn-border-1)'
      }
    },

    '&-tag-wrapper': {
      '@apply relative flex flex-wrap items-center gap-2': ''
    },

    '&-input': {
      '@apply flex-1 bg-transparent text-inherit outline-none w-full': '',
      '&::placeholder': {
        color: 'var(--cn-text-3)'
      },

      '&:where([disabled])': {
        cursor: 'not-allowed',
        '&::placeholder': {
          color: 'var(--cn-state-disabled-text)'
        }
      }
    },

    '&-dropdown': {
      backgroundColor: 'var(--cn-bg-2)',
      borderColor: 'var(--cn-border-2)',
      '@apply border rounded-md shadow-md mt-1 overflow-hidden animate-in absolute top-1 z-10 w-full outline-none': '',
      maxHeight: '15rem'
    }
  }
}
