export default {
  '.cn-studio-card': {
    borderRadius: 'var(--cn-rounded-4)',
    border: '1px solid var(--cn-border-2)',
    backgroundColor: 'var(--cn-bg-3)',
    zIndex: '0',
    '@apply flex flex-col overflow-hidden shadow-cn-3 select-none': '',

    // Default size (single card)
    width: '220px',
    minWidth: '220px',
    maxWidth: '220px',
    height: 'var(--cn-size-40)',

    // Selected state with theme-based borders
    '&[data-selected="true"]': {
      '&[data-theme="default"]': {
        border: '1px solid var(--cn-border-brand)',
        boxShadow: '0 0 0 3px color-mix(in srgb, var(--cn-border-brand) 20%, transparent)'
      },
      '&[data-theme="success"]': {
        border: '1px solid var(--cn-border-success)',
        boxShadow: '0 0 0 3px color-mix(in srgb, var(--cn-border-success) 20%, transparent)'
      },
      '&[data-theme="warning"]:not(:has(> [data-status="executing"]))': {
        border: '1px solid var(--cn-border-warning)',
        boxShadow: '0 0 0 3px color-mix(in srgb, var(--cn-border-warning) 20%, transparent)'
      },
      '&[data-theme="danger"]': {
        border: '1px solid var(--cn-border-danger)',
        boxShadow: '0 0 0 3px color-mix(in srgb, var(--cn-border-danger) 20%, transparent)'
      }
    },

    // Group card variant
    '&:where(.cn-studio-card-group)': {
      width: 'auto',
      minWidth: 'var(--cn-size-90)',
      maxWidth: 'none',
      height: 'auto',

      '&:has(> .cn-studio-card-content > [data-expanded="true"])': {
        '@apply bg-cn-3/50': ''
      },

      '> .cn-studio-card-content': {
        minHeight: '108px'
      },

      '> .cn-studio-card-content:not(:has(> .cn-studio-card-message))': {
        '@apply justify-center items-start': ''
      },

      '&:has(> .cn-studio-card-content > [data-expanded="false"])': {
        width: 'var(--cn-size-90)',
        minWidth: 'var(--cn-size-90)',
        maxWidth: 'var(--cn-size-90)'
      }
    },

    // Shimmer effect for executing status
    '&:not(.cn-studio-card-group):has(> [data-status="executing"])': {
      '--border-angle': '0turn',
      '--main-bg':
        'conic-gradient(from var(--border-angle), var(--cn-bg-3), var(--cn-bg-3) 5%, var(--cn-bg-3) 60%, var(--cn-bg-3) 95%)',
      '--gradient-border':
        'conic-gradient(from var(--border-angle), transparent 20%, var(--cn-gradient-pipeline-running-border-from), var(--cn-gradient-pipeline-running-border-to) 99%, transparent)',

      border: 'solid 2px transparent !important',
      background:
        'var(--main-bg) padding-box, var(--gradient-border) border-box, var(--cn-border-3) border-box !important',
      backgroundPosition: 'center center',
      animation: 'studio-card-border-spin 5s linear infinite',

      '&::before': {
        content: '""',
        position: 'absolute',
        background:
          'conic-gradient(from var(--border-angle),transparent 20%,var(--cn-gradient-pipeline-running-glow-from),var(--cn-gradient-pipeline-running-glow-to) 99%,transparent)',
        filter: 'blur(6px)',
        zIndex: '-1',
        height: 'inherit',
        inset: '0'
      }
    }
  },

  // Header Component
  '.cn-studio-card-header': {
    minHeight: 'var(--cn-size-11)',
    color: 'var(--cn-text-1)',
    '@apply flex items-center gap-cn-2xs p-cn-xs pl-cn-md w-full': '',

    // Group card variant - add bottom border (direct child only)
    '.cn-studio-card-group > &': {
      borderBottom: '1px solid var(--cn-border-2)'
    },

    '&-title': {
      '@apply flex-1': ''
    }
  },

  // Content Component
  '.cn-studio-card-content': {
    '@apply flex flex-col flex-grow gap-cn-sm px-cn-md pb-cn-lg pt-cn-sm': ''
  },

  // Tag Component
  '.cn-studio-card-tag': {
    '@apply flex gap-cn-3xs p-cn-2xs rounded-t-cn-4 bg-cn-gray-outline border border-cn-gray-outline top-[-28px] right-0 absolute text-cn-gray-outline select-none':
      '',

    /**
     * For the corner scoop effect
     */
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: '-8px',
      right: '-1px',
      width: '8px',
      height: '8px',
      background: `radial-gradient(circle at bottom left, transparent 0px, transparent 7px, var(--cn-set-gray-outline-border) 7px, var(--cn-set-gray-outline-border) 8px, var(--cn-set-gray-outline-bg) 7px)`,
      borderRight: '1px solid var(--cn-set-gray-outline-border)'
    }
  },

  // Message Component
  '.cn-studio-card-message': {
    height: 'var(--cn-size-9)'
  },

  // Status Component
  '.cn-studio-card-status': {
    position: 'absolute',
    top: '-28px'
  },

  // Footer Component
  '.cn-studio-card-footer': {
    minHeight: 'var(--cn-size-29)',
    borderTop: '1px solid var(--cn-border-2)',
    backgroundColor: 'var(--cn-comp-pipeline-card-footer)',
    '@apply flex flex-col px-cn-md py-cn-md font-caption-normal': '',

    // Default: line-clamp-4 for regular cards
    '& span': {
      '@apply line-clamp-4': ''
    },

    // Group card variant - adjust padding and line-clamp
    '.cn-studio-card-group > &': {
      minHeight: 'var(--cn-size-13)',
      '@apply py-cn-md': '',

      '& span': {
        '@apply line-clamp-2': ''
      }
    }
  },

  '.cn-studio-card-expand-button-main, .cn-studio-card-button': {
    zIndex: '2',
    height: '28px',
    transitionDuration: '100ms',
    '@apply relative flex items-center gap-cn-3xs px-cn-sm py-cn-2xs shadow-cn-1 border border-cn-2 rounded-cn-3': ''
  },

  // Expand Button Component
  '.cn-studio-card-expand-button': {
    position: 'relative',
    width: 'fit-content',

    // Stack layers
    '&-stack': {
      pointerEvents: 'none',
      transitionProperty: 'transform',
      transitionDuration: '100ms',
      transitionTimingFunction: 'ease-out',
      willChange: 'transform',
      '@apply absolute shadow-cn-1 border border-cn-2 bg-cn-3 rounded-cn-4': '',

      // First stack layer (closer to button)
      '&-1': {
        zIndex: '1',
        insetBlock: '0',
        insetInline: '3px',
        transform: 'translateY(4px)'
      },

      // Second stack layer (furthest from button)
      '&-2': {
        zIndex: '0',
        insetBlock: '0',
        insetInline: '6px',
        transform: 'translateY(8px)'
      }
    },

    // Hover state - expand stacks
    '&:hover': {
      '.cn-studio-card-expand-button-stack-1': {
        transform: 'translateY(6px)'
      },
      '.cn-studio-card-expand-button-stack-2': {
        transform: 'translateY(12px)'
      }
    },

    // Expanded state - hide stacks
    '&:where([data-expanded="true"])': {
      '.cn-studio-card-expand-button-stack': {
        display: 'none'
      }
    }
  }
}
