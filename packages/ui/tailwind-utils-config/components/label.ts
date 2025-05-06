export default {
  '.label': {
    '@apply font-body-strong': '',

    '&:where(.label-default)': {
      color: 'var(--cn-text-2)',

      '+ .label-informer': {
        color: 'var(--cn-text-2)'
      }
    },

    '&:where(.label-primary)': {
      color: 'var(--cn-text-1)',

      '+ .label-informer': {
        color: 'var(--cn-text-1)'
      }
    },

    '> .label-optional': {
      '@apply font-body-normal': '',
      color: 'var(--cn-text-3)'
    }
  }
}
