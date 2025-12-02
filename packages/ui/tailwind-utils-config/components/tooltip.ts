export default {
  '.cn-tooltip': {
    '--tooltip-duration': '150ms',
    '--tooltip-easing': 'cubic-bezier(0.16, 0.84, 0.44, 1)',
    minWidth: 'var(--cn-tooltip-min)',
    maxWidth: 'var(--cn-tooltip-max)',
    maxHeight: 'calc(var(--radix-tooltip-content-available-height) - 4px)',
    borderRadius: 'var(--cn-tooltip-radius)',
    border: 'var(--cn-tooltip-border) solid var(--cn-border-3)',
    background: 'var(--cn-bg-3)',
    padding: 'var(--cn-tooltip-py) var(--cn-tooltip-px)',
    color: 'var(--cn-text-1)',
    boxShadow: 'var(--cn-shadow-2)',
    '@apply z-50': '',

    '&-content': {
      willChange: 'transform, opacity',
      '@apply flex flex-col font-body-normal': '',

      '[data-state="open"] &': {
        animation: 'tooltip-in var(--tooltip-duration) var(--tooltip-easing) forwards'
      },

      '[data-state="closed"] &': {
        animation: 'tooltip-out var(--tooltip-duration) var(--tooltip-easing) forwards'
      }
    },

    '&-title': {
      '@apply font-body-strong': ''
    },

    '&-text': {
      '@apply font-body-normal': ''
    },

    '& span:has(.cn-tooltip-arrow)': {
      margin: '1px !important'
    },

    '&-arrow': {
      color: 'var(--cn-bg-3)',
      stroke: 'var(--cn-border-3)',
      '@apply w-5 h-2': ''
    },

    '&-inverse': {
      border: 'var(--cn-tooltip-border) solid var(--cn-comp-tooltip-inverse-border)',
      background: 'var(--cn-comp-tooltip-inverse-bg)',
      color: 'var(--cn-comp-tooltip-inverse-text)',

      '& .cn-tooltip-arrow': {
        color: 'var(--cn-comp-tooltip-inverse-bg)',
        stroke: 'var(--cn-comp-tooltip-inverse-border)'
      }
    }
  },

  '@keyframes tooltip-in': {
    '0%': {
      opacity: '0',
      transform: 'scale(0.97)'
    },
    '100%': {
      opacity: '1',
      transform: 'scale(1)'
    }
  },

  '@keyframes tooltip-out': {
    '0%': {
      opacity: '1',
      transform: 'scale(1)'
    },
    '100%': {
      opacity: '0',
      transform: 'scale(0.97)'
    }
  }
}
