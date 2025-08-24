export default {
  '.cn-link': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--cn-link-gap-md)',
    width: 'fit-content',
    '@apply font-link-default': '',
    textDecoration: 'underline transparent',
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
          color: 'var(--cn-comp-link-text-hover)'
        }
      },

      '&:hover, &:where([data-hovered="true"])': {
        textDecorationColor: 'inherit'
      },

      '&:focus-visible': {
        outline: 'var(--cn-focus)',
        '@apply outline-offset-cn-tight': ''
      }
    },

    '&:where([data-disabled="true"])': {
      color: 'var(--cn-state-disabled-text)',

      '&:hover, &:focus': {
        cursor: 'not-allowed'
      }
    }
  }
}
