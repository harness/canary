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
    '@apply overflow-auto flex flex-col z-50 font-body-normal data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95':
      '',

    '&-title': {
      '@apply font-body-strong': ''
    },

    '& span:has(.cn-tooltip-arrow)': {
      margin: '1px !important'
    },

    '&-arrow': {
      color: 'var(--cn-bg-3)',
      stroke: 'var(--cn-border-3)',
      '@apply w-5 h-2': ''
    }
  }
}
