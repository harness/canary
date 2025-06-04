export default {
  '.cn-table-v2': {
    '@apply w-full text-sm': '',

    // Table container
    '&-container': {
      '@apply relative w-full overflow-auto': ''
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
      '@apply caption-bottom py-2': ''
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
      '@apply [&_tr]:border-b bg-cn-background-2': ''
    },

    // Body
    '&-body': {
      '@apply [&_tr:last-child]:border-0': '',

      '&:where(.cn-table-v2-highlight-hover)': {
        '@apply [&>tr:hover]:bg-cn-background-hover': ''
      }
    },

    // Footer
    '&-footer': {
      '@apply bg-cn-background-softgray/50 border-t font-medium [&>tr]:last:border-b-0': ''
    },

    // Row
    '&-row': {
      '@apply border-b border-cn-borders-3 transition-colors': '',

      '&:where([data-state=selected])': {
        '@apply bg-cn-background-2': ''
      }
    },

    // Head cell
    '&-head': {
      '@apply text-cn-foreground-4 h-11 px-2 text-left align-middle font-medium': '',
      '@apply [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]': ''
    },

    // Data cell
    '&-cell': {
      '@apply px-2 py-2 align-middle': '',
      '@apply [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]': ''
    },

    // Caption
    '&-caption': {
      '@apply text-cn-foreground-3 mt-4 text-sm': ''
    }
  }
}
