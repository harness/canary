export default {
  '.cn-accordion': {
    display: 'flex',
    flexDirection: 'column',
    '--cn-accordion-indicator-mt': '4px',
    minWidth: 'var(--cn-accordion-sm-min-width)',

    '&.cn-accordion-card': {
      gap: 'var(--cn-accordion-sm-card-gap-y)'
    },

    '&-md': {
      minWidth: 'var(--cn-accordion-md-min-width)',
      '--cn-accordion-sm-gap': 'var(--cn-accordion-md-gap)',
      '--cn-accordion-sm-py': 'var(--cn-accordion-md-py)',
      '--cn-accordion-indicator-mt': '2px',

      '.cn-accordion-trigger-text': {
        '@apply font-heading-base': ''
      },

      '&.cn-accordion-card': {
        gap: 'var(--cn-accordion-md-card-gap-y)'
      }
    },

    '&-item': {
      borderBottom: '1px solid var(--cn-border-3)',

      '&:where([data-disabled]) [class*="cn-accordion"]': {
        cursor: 'not-allowed',
        '@apply opacity-cn-disabled': ''
      }
    },

    '&-trigger': {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--cn-accordion-sm-gap)',
      width: '100%',
      padding: 'var(--cn-accordion-sm-py) 0',
      color: 'var(--cn-text-2)',

      '&:hover:not([data-disabled])': {
        '.cn-accordion-trigger-indicator': {
          color: 'var(--cn-text-1)'
        }
      },

      '&:where(:focus-visible:not([data-disabled]))': {
        outline: 'var(--cn-focus)'
      },

      '&:where([data-state="open"])': {
        '.cn-accordion-trigger-indicator': {
          '@apply rotate-180': ''
        }
      },

      '&-text': {
        width: '100%',
        textAlign: 'start',
        color: 'var(--cn-text-1)',
        '@apply font-body-strong': ''
      },

      '&-suffix': {
        color: 'var(--cn-text-3)',
        whiteSpace: 'nowrap',
        '@apply font-caption-single-line-normal': ''
      },

      '&-indicator': {
        alignSelf: 'start',
        marginTop: 'var(--cn-accordion-indicator-mt)',
        color: 'var(--cn-text-2)',
        '@apply transition-[transform,color] duration-100 ease-in-out': ''
      }
    },

    '&-content': {
      paddingBottom: 'var(--cn-accordion-sm-py)',
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
