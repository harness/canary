export default {
  '.cn-link': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--cn-link-gap-md)',
    width: 'fit-content',
    '@apply font-link-default': '',
    textDecorationLine: 'none',
    textDecorationColor: 'transparent',
    textUnderlineOffset: '4px',
    transitionProperty: 'color, text-decoration-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease-in-out',

    '&:where(.cn-link-default)': {
      color: 'var(--cn-comp-link-text)'
    },

    '&:where(.cn-link-secondary)': {
      color: 'var(--cn-text-1)'
    },

    '&:where(.cn-link-sm)': {
      gap: 'var(--cn-link-gap-sm)',
      '@apply font-link-sm': ''
    },

    '&:where([data-disabled="false"])': {
      '&:where(.cn-link-default)': {
        '&:hover, &:where([data-hovered="true"])': {
          // Adding important to override Blueprint reset CSS defaults
          color: 'var(--cn-comp-link-text-hover) !important'
        }
      },

      '&:hover, &:where([data-hovered="true"])': {
        textDecorationLine: 'underline !important',
        textDecorationColor: 'inherit !important'
      },

      '&:focus-visible': {
        outline: 'var(--cn-focus)',
        '@apply outline-offset-cn-tight': ''
      }
    },

    '&:where([data-disabled="true"])': {
      cursor: 'not-allowed',
      '@apply opacity-cn-disabled': '',

      '&:hover, &:focus': {
        cursor: 'not-allowed'
      }
    },

    '&:where(.cn-link-no-underline):hover': {
      textDecorationLine: 'none !important'
    }
  }
}
