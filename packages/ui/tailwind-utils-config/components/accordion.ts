export default {
  '.cn-accordion': {
    minWidth: 'var(--cn-accordion-defailt-min-width)',

    '&-md': {
      minWidth: 'var(--cn-accordion-md-min-width)',
      '--cn-accordion-default-gap': 'var(--cn-accordion-md-gap)',
      '--cn-accordion-default-py': 'var(--cn-accordion-md-py)',

      '.cn-accordion-trigger-text': {
        '@apply font-heading-base': ''
      }
    },

    '&-item': {
      borderBottom: '1px solid var(--cn-border-3)',
      '&:hover:not([data-disabled])': {
        '.cn-accordion-trigger-indicator': {
          color: 'var(--cn-text-1)'
        }
      },

      '&:where([data-disabled]) [class*="cn-accordion"]': {
        color: 'var(--cn-state-disabled-text)'
      },

      '&:where([data-state="open"])': {
        '.cn-accordion-trigger-indicator': {
          '@apply rotate-180': ''
        }
      }
    },

    '&-trigger': {
      display: 'grid',
      alignItems: 'center',
      gridTemplateColumns: '1fr auto',
      gap: 'var(--cn-accordion-default-gap)',
      width: '100%',
      padding: 'var(--cn-accordion-default-py) 0',
      color: 'var(--cn-text-2)',

      '&-with': {
        '&-left-indicator': {
          gridTemplateColumns: 'auto 1fr'
        },
        '&-suffix': {
          gridTemplateColumns: '1fr auto auto'
        },
        '&-left-indicator-suffix': {
          gridTemplateColumns: 'auto 1fr auto'
        }
      },

      '&-text': {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: 'var(--cn-accordion-default-gap)',
        color: 'var(--cn-text-1)',
        '@apply font-body-strong': ''
      },

      '&-suffix': {
        color: 'var(--cn-text-3)',
        '@apply font-caption-single-line-normal': ''
      },

      '&-indicator': {
        color: 'var(--cn-text-2)',
        '@apply transition-[transform,color] duration-100 ease-in-out': ''
      }
    },

    '&-content': {
      paddingBottom: 'var(--cn-accordion-default-py)',
      color: 'var(--cn-text-2)',
      '@apply font-body-normal': '',

      '&-container': {
        overflow: 'hidden',

        '&:where([data-state="open"])': {
          '@apply animate-accordion-down': ''
        },

        '&:where([data-state="closed"])': {
          '@apply animate-accordion-up': ''
        }
      }
    }
  }
}
