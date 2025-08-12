export default {
  '.cn-tooltip': {
    minWidth: 'var(--cn-tooltip-min)',
    maxWidth: 'var(--cn-tooltip-max)',
    borderRadius: 'var(--cn-tooltip-radius)',
    border: 'var(--cn-tooltip-border) solid var(--cn-set-gray-solid-bg)',
    background: 'var(--cn-set-gray-solid-bg)',
    padding: 'var(--cn-tooltip-py) var(--cn-tooltip-px)',
    color: 'var(--cn-set-gray-solid-text)',
    '@apply flex flex-col z-50 font-body-normal data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95':
      '',

    '&-title': {
      '@apply font-body-strong': ''
    },

    '&-arrow': {
      color: 'var(--cn-set-gray-solid-bg)',
      '@apply w-5 h-2': ''
    }
  }
}
