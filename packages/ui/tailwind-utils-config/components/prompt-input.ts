export default {
  '@property --cn-angle': {
    syntax: '"<angle>"',
    inherits: 'true',
    initialValue: '131deg'
  },

  '.cn-prompt-input': {
    borderRadius: 'var(--cn-input-ai-radius)',
    padding: 'var(--cn-input-ai-container)',
    backgroundColor: 'var(--cn-comp-input-bg)',
    // Default: solid border using background trick for consistent transitions
    border: 'var(--cn-input-ai-border) solid transparent',
    background:
      'linear-gradient(var(--cn-comp-input-bg), var(--cn-comp-input-bg)) padding-box, linear-gradient(var(--cn-border-2), var(--cn-border-2)) border-box',
    gap: 'var(--cn-input-ai-gap)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: 'var(--cn-input-ai-min-height)',
    maxHeight: 'var(--cn-input-ai-max-height)',
    transition: 'box-shadow 0.2s ease-in-out',

    '.cn-textarea': {
      boxShadow: 'none',
      border: 'none',
      padding: 'var(--cn-spacing-none)',
      backgroundColor: 'transparent',
      minHeight: 'var(--cn-size-10)',

      '&:focus-visible': {
        boxShadow: 'none',
        outline: 'none'
      },

      '&:hover': {
        boxShadow: 'none'
      }
    },

    // Hover: gradient border
    '&:hover': {
      background:
        'linear-gradient(var(--cn-comp-input-bg), var(--cn-comp-input-bg)) padding-box, conic-gradient(from 131deg, var(--cn-gradient-ai-stop-3), var(--cn-gradient-ai-stop-2), var(--cn-gradient-ai-stop-1), var(--cn-gradient-ai-stop-2), var(--cn-gradient-ai-stop-3)) border-box'
    },

    // Focus: animated gradient border + animated glow
    '&:has(.cn-textarea:focus-visible)': {
      background:
        'linear-gradient(var(--cn-comp-input-bg), var(--cn-comp-input-bg)) padding-box, conic-gradient(from var(--cn-angle), var(--cn-gradient-ai-stop-3), var(--cn-gradient-ai-stop-2), var(--cn-gradient-ai-stop-1), var(--cn-gradient-ai-stop-2), var(--cn-gradient-ai-stop-3)) border-box',
      animation: 'cn-spin 4s linear infinite, cn-glow-in 0.3s ease-out forwards, cn-glow 5s ease-in-out infinite 0.3s'
    }
  },

  '@keyframes cn-spin': {
    from: { '--cn-angle': '131deg' },
    to: { '--cn-angle': '491deg' }
  },

  '@keyframes cn-glow-in': {
    from: {
      boxShadow: '0 0 0 0 transparent, 0 0 0 0 transparent, 0 0 0 0 transparent'
    },
    to: {
      boxShadow: '0 0 3px 0 color-mix(in srgb, var(--cn-gradient-ai-stop-1) 30%, transparent), 0 0 12px 2px color-mix(in srgb, var(--cn-gradient-ai-stop-1) 15%, transparent), 0 0 28px 6px color-mix(in srgb, var(--cn-gradient-ai-stop-1) 8%, transparent)'
    }
  },

  '@keyframes cn-glow': {
    '0%, 100%': {
      boxShadow: '0 0 3px 0 color-mix(in srgb, var(--cn-gradient-ai-stop-1) 30%, transparent), 0 0 12px 2px color-mix(in srgb, var(--cn-gradient-ai-stop-1) 15%, transparent), 0 0 28px 6px color-mix(in srgb, var(--cn-gradient-ai-stop-1) 8%, transparent)'
    },
    '33%': {
      boxShadow: '0 0 3px 0 color-mix(in srgb, var(--cn-gradient-ai-stop-2) 30%, transparent), 0 0 12px 2px color-mix(in srgb, var(--cn-gradient-ai-stop-2) 15%, transparent), 0 0 28px 6px color-mix(in srgb, var(--cn-gradient-ai-stop-2) 8%, transparent)'
    },
    '66%': {
      boxShadow: '0 0 3px 0 color-mix(in srgb, var(--cn-gradient-ai-stop-3) 30%, transparent), 0 0 12px 2px color-mix(in srgb, var(--cn-gradient-ai-stop-3) 15%, transparent), 0 0 28px 6px color-mix(in srgb, var(--cn-gradient-ai-stop-3) 8%, transparent)'
    }
  }
}
