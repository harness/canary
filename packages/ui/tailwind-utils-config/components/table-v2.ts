export default {
  '.cn-table-v2': {
    '@apply w-full text-sm': '',

    // Table container
    '&-container': {
      '@apply relative w-full rounded-lg border border-cn-borders-3 overflow-hidden': ''
    },

    // Table element
    '&-element': {
      '@apply w-full overflow-x-auto': '',

      '&:where(.cn-table-v2-disable-x-scroll)': {
        '@apply min-w-0 overflow-x-hidden': ''
      }
    },

    // Variants
    '&:where(.cn-table-v2-default)': {
      '@apply caption-bottom': '',
      '.cn-table-v2-cell': {
        '@apply py-2': ''
      }
    },

    '&:where(.cn-table-v2-relaxed)': {
      '@apply caption-bottom': '',
      '.cn-table-v2-cell': {
        '@apply py-3': '' // More vertical padding for relaxed variant
      }
    },

    '&:where(.cn-table-v2-compact)': {
      '@apply caption-bottom': '',
      '.cn-table-v2-cell': {
        '@apply py-1': '' // Less vertical padding for compact variant
      }
    },

    // Header
    '&-header': {
      '@apply border-b border-cn-borders-3 bg-cn-background-2': ''
    },

    // Container highlight on hover
    '&:where(.cn-table-v2-highlight-hover)': {
      '@apply [&_tbody>tr:hover]:bg-cn-background-hover': ''
    },

    // Body
    '&-body': {},

    // Footer
    '&-footer': {
      '@apply bg-cn-background-softgray/50 border-t font-medium [&>tr]:last:border-b-0': ''
    },

    // Row
    '&-row': {
      '@apply border-b border-cn-borders-3 transition-colors overflow-hidden': '',
      '@apply last:border-b-0': '',

      '&:where(.row-link-no-underline)': {
        '@apply [&_.cn-table-v2-cell-link]:no-underline': ''
      },

      '&:where([data-state=selected])': {
        '@apply bg-cn-background-3': ''
      },

      '&:where([data-checked=true])': {
        '@apply bg-cn-background-2': ''
      },

      '&-expanded': {
        '@apply bg-cn-background-2': ''
      }
    },

    // Head cell
    '&-head': {
      '@apply text-cn-foreground-4 h-11 px-2 text-left align-middle font-medium overflow-hidden': '',
      '@apply [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]': ''
    },

    // Data cell
    '&-cell': {
      '@apply px-2 py-2 align-middle': '',
      '@apply [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]': ''
    },

    // Cell link
    '&-cell-link': {
      '@apply block w-full h-full p-2 flex items-center': ''
    },

    // Caption
    '&-caption': {
      '@apply text-cn-foreground-3 mt-4 text-sm': ''
    }
  }
}
