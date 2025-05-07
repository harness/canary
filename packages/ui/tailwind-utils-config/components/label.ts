export default {
  '.cn-label': {
    '@apply font-body-strong': '',
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    justifyContent: 'start',
    gap: 'var(--cn-spacing-half)',

    '&:where(.cn-label-default)': {
      color: 'var(--cn-text-2)',

      '+ .cn-label-informer': {
        color: 'var(--cn-text-2)'
      }
    },

    '&:where(.cn-label-primary)': {
      color: 'var(--cn-text-1)',

      '+ .cn-label-informer': {
        color: 'var(--cn-text-1)'
      }
    },

    '&:where(.cn-label-disabled), &:where(.cn-label-disabled) > .cn-label-optional': {
      color: 'var(--cn-state-disabled-text)'
    },

    '&-container': {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--cn-spacing-1)'
    },

    '&-text': {
      '@apply truncate': ''
    },

    '&-optional': {
      '@apply font-body-normal': '',
      color: 'var(--cn-text-3)'
    }
  }
}
