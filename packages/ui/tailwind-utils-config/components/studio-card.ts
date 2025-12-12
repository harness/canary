export default {
  '.cn-studio-card': {
    borderRadius: 'var(--cn-rounded-4)',
    border: '1px solid var(--cn-border-2)',
    backgroundColor: 'var(--cn-bg-3)',
    '@apply flex flex-col overflow-hidden': '',

    // Default size (single card)
    width: '220px',
    minWidth: '220px',
    maxWidth: '220px',
    height: 'var(--cn-size-40)',

    // Group card variant
    '&:where(.cn-studio-card-group)': {
      width: 'auto',
      minWidth: 'var(--cn-size-90)',
      maxWidth: 'none',
      height: 'auto',

      '&:has(> .cn-studio-card-content > [data-expanded="false"])': {
        width: 'var(--cn-size-90)',
        minWidth: 'var(--cn-size-90)',
        maxWidth: 'var(--cn-size-90)'
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
    minHeight: 'var(--cn-size-14)',
    borderTop: '1px solid var(--cn-border-2)',
    backgroundColor: 'var(--cn-set-gray-outline-bg)',
    '@apply flex flex-col justify-center px-cn-md py-cn-xs': '',

    // Group card variant - adjust padding
    '.cn-studio-card-group > &': {
      minHeight: 'auto',
      '@apply py-cn-md': ''
    }
  },

  // Expand Button Component
  '.cn-studio-card-expand-button': {
    position: 'relative',
    width: 'fit-content',

    '&-main': {
      position: 'relative',
      zIndex: '2',
      height: '28px',
      borderRadius: 'var(--cn-rounded-3)',
      border: '1px solid var(--cn-border-2)',
      backgroundColor: 'var(--cn-bg-3)',
      transitionDuration: '200ms',
      '@apply flex items-center gap-cn-3xs px-cn-md py-cn-xs': ''
    },

    // Stack layers
    '&-stack': {
      position: 'absolute',
      pointerEvents: 'none',
      borderRadius: 'var(--cn-rounded-4)',
      border: '1px solid var(--cn-border-2)',
      backgroundColor: 'var(--cn-bg-3)',
      transitionProperty: 'transform',
      transitionDuration: '200ms',
      transitionTimingFunction: 'ease-out',
      willChange: 'transform',

      // First stack layer (closer to button)
      '&-1': {
        zIndex: '1',
        insetBlock: '0',
        insetInline: '3px',
        transform: 'translateY(3px)'
      },

      // Second stack layer (furthest from button)
      '&-2': {
        zIndex: '0',
        insetBlock: '0',
        insetInline: '6px',
        transform: 'translateY(6px)'
      }
    },

    // Hover state - expand stacks
    '&:hover': {
      '.cn-studio-card-expand-button-stack-1': {
        transform: 'translateY(4px)'
      },
      '.cn-studio-card-expand-button-stack-2': {
        transform: 'translateY(8px)'
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
