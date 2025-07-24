export default {
  '.cn-form': {
    '@apply flex flex-col gap-y-7': ''
  },

  ':where(.cn-control-group)': {
    gap: 'var(--cn-input-wrapper-gap)',
    '@apply relative flex flex-col': '',
    maxWidth: '100%',

    '&.cn-control-group-horizontal': {
      '@apply flex-row items-baseline': '',
      '&:has(.cn-control-group-label .cn-caption)': {
        '@apply items-start': ''
      },

      '.cn-control-group-label': {
        maxWidth: 'var(--cn-input-horizontal-label-max-width)',
        '@apply justify-center': ''
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
