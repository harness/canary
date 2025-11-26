export default {
  '.cn-prompt-input': {
    borderRadius: 'var(--cn-input-radius)',
    padding: 'var(--cn-input-md-pl)',
    backgroundColor: 'var(--cn-set-gray-outline-bg)',

    // AI gradient border
    backgroundImage: 'var(--cn-set-ai-outline-bg-gradient), var(--cn-set-ai-outline-border)',
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    backgroundSize: '800% 800%, 100% 100%',
    border: 'var(--cn-input-ai-border) solid transparent',

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
    }
  }
}
