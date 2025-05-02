export default {
  '.cn-link': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--cn-link-gap-default)',
    width: 'fit-content',
    font: 'var(--cn-comp-link-default)',

    '&:where(.cn-link-default)': {
      color: 'var(--cn-comp-link-text)'
    },

    '&:where(.cn-link-secondary)': {
      color: 'var(--cn-text-1)'
    },

    '&:where(.cn-link-sm)': {
      gap: 'var(--cn-link-gap-sm)',
      font: 'var(--cn-comp-link-sm)'
    },

    '&:where([data-disabled="false"])': {
      '&:where(.cn-link-default)': {
        '&:hover, &:where([data-hovered="true"])': {
          color: 'var(--cn-comp-link-text-hover)'
        }
      },

      '&:hover, &:where([data-hovered="true"])': {
        textDecoration: 'underline',
        textUnderlineOffset: '4px'
      }
    },

    '&:where([data-disabled="true"])': {
      color: 'var(--cn-state-disabled-text)',

      '&:hover, > a:hover': {
        cursor: 'not-allowed'
      }
    },

    '> .cn-link-icon': {
      width: '12px',
      height: '12px'
    }
  }
}
