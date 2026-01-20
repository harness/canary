export default {
  '.cn-popover': {
    '&-content': {
      display: 'grid',
      minWidth: 'var(--cn-popover-min)',
      padding: 'var(--cn-popover-py) var(--cn-popover-px)',
      gap: 'var(--cn-popover-gap)',
      borderRadius: 'var(--cn-popover-radius)',
      border: 'var(--cn-popover-border) solid var(--cn-border-3)',
      backgroundColor: 'var(--cn-bg-3)',
      boxShadow: 'var(--cn-shadow-4)',
      color: 'var(--cn-text-1)',
      outline: 'none',
      willChange: 'transform, opacity',
      '@apply z-50': '',

      '& > span:has(.cn-popover-arrow)': {
        margin: '1px !important'
      },
      '&-max-size': {
        maxWidth: 'var(--cn-popover-max)'
      }
    },

    '&-arrow': {
      color: 'var(--cn-bg-3)',
      stroke: 'var(--cn-border-3)',
      '@apply w-5 h-2': ''
    },

    '&-content-default': {
      display: 'grid',
      minWidth: 'var(--cn-popover-min)',
      padding: 'var(--cn-popover-py) var(--cn-popover-px)',
      gap: 'var(--cn-popover-gap)',
      borderRadius: 'var(--cn-popover-radius)',
      border: 'var(--cn-popover-border) solid var(--cn-comp-tooltip-border)',
      backgroundColor: 'var(--cn-comp-tooltip-bg)',
      boxShadow: 'var(--cn-shadow-4)',
      color: 'var(--cn-comp-tooltip-text)',
      outline: 'none',
      willChange: 'transform, opacity',
      '@apply z-50': '',

      '& > span:has(.cn-popover-arrow)': {
        margin: '1px !important'
      },
      '&-max-size': {
        maxWidth: 'var(--cn-popover-max)'
      },

      '& .cn-popover-arrow': {
        color: 'var(--cn-comp-tooltip-bg)',
        stroke: 'var(--cn-comp-tooltip-border)'
      }
    },

    '&-content-custom': {
      display: 'grid',
      borderRadius: 'var(--cn-popover-radius)',
      border: 'var(--cn-popover-border) solid var(--cn-border-3)',
      backgroundColor: 'var(--cn-bg-3)',
      boxShadow: 'var(--cn-shadow-4)',
      color: 'var(--cn-text-1)',
      outline: 'none',
      willChange: 'transform, opacity',
      '@apply z-50': '',

      '& > span:has(.cn-popover-arrow)': {
        margin: '1px !important'
      }
    },

    '&-content-custom-default': {
      display: 'grid',
      borderRadius: 'var(--cn-popover-radius)',
      border: 'var(--cn-popover-border) solid var(--cn-comp-tooltip-border)',
      backgroundColor: 'var(--cn-comp-tooltip-bg)',
      boxShadow: 'var(--cn-shadow-4)',
      color: 'var(--cn-comp-tooltip-text)',
      outline: 'none',
      willChange: 'transform, opacity',
      '@apply z-50': '',

      '& > span:has(.cn-popover-arrow)': {
        margin: '1px !important'
      },

      '& .cn-popover-arrow': {
        color: 'var(--cn-comp-tooltip-bg)',
        stroke: 'var(--cn-comp-tooltip-border)'
      }
    }
  }
}
