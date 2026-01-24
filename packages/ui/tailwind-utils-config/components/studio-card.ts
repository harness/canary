/**
 * Items in studio card to reduce the opacity when other group card is hovered
 */
const StudioCardHelperItems = '.cn-studio-card-header, .cn-studio-card-message, .cn-studio-card-footer, .cn-studio-card-content > .cn-studio-card-expand-button, .cn-studio-card-content > .cn-studio-card-button, .cn-studio-card-tag, .cn-studio-card-status'

/**
 * Styles to apply to StudioCardHelperItems when the other group card is hovered
 */
const StudioCardHelperItemsHoveredStyles = {
  [StudioCardHelperItems]: {
    opacity: '0.45 !important',
    transition: 'opacity 200ms ease-in-out'
  }
}

/**
 * Shadow styles to apply to StudioCardHelperItems when the other group card is hovered
 */
const DimmedShadow3Style = {
  boxShadow: '0 4px 6px -1px lch(from var(--cn-shadow-color-3) l c h / 0.05), 0 2px 8px -2px lch(from var(--cn-shadow-color-3) l c h / 0.05)'
}

export default {
  '.cn-studio-card': {
    borderRadius: 'var(--cn-rounded-4)',
    border: '1px solid var(--cn-border-2)',
    backgroundColor: 'var(--cn-bg-3)',
    '@apply flex flex-col overflow-hidden shadow-cn-3 select-none': '',
    transitionProperty: 'background-color, opacity',
    transitionDuration: '200ms',
    transitionTimingFunction: 'ease-in-out',

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

    '&:has(.cn-studio-card-group:hover)': {
      backgroundColor: 'lch(from var(--cn-bg-3) l c h / 0.45) !important',
      borderColor: 'lch(from var(--cn-border-2) l c h / 0.65) !important',
      ...DimmedShadow3Style,


      '>': {
        ...StudioCardHelperItemsHoveredStyles
      }
    },

    // Group card variant
    '&:where(.cn-studio-card-group)': {
      width: 'auto',
      minWidth: '220px',
      maxWidth: 'none',
      height: 'auto',

      '&.cn-studio-card-stage': {
        minWidth: 'var(--cn-size-90)'
      },

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
        'conic-gradient(from var(--border-angle), var(--cn-bg-2), var(--cn-bg-2) 5%, var(--cn-bg-2) 60%, var(--cn-bg-2) 95%)',
      '--gradient-border':
        'conic-gradient(from var(--border-angle), var(--cn-border-2) 20%, var(--cn-gradient-pipeline-running-border-from), lch(from var(--cn-gradient-pipeline-running-border-to) l c h / 0.50) 90%, var(--cn-border-2))',

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

  '.cn-studio-card-execution': {
    zIndex: '0'
  },

  // Header Component
  '.cn-studio-card-header': {
    minHeight: 'var(--cn-size-11)',
    color: 'var(--cn-text-1)',
    '@apply flex items-center gap-cn-2xs p-cn-xs pl-cn-md w-full': '',

    '&-title': {
      '@apply flex-1': ''
    }
  },

  // Content Component
  '.cn-studio-card-content': {
    '@apply flex flex-col flex-grow gap-cn-sm px-cn-md pb-cn-lg pt-cn-sm': '',
    paddingTop: '0 !important',

    // When a group card is hovered anywhere inside this content
    '&:has(.cn-studio-card-group:hover)': {

      // Dim parent card's own UI elements
      '& > .cn-studio-card-expand-button, & > .cn-studio-card-button': {
        opacity: '0.45 !important',
        transitionProperty: 'opacity',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease-in-out'
      },

      '& .cn-studio-card:not(:hover)': {
        backgroundColor: 'lch(from var(--cn-bg-3) l c h / 0.45) !important',

        '&:not(:has(> [data-status="executing"]))': {
          borderColor: 'lch(from var(--cn-border-2) l c h / 0.65) !important',
        },
        ...DimmedShadow3Style,
        ...StudioCardHelperItemsHoveredStyles
      },

      // Preserve opacity for the hovered group itself
      '& .cn-studio-card-group:hover': {
        opacity: '1 !important'
      },

      // Preserve opacity for all descendants of the hovered group
      '& .cn-studio-card-group:hover .cn-studio-card': {
        opacity: '1 !important',

        '&:not(:has(> [data-status="executing"]))': {
          borderColor: 'var(--cn-border-2) !important',
          // borderColor: 'lch(from var(--cn-border-2) l c h / 0.65) !important',
        },
        '@apply shadow-cn-3': '',

        [StudioCardHelperItems]: {
          opacity: '1 !important',
        },
      },

      // Preserve opacity for all elements inside the hovered group
      '& .cn-studio-card-group:hover *': {
        opacity: '1 !important',
      }
    }
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

  '.cn-studio-card-expand-button-main': {
    zIndex: '2',
    height: '100%',
    width: '100%',
    transitionProperty: 'transform',
    transitionDuration: '100ms',
    '@apply relative flex flex-col gap-cn-2xs shadow-cn-1 border border-cn-2 rounded-cn-3 overflow-hidden bg-cn-3': ''
  },

  '.cn-studio-card-button': {
    zIndex: '2',
    height: '28px',
    transitionDuration: '100ms',
    '@apply relative flex items-center gap-cn-3xs px-cn-sm py-cn-2xs shadow-cn-1 border border-cn-2 rounded-cn-3': ''
  },

  '.cn-studio-card-expand-button-top': {
    '@apply flex items-center gap-cn-2xs p-cn-xs pl-cn-md flex-1': ''
  },

  '.cn-studio-card-expand-button-bottom': {
    '@apply flex items-center justify-end gap-cn-2xs py-cn-xs px-cn-md flex-1 border-t border-cn-2': '',
    backgroundColor: 'var(--cn-comp-pipeline-card-footer)',
  },

  // Expand Button Component
  '.cn-studio-card-expand-button': {
    position: 'relative',
    width: '226px',
    height: 'var(--cn-size-22)',
    transition: 'transform 0.1s linear',

    // Stack layers
    '&-stack': {
      pointerEvents: 'none',
      transitionProperty: 'transform',
      transitionDuration: '100ms',
      transitionTimingFunction: 'ease-out',
      willChange: 'transform',
      '@apply absolute shadow-cn-1 border border-cn-2 bg-cn-3 rounded-cn-3': '',

      // First stack layer (closer to button)
      '&-1': {
        zIndex: '1',
        insetBlock: '3px',
        insetInline: '0',
        transform: 'translateX(3px)'
      },

      // Second stack layer (furthest from button)
      '&-2': {
        zIndex: '0',
        insetBlock: '6px',
        insetInline: '0',
        transform: 'translateX(6px)'
      }
    },

    // Hover state - expand stacks and translate button right
    '&:hover': {
      transform: 'scale(1.02)',

      '.cn-studio-card-expand-button-stack-1': {
        transform: 'translateX(4px)'
      },
      '.cn-studio-card-expand-button-stack-2': {
        transform: 'translateX(8px)'
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
