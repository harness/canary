export default {
  '.label': {
    font: 'var(--cn-body-strong)',
    letterSpacing: 'var(--cn-tracking-tight)',

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
      color: 'var(--cn-text-3)',
      verticalAlign: 'baseline'
    }
  }
}
