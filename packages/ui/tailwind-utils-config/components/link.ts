export default {
  '.cn-link': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--cn-btn-link-gap-default)',
    width: 'fit-content',
    '@apply font-body-tight-normal': '',

    '&:where(.cn-link-default)': {
      color: 'var(--cn-comp-link-default)'
    },

    '&:where(.cn-link-secondary)': {
      color: 'var(--cn-text-1)'
    },

    '&:where(.cn-link-sm)': {
      gap: 'var(--cn-btn-link-gap-sm)',
      '@apply font-caption-tight-normal': ''
    },

    '&:where([data-disabled="false"])': {
      '&:where(.cn-link-default)': {
        '&:hover, &:has([data-hovered="true"])': {
          color: 'var(--cn-comp-link-hover)'
        }
      },

      '&:hover, &:has([data-hovered="true"])': {
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
