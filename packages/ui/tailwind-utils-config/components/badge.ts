export default {
  '.badge': {
    border: 'var(--cn-badge-border) solid var(--cn-component-badge-default-border)',
    color: 'var(--cn-component-badge-default-text)',
    backgroundColor: 'var(--cn-component-badge-default-background)',
    padding: 'var(--cn-badge-default-py) var(--cn-badge-default-px)',
    gap: 'var(--cn-badge-default-gap)',
    height: 'var(--cn-badge-size-default)',

    // '&:hover': {
    //   backgroundColor: 'var(--cn-state-hover)'
    // },
    // font: theme!('font.caption.soft'),

    /**
     * Variants
     */
    '&-neutral': {
      color: 'var(--cn-component-badge-neutral-text)',
      backgroundColor: 'var(--cn-component-badge-neutral-background)',
      borderColor: 'var(--cn-component-badge-neutral-border)'
    },
    '&-success': {
      color: 'var(--cn-component-badge-success-text)',
      backgroundColor: 'var(--cn-component-badge-success-background)',
      borderColor: 'var(--cn-component-badge-success-border)'
    },
    '&-warning': {
      color: 'var(--cn-component-badge-warning-text)',
      backgroundColor: 'var(--cn-component-badge-warning-background)',
      borderColor: 'var(--cn-component-badge-warning-border)'
    },
    '&-danger': {
      color: 'var(--cn-component-badge-danger-text)',
      backgroundColor: 'var(--cn-component-badge-danger-background)',
      borderColor: 'var(--cn-component-badge-danger-border)'
    },
    '&-running': {
      color: 'var(--cn-component-badge-running-text)',
      backgroundColor: 'var(--cn-component-badge-running-background)',
      borderColor: 'var(--cn-component-badge-running-border)'
    },
    '&-merged': {
      color: 'var(--cn-component-badge-merged-text)',
      backgroundColor: 'var(--cn-component-badge-merged-background)',
      borderColor: 'var(--cn-component-badge-merged-border)'
    },
    '&-ai': {
      color: 'var(--cn-component-badge-ai-text)',
      backgroundImage: `linear-gradient(to right, var(--cn-component-badge-ai-background), var(--cn-component-badge-ai-background)), var(--cn-component-badge-ai-border)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      border: '1px solid transparent'
    },

    /**
     * Rounded
     */

    '&-rounded': {
      '&-default': {
        borderRadius: 'var(--cn-badge-default-radius)'
      },

      '&-full': {
        padding: 'var(--cn-badge-default-py) var(--cn-badge-rounded-px)',
        borderRadius: 'var(--cn-badge-rounded-radius)'
      }
    },

    /**
     * Size
     */

    '&-sm': {
      height: 'var(--cn-badge-size-sm)',
      // font: 'var(--cn-caption-soft)'
      '@apply font-caption-soft': ''
    }
  }
}
