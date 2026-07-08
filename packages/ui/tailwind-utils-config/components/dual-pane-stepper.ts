export default {
  '.cn-dual-pane-stepper-root': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--cn-bg-0)',
    overflow: 'hidden'
  },

  '.cn-dual-pane-stepper-header': {
    padding: 'var(--cn-spacing-3) var(--cn-spacing-4)',
    borderBottom: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    flexShrink: '0'
  },

  '.cn-dual-pane-stepper-close-btn': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'var(--cn-size-5)',
    height: 'var(--cn-size-5)',
    color: 'var(--cn-text-2)',
    flexShrink: '0',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '0',

    '&:hover': {
      color: 'var(--cn-text-1)'
    }
  },

  '.cn-dual-pane-stepper-panels': {
    display: 'flex',
    flex: '1',
    minHeight: '0',
    overflow: 'hidden'
  },

  '.cn-dual-pane-stepper-left-pane': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '0',
    padding: 'var(--cn-spacing-6)',
    background: 'var(--cn-bg-1)',
    borderRight: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    overflowY: 'auto',
    overflowX: 'hidden'
  },

  '.cn-dual-pane-stepper-right-pane': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--cn-bg-1)',
    overflow: 'hidden'
  },

  '.cn-dual-pane-stepper-content-header': {
    padding: 'var(--cn-spacing-6) var(--cn-spacing-6) 0',
    flexShrink: '0'
  },

  '.cn-dual-pane-stepper-card-stack': {
    overflow: 'auto',
    flex: '1',
    minHeight: '0',
    scrollbarWidth: 'none',

    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },

  '.cn-dual-pane-stepper-card-stack-inner': {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--cn-spacing-6)',
    paddingLeft: 'var(--cn-spacing-6)',
    paddingRight: 'var(--cn-spacing-6)',

    '&::before, &::after': {
      content: "''",
      display: 'block',
      minHeight: '35vh',
      flexShrink: '0'
    }
  }
}
