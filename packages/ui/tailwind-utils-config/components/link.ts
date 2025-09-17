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
        /**
         * If a Link component is used with Button component with "asChild",
         * prevent color change on hover
         *
         * !important is added to override Blueprint reset CSS defaults
         */
        '&:not(.cn-button):hover, &:not(.cn-button):where([data-hovered="true"])': {
          color: 'var(--cn-comp-link-text-hover) !important'
        }
      },

      /**
       * If a Link component is used with Button component with "asChild",
       * remove underline on hover
       *
       * !important is added to override Blueprint reset CSS defaults
       */
      '&:not(.cn-button):not(.cn-link-no-underline):hover, &:not(.cn-button):not(.cn-link-no-underline):where([data-hovered="true"])':
        {
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
