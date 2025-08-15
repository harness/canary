export default {
  '.cn-form': {
    '@apply flex flex-col gap-cn-xl': ''
  },

  ':where(.cn-control-group)': {
    gap: 'var(--cn-input-wrapper-gap)',
    '@apply relative flex flex-col': '',
    maxWidth: '100%',

    '&.cn-control-group-horizontal': {
      '@apply flex-row': '',

      '.cn-control-group-label': {
        width: 'var(--cn-input-horizontal-label-max-width)'
      },

      '.cn-control-group-input': {
        '@apply flex-1': ''
      }
    }
  },

  ':where(.cn-control-group-label)': {
    gap: 'var(--cn-layout-3xs)',
    '@apply relative flex flex-col': ''
  },

  ':where(.cn-control-group-input)': {
    gap: 'var(--cn-input-wrapper-gap)',
    '@apply relative flex flex-col': ''
  }
}
