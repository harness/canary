export default {
  '.cn-single-pane-stepper-root': {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '440px',
    height: '100%',
    flex: '1',
    minHeight: '0',
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
    marginBottom: 'var(--cn-spacing-6)'
  },

  '.cn-single-pane-stepper-card-stack': {
    overflow: 'auto',
    flex: '1',
    minHeight: '0',
    scrollbarWidth: 'none',

    '&::-webkit-scrollbar': {
      display: 'none'
    },

    '& .cn-flow-stepper-card': {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      padding: '0'
    },

    '& .cn-flow-stepper-card-active, & .cn-flow-stepper-card-error, & .cn-flow-stepper-card-finished, & .cn-flow-stepper-card-completed':
      {
        background: 'transparent',
        boxShadow: 'none'
      },

    '& .cn-flow-stepper-card-content': {
      marginTop: '0',
      paddingLeft: '0'
    },

    '& .cn-flow-stepper-card-description': {
      paddingLeft: '0',
      marginTop: '0',
      marginBottom: 'var(--cn-spacing-3)'
    },

    '& .cn-flow-stepper-card-content-only': {
      position: 'relative'
    },

    '& .cn-flow-stepper-card-content-only .cn-flow-stepper-card-edit': {
      position: 'absolute',
      top: '0',
      right: '0'
    }
  },

  '.cn-single-pane-stepper-card-stack-inner': {
    padding: 'var(--cn-spacing-6)',

    '&::after': {
      content: "''",
      display: 'block',
      minHeight: '35vh',
      flexShrink: '0'
    }
  }
}
