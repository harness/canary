export default {
  '.cn-label': {
    '@apply font-body-tight-strong': '',

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

    '&-optional': {
      '@apply font-body-normal': '',
      color: 'var(--cn-text-3)'
    }
  }
}
