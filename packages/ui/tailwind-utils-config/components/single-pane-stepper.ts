export default {
  '.cn-single-pane-stepper-root': {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    background: 'var(--cn-bg-0)',
    overflow: 'hidden'
  },

  '.cn-single-pane-stepper-header': {
    padding: 'var(--cn-spacing-3) var(--cn-spacing-4)',
    borderBottom: 'var(--cn-spacing-px) solid var(--cn-border-3)',
    flexShrink: '0'
  },

  '.cn-single-pane-stepper-close-btn': {
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

  '.cn-single-pane-stepper-content-header': {
    padding: 'var(--cn-spacing-6) var(--cn-spacing-6) 0',
    flexShrink: '0'
  },

  '.cn-single-pane-stepper-card-stack': {
    overflow: 'auto',
    flex: '1',
    minHeight: '0',
    scrollbarWidth: 'none',

    '&::-webkit-scrollbar': {
      display: 'none'
    }
  },

  '.cn-single-pane-stepper-card-stack-inner': {
    padding: 'var(--cn-spacing-6)',

    '&::before, &::after': {
      content: "''",
      display: 'block',
      minHeight: '35vh',
      flexShrink: '0'
    }
  }
}