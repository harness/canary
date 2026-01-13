export default {
  '.cn-prompt-input': {
    borderRadius: 'var(--cn-input-radius)',
    padding: 'var(--cn-input-md-pl)',
    backgroundColor: 'var(--cn-set-gray-outline-bg)',
    border: 'var(--cn-input-ai-border) solid var(--cn-set-gray-outline-border)',

    '.cn-textarea': {
      boxShadow: 'none',
      border: 'none',
      padding: 'var(--cn-spacing-none)',
      backgroundColor: 'transparent',
      minHeight: 'var(--cn-size-10)',
      maxHeight: 'var(--cn-size-64)',

      '&:focus-visible': {
        boxShadow: 'none',
        outline: 'none'
      },

      '&:hover': {
        boxShadow: 'none'
      }
    },

    '&:has(.cn-textarea:focus-visible)': {
      backgroundImage: 'var(--cn-set-ai-outline-bg-gradient), var(--cn-set-ai-outline-border)',
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      backgroundSize: '800% 800%, 100% 100%',
      border: 'var(--cn-input-ai-border) solid transparent',
      boxShadow: '0 0 12px 2px color-mix(in srgb, var(--cn-set-brand-primary-bg) 30%, transparent)'
    }
  }
}
