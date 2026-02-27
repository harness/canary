export default {
  '.cn-tooltip': {
    minWidth: 'var(--cn-tooltip-min)',
    maxWidth: 'var(--cn-tooltip-max)',
    maxHeight: 'calc(var(--radix-tooltip-content-available-height) - 4px)',
    borderRadius: 'var(--cn-tooltip-radius)',
    border: 'var(--cn-tooltip-border) solid var(--cn-border-3)',
    background: 'var(--cn-bg-3)',
    padding: 'var(--cn-tooltip-py) var(--cn-tooltip-px)',
    color: 'var(--cn-text-1)',
    boxShadow: 'var(--cn-shadow-4)',
    willChange: 'transform, opacity',
    '@apply z-50 flex flex-col overflow-visible font-caption-normal': '',

    '&-content': {
      '@apply flex min-h-0 flex-1 flex-col gap-cn-4xs overflow-hidden': ''
    },

    '&-content-body': {
      '@apply min-h-0 flex-1 overflow-auto': ''
    },

    '&-title': {
      '@apply shrink-0 font-caption-strong': ''
    },

    '&-content-footer': {
      '@apply flex shrink-0 items-center pt-cn-4xs': ''
    },

    '&-arrow': {
      color: 'var(--cn-bg-3)',
      stroke: 'var(--cn-border-3)',
      '@apply w-5 h-2': ''
    },

    // Arrow positioning for align variants
    '&[data-align="start"] span:has(.cn-tooltip-arrow)': {
      left: 'var(--cn-spacing-2) !important',
      right: 'auto !important'
    },

    '&[data-align="end"] span:has(.cn-tooltip-arrow)': {
      right: 'var(--cn-spacing-2) !important',
      left: 'auto !important'
    },

    '&-default': {
      border: 'var(--cn-tooltip-border) solid var(--cn-comp-tooltip-border)',
      background: 'var(--cn-comp-tooltip-bg)',
      color: 'var(--cn-comp-tooltip-text)',

      '& .cn-tooltip-arrow': {
        color: 'var(--cn-comp-tooltip-bg)',
        stroke: 'var(--cn-comp-tooltip-border)'
      },

      '& .cn-tooltip-content-footer': {
        color: 'var(--cn-comp-tooltip-text)'
      }
    }
  }
}
