export default {
  '.cn-popover': {
    '&-content': {
      display: 'grid',
      minWidth: 'var(--cn-tooltip-min)',
      maxWidth: 'var(--cn-tooltip-max)',
      padding: 'var(--cn-tooltip-py) var(--cn-tooltip-px)',
      gap: 'var(--cn-popover-gap)',
      borderRadius: 'var(--cn-popover-radius)',
      border: 'var(--cn-tooltip-border) solid var(--cn-border-3)',
      backgroundColor: 'var(--cn-bg-3)',
      boxShadow: 'var(--cn-shadow-2)',
      color: 'var(--cn-text-1)',
      outline: 'none',
      '@apply z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95':
        '',

      '& > span:has(.cn-popover-arrow)': {
        margin: '1px !important'
      }
    },

    '&-arrow': {
      color: 'var(--cn-bg-3)',
      stroke: 'var(--cn-border-3)',
      '@apply w-5 h-2': ''
    }
  }
}
