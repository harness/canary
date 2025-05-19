export default {
  '.cn-link': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--cn-link-gap-default)',
    width: 'fit-content',
    '@apply font-link-default': '',
    textDecoration: 'underline transparent',
    textUnderlineOffset: '4px',
    transitionProperty: 'color, text-decoration-color',
    transitionDuration: '0.15s',
    transitionTimingFunction: 'ease-in-out',

    '&:focus-visible': {
      outline: 'none'
    },

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
        '&:hover, &:focus, &:where([data-hovered="true"])': {
          color: 'var(--cn-comp-link-text-hover)'
        }
      },

      '&:hover, &:focus, &:where([data-hovered="true"])': {
        textDecorationColor: 'inherit'
      }
    },

    '&:where([data-disabled="true"])': {
      color: 'var(--cn-state-disabled-text)',

      '&:hover, &:focus': {
        cursor: 'not-allowed'
      }
    },

    '> .cn-link-icon': {
      width: '12px',
      height: '12px'
    }
  }
}
