import { PluginAPI } from 'tailwindcss/types/config'

export default {
  '.badge': {
    border: 'var(--canary-badge-border) solid var(--canary-component-badge-default-border)',
    color: 'var(--canary-component-badge-default-text)',
    backgroundColor: 'var(--canary-component-badge-default-background)',
    padding: 'var(--canary-badge-default-py) var(--canary-badge-default-px)',
    gap: 'var(--canary-badge-default-gap)',
    height: 'var(--canary-badge-size-default)',
    // font: theme!('font.caption.soft'),

    /**
     * Variants
     */
    '&-neutral': {
      color: 'var(--canary-component-badge-neutral-text)',
      backgroundColor: 'var(--canary-component-badge-neutral-background)',
      borderColor: 'var(--canary-component-badge-neutral-border)'
    },
    '&-success': {
      color: 'var(--canary-component-badge-success-text)',
      backgroundColor: 'var(--canary-component-badge-success-background)',
      borderColor: 'var(--canary-component-badge-success-border)'
    },
    '&-warning': {
      color: 'var(--canary-component-badge-warning-text)',
      backgroundColor: 'var(--canary-component-badge-warning-background)',
      borderColor: 'var(--canary-component-badge-warning-border)'
    },
    '&-danger': {
      color: 'var(--canary-component-badge-danger-text)',
      backgroundColor: 'var(--canary-component-badge-danger-background)',
      borderColor: 'var(--canary-component-badge-danger-border)'
    },
    '&-running': {
      color: 'var(--canary-component-badge-running-text)',
      backgroundColor: 'var(--canary-component-badge-running-background)',
      borderColor: 'var(--canary-component-badge-running-border)'
    },
    '&-merged': {
      color: 'var(--canary-component-badge-merged-text)',
      backgroundColor: 'var(--canary-component-badge-merged-background)',
      borderColor: 'var(--canary-component-badge-merged-border)'
    },
    '&-ai': {
      color: 'var(--canary-component-badge-ai-text)',
      backgroundImage: `linear-gradient(to right, var(--canary-component-badge-ai-background), var(--canary-component-badge-ai-background)), var(--canary-component-badge-ai-border)`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'padding-box, border-box',
      border: '1px solid transparent'
    },

    /**
     * Rounded
     */

    '&-rounded': {
      '&-default': {
        borderRadius: 'var(--canary-badge-default-radius)'
      },

      '&-full': {
        padding: 'var(--canary-badge-default-py) var(--canary-badge-rounded-px)',
        borderRadius: 'var(--canary-badge-rounded-radius)'
      }
    },

    /**
     * Size
     */

    '&-sm': {
      height: 'var(--canary-badge-size-sm)',
      // font: 'var(--canary-caption-soft)'
      '@apply font-caption-soft': ''
    }
  }
}
