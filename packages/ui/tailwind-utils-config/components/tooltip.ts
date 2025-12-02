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
    boxShadow: 'var(--cn-shadow-2)',
    willChange: 'transform, opacity',
    '@apply z-50 font-caption-normal': '',

    '&-content': {
      '@apply flex flex-col gap-cn-4xs': ''
    },

    '&-title': {
      '@apply font-caption-strong': ''
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
  }
}
