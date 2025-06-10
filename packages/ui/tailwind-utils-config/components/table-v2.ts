export default {
  '.cn-table-v2': {
    '@apply w-full text-sm': '',

    // Table container
    '&-container': {
      '@apply relative w-full overflow-hidden border-cn-borders-3': '',
      borderWidth: 'var(--cn-table-border)',
      borderRadius: 'var(--cn-table-radius)'
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
        paddingTop: 'var(--cn-table-cell-py-default)',
        paddingBottom: 'var(--cn-table-cell-py-default)',
        minHeight: 'var(--cn-table-cell-min-default)'
      }
    },

    '&:where(.cn-table-v2-relaxed)': {
      '@apply caption-bottom': '',
      '.cn-table-v2-cell': {
        paddingTop: 'var(--cn-table-cell-py-relaxed)',
        paddingBottom: 'var(--cn-table-cell-py-relaxed)',
        minHeight: 'var(--cn-table-cell-min-relaxed)'
      }
    },

    '&:where(.cn-table-v2-compact)': {
      '@apply caption-bottom': '',
      '.cn-table-v2-cell': {
        paddingTop: 'var(--cn-table-cell-py-compact)',
        paddingBottom: 'var(--cn-table-cell-py-compact)',
        minHeight: 'var(--cn-table-cell-min-compact)'
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

      '&:where([data-checked=true])': {
        backgroundColor: 'var(--cn-state-selected)'
      },

      '&-expanded': {
        backgroundColor: 'var(--cn-state-selected)'
      }
    },

    // Head cell
    '&-head': {
      '@apply text-cn-foreground-4 text-left align-middle font-medium overflow-hidden': '',
      '@apply [&:has([role=checkbox])]:py-0 [&:has([role=checkbox])]:!pr-0 [&>[role=checkbox]]:translate-y-[2px]': '',
      '@apply [&:has([role=button])]:py-0 [&:has([role=button])]:!pr-0': '',
      paddingLeft: 'var(--cn-table-header-px)',
      paddingRight: 'var(--cn-table-header-px)',
      paddingTop: 'var(--cn-table-header-py)',
      paddingBottom: 'var(--cn-table-header-py)',
      gap: 'var(--cn-table-header-gap)',
      minHeight: 'var(--cn-table-header-min)'
    },

    // Data cell
    '&-cell': {
      '@apply align-middle': '',
      '@apply [&:has([role=checkbox])]:py-0 [&:has([role=checkbox])]:!pr-0 [&>[role=checkbox]]:translate-y-[2px]': '',
      '@apply [&:has([role=button])]:py-0 [&:has([role=button])]:!pr-0': '',
      paddingLeft: 'var(--cn-table-cell-px)',
      paddingRight: 'var(--cn-table-cell-px)',
      gap: 'var(--cn-table-cell-gap)'
    },

    // Cell link
    '&-cell-link': {
      '@apply block w-full h-full flex items-center': '',
      paddingLeft: 'var(--cn-table-cell-px)',
      paddingRight: 'var(--cn-table-cell-px)'
    },

    // Variant-specific cell link padding
    '&:where(.cn-table-v2-default) .cn-table-v2-cell-link': {
      paddingTop: 'var(--cn-table-cell-py-default)',
      paddingBottom: 'var(--cn-table-cell-py-default)'
    },
    '&:where(.cn-table-v2-relaxed) .cn-table-v2-cell-link': {
      paddingTop: 'var(--cn-table-cell-py-relaxed)',
      paddingBottom: 'var(--cn-table-cell-py-relaxed)'
    },
    '&:where(.cn-table-v2-compact) .cn-table-v2-cell-link': {
      paddingTop: 'var(--cn-table-cell-py-compact)',
      paddingBottom: 'var(--cn-table-cell-py-compact)'
    },

    // Caption
    '&-caption': {
      '@apply text-cn-foreground-3 mt-4 text-sm': ''
    }
  }
}
