export default {
  '.cn-form': {
    '@apply flex flex-col gap-y-7': ''
  },

  ':where(.cn-control-group)': {
    gap: 'var(--cn-input-wrapper-gap)',
    '@apply relative flex flex-col': '',
    maxWidth: '100%'
  }
}
