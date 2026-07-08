export default {
  '.cn-yaml-output-panel': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--cn-bg-0)',
    border: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    borderRadius: 'var(--cn-rounded-3)',
    overflow: 'hidden'
  },

  '.cn-yaml-output-header': {
    padding: 'var(--cn-spacing-3) var(--cn-spacing-4)',
    borderBottom: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    flexShrink: '0'
  },

  '.cn-yaml-output-editor': {
    flex: '1',
    minHeight: '0',
    overflow: 'hidden'
  }
}